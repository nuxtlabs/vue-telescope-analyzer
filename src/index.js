const puppeteer = require('puppeteer')
const tldParser = require('tld-extract')
const makeDir = require('make-dir')
const { createHash } = require('crypto')
const { URL } = require('url')
const { join } = require('path')
const { tmpdir } = require('os')
const { isCrawlable, puppeteerArgs, puppeteerViewport } = require('./utils')
const { hasVue, getVueMeta, getFramework, getPlugins, getUI, getNuxtMeta, getNuxtModules } = require('./detectors')
const consola = require('consola')

const ERROR_CODES = Object.freeze({
  INVALID_URL: 1,
  HTTP_ERROR: 2,
  NOT_CRAWLABLE: 3,
  VUE_NOT_DETECTED: 4
})
let browser = null

const puppeteerDefaultArgs = {
  args: puppeteerArgs,
  defaultViewport: puppeteerViewport,
  headless: true,
  ignoreHTTPSErrors: true
}

async function analyze (originalUrl, options = {}) {
  // Parse url
  let url
  try {
    url = new URL(originalUrl)
  } catch (e) {
    const error = new Error(`Invalid URL ${originalUrl}`)
    error.code = ERROR_CODES.INVALID_URL
    throw error
  }
  // Start browser if not launched
  if (!browser) {
    if (options.browserWSEndpoint) {
      browser = await puppeteer.connect({
        browserWSEndpoint: options.browserWSEndpoint,
        ...puppeteerDefaultArgs
      });
    } else {
      browser = await puppeteer.launch({
        ...puppeteerDefaultArgs
      })
    }
    browser.on('disconnected', () => {
      browser = null
    })
  }
  // Force https
  originalUrl = 'https://' + url.hostname + url.pathname
  const domain = tldParser(url.origin).domain
  const page = await browser.newPage()
  const infos = {
    url: originalUrl,
    hostname: url.hostname,
    domain: domain,
    meta: {
      language: '',
      title: '',
      description: '',
      siteName: '',
      isAdultContent: false
    },
    vueVersion: null,
    hasSSR: false, // default
    isStatic: true, // default
    framework: null, // nuxt | gridsome | quasar
    plugins: [], // vue-router, vuex, vue-apollo, etc
    ui: null // vuetify | bootstrap-vue | element-ui | tailwindcss
  }
  try {
    await page.setCacheEnabled(false) // disable cache for avoiding 304
    await page.setUserAgent('Vue-Telemetry')
    await page.setViewport({
      width: 1680,
      height: 1260,
      deviceScaleFactor: 1,
    })
    await page.setCookie({
      name: 'gtm_cookie_consent',
      value: 'functional:1|analytics:1|customization:1|advertising:1',
      domain: url.hostname
    })
    // https://github.com/puppeteer/puppeteer/blob/v2.1.0/docs/api.md#pagegotourl-options
    let response
    try {
      response = await page.goto(originalUrl, {
        waitUntil: 'networkidle0',
        timeout: 20000
      })
    } catch (err) {
      response = await page.goto(originalUrl, {
        waitUntil: 'domcontentloaded'
      })
      await page.waitForTimeout(10000)
    }
    if (!response.ok()) {
      const error = new Error(`Website responded with ${response.status()} status code`)
      error.code = ERROR_CODES.HTTP_ERROR
      error.statusCode = response.status()
      error.body = await response.text()
      throw error
    }
    // Get headers
    const headers = response.headers()

    if (!(await isCrawlable(headers))) {
      const error = new Error(`Crawling is not allowed on ${originalUrl}`)
      error.code = ERROR_CODES.NOT_CRAWLABLE
      throw error
    }

    // Get page scripts urls
    let scripts = await page.evaluateHandle(() => Array.from(document.getElementsByTagName('script')).map(({ src }) => src))
    scripts = (await scripts.jsonValue()).filter(script => script)

    // Original HTLM sent back
    const originalHtml = await response.text()

    // Get page html
    const html = await page.content()

    // Use for detection
    const context = { originalHtml, html, scripts, page }

    if (!(await hasVue(context))) {
      const error = new Error(`Vue is not detected on ${originalUrl}`)
      error.code = ERROR_CODES.VUE_NOT_DETECTED
      throw error
    }

    // Get page title
    infos.meta.title = await page.title()
    infos.meta.description = await page.$eval('head > meta[name="description"]', element => element.content).catch(() => '')
    if (!infos.meta.description) {
      infos.meta.description = await page.$eval('head > meta[property="og:description"]', element => element.content).catch(() => '')
    }
    infos.meta.siteName = await page.$eval('head > meta[property="og:site_name"]', element => element.content).catch(() => '')

    const rtaLabel = await page.$eval('head > meta[name="RATING"]', element => element.content).catch(() => '')
    if (rtaLabel.trim() === 'RTA-5042-1996-1400-1577-RTA') {
      infos.meta.isAdultContent = true
    }

    // Get page language
    const matches = html.match(new RegExp('<html[^>]*[: ]lang="([a-z]{2}((-|_)[A-Z]{2})?)"', 'i'));
    if (matches && matches.length) {
      infos.meta.language = matches[1].split('-')[0]
    }

    // Get Vue version
    const version = await page.evaluate('window.$nuxt?.$root?.constructor?.version || window.Vue?.version || [...document.querySelectorAll("*")].map((el) => el.__vue__?.$root?.constructor?.version || el.__vue_app__?.version).filter(Boolean)[0]')
    if (version) {
      infos.vueVersion = version
    }

    // Get Vue metas
    const { ssr } = await getVueMeta(context)
    infos.hasSSR = ssr

    // Get Vue ecosystem infos
    infos.framework = await getFramework(context)
    infos.plugins = await getPlugins(context)
    infos.ui = await getUI(context)

    // Get Nuxt modules if using NuxtJS
    if (infos.framework && infos.framework.name === 'NuxtJS') {
      const [meta, modules] = await Promise.all([
        getNuxtMeta(context),
        getNuxtModules(context)
      ])
      infos.isStatic = meta.static
      infos.hasSSR = meta.ssr
      infos.frameworkModules = modules
    }

    // Take screenshot
    const screenshotsDir = join(tmpdir(), 'vue-telemetry-analyzer')
    const filename = createHash('md5').update(originalUrl).digest('hex')
    infos.screenshot = join(screenshotsDir, `${filename}.jpg`)
    await makeDir(screenshotsDir)
    await page.screenshot({
      path: infos.screenshot,
      type: 'jpeg',
      quality: 90
    })

    await page.close()
    return infos
  } catch (err) {
    await page.close()
    throw err
  }
}

module.exports = analyze
module.exports.ERROR_CODES = ERROR_CODES
module.exports.close = async function () {
  if (browser) {
    await browser.close()
  }
}
