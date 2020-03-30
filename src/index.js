const puppeteer = require('puppeteer')
const tldParser = require('tld-extract')
const makeDir = require('make-dir')
const { URL } = require('url')
const { join } = require('path')
const { tmpdir } = require('os')
const { isValidUrl } = require('./utils')
const { hasVue, getFramework, getPlugins, getUI, getNuxtMeta, getNuxtModules } = require('./detectors')

let browser = puppeteer.launch({
  args: ['--no-sandbox', '--headless', '--disable-gpu', '--ignore-certificate-errors']
})

module.exports = async function (originalUrl) {
  // Make sure browser is running
  if (browser instanceof Promise) {
    browser = await browser
  }
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
  await page.goto(originalUrl, {
    waitUntil: 'networkidle0'
  })
  // Get page scripts urls
  let scripts = await page.evaluateHandle(() => Array.from(document.getElementsByTagName('script')).map(({ src }) => src))
  scripts = (await scripts.jsonValue()).filter(script => script)

  // Get page html
  const html = await page.content()

  // Use for detection
  const context = { html, scripts, page }

  if (!(await hasVue(context))) {
    return consola.warn('Vue is not detected on %s', originalUrl)
  }

  // Get page title
  infos.meta.title = await page.title()
  infos.meta.description = await page.$eval('head > meta[name="description"]', element => element.content)

  // Get page language
  const matches = html.match(new RegExp('<html[^>]*[: ]lang="([a-z]{2}((-|_)[A-Z]{2})?)"', 'i'));
  if (matches && matches.length) {
    infos.meta.language = matches[1].split('-')[0]
  }

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
    infos.nuxt = { ...meta, modules }
  }

  // Take screenshot
  const screenshotsDir = join(tmpdir(), 'vue-telemetry-analyzer')
  infos.screenshot = join(screenshotsDir, `${url.hostname}.jpg`)
  await makeDir(screenshotsDir)
  await page.screenshot({
    path: infos.screenshot,
    type: 'jpeg',
    quality: 90
  })

  return infos
}
