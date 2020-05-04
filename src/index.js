const chromium = require('chrome-aws-lambda')
const tldParser = require('tld-extract')
const makeDir = require('make-dir')
const { createHash } = require('crypto')
const { URL } = require('url')
const { join } = require('path')
const { tmpdir } = require('os')
const { isCrawlable } = require('./utils')
const { hasVue, getVueMeta, getFramework, getPlugins, getUI, getNuxtMeta, getNuxtModules } = require('./detectors')
const consola = require('consola')

async function getPuppeteerPath() {
  let executablePath = await chromium.executablePath

  if (process.env.NETLIFY_DEV) {
    executablePath = null // forces to use local puppeteer
  }

  return executablePath
}

module.exports = async function (originalUrl) {
  const executablePath = await getPuppeteerPath()
  const browser = await chromium.puppeteer.launch({
    executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: true
  })
  // Parse url
  let url
  try {
    url = new URL(originalUrl)
  } catch (e) {
    throw new Error(`Invalid URL ${originalUrl}`)
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
      description: ''
    },
    vueVersion: null,
    hasSSR: false, // default
    isStatic: true, // default
    framework: null, // nuxt | gridsome | quasar
    plugins: [], // vue-router, vuex, vue-apollo, etc
    ui: null // vuetify | bootstrap-vue | element-ui | tailwindcss
  }

  await page.setUserAgent('Vue-Telemetry')
  await page.setViewport({
    width: 1738,
    height: 1080,
    deviceScaleFactor: 1,
  })
  await page.setCookie({
    name: 'gtm_cookie_consent',
    value: 'functional:1|analytics:1|customization:1|advertising:1',
    domain: url.hostname
  })
  // https://github.com/puppeteer/puppeteer/blob/v2.1.0/docs/api.md#pagegotourl-options
  const response = await page.goto(originalUrl, {
    waitUntil: 'networkidle0'
  })
  if (!response.ok()) {
    const error = new Error(`Website responded with ${response.status()} status code`)
    error.statusCode = response.status()
    error.apiCode = response.status() || null
    error.body = await response.text()
    throw error
  }
  // Get headers
  const headers = response.headers()

  if (!(await isCrawlable(headers))) {
    const error = new Error(`Crawling is not allowed on ${originalUrl}`)
    error.statusCode = response.status()
    error.apiCode = response.status() || null
    error.body = await response.text()
    throw error
    //throw new Error(`Crawling is not allowed on ${originalUrl}`)
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
    error.statusCode = response.status()
    error.apiCode = 1
    error.body = await response.text()
    throw error
    //throw new Error(`Vue is not detected on ${originalUrl}`)
  }

  // Get page title
  infos.meta.title = await page.title()
  infos.meta.description = await page.$eval('head > meta[name="description"]', element => element.content).catch(() => '')
  if (!infos.meta.description) {
    infos.meta.description = await page.$eval('head > meta[property="og:description"]', element => element.content).catch(() => '')
  }

  // Get page language
  const matches = html.match(new RegExp('<html[^>]*[: ]lang="([a-z]{2}((-|_)[A-Z]{2})?)"', 'i'));
  if (matches && matches.length) {
    infos.meta.language = matches[1].split('-')[0]
  }

  // Get Vue version
  const version = await page.evaluate('(window.$nuxt && window.$nuxt.$root && window.$nuxt.$root.constructor.version) || (window.Vue && window.Vue.version) || [...document.querySelectorAll("*")].map((el) => el.__vue__ && el.__vue__.$root && el.__vue__.$root.constructor.version).filter(Boolean)[0]')
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

  // Get Nuxt modules if using Nuxt
  if (infos.framework === 'nuxt') {
    const [ meta, modules ] = await Promise.all([
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

  // Close browser
  await browser.close()

  return infos
}
