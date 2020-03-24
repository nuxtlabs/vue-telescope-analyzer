const consola = require('consola')
const puppeteer = require('puppeteer')
const tldParser = require('tld-extract')
const argv = require('yargs').argv
const { URL } = require('url')
const { join } = require('path')
const { isValidUrl } = require('./utils')
const { hasVue, getFramework, getPlugins, getUI, getNuxtMeta, getNuxtModules } = require('./detectors')

let browser = puppeteer.launch({
  args: ['--no-sandbox', '--headless', '--disable-gpu', '--ignore-certificate-errors']
})

async function detect(originalUrl) {
  // Make sure browser is running
  if (browser instanceof Promise) {
    browser = await browser
  }
  // Parse url
  let url
  try {
    url = new URL(originalUrl)
  } catch (e) {
    return consola.warn('Invalid URL %s', originalUrl)
  }
  // Force https
  originalUrl = 'https://' + url.hostname + url.pathname
  const domain = tldParser(url.origin).domain
  const logger = consola.withTag(url.hostname)
  const hrstart = process.hrtime()
  logger.info(`Detecting Vue on ${originalUrl}`)
  const page = await browser.newPage()
  const infos = {
    url: originalUrl,
    hostname: url.hostname,
    domain: domain,
    language: null,
    framework: null, // nuxt | gridsome | quasar
    plugins: [], // vue-router, vuex, vue-apollo, etc
    ui: null // vuetify | bootstrap-vue | element-ui | tailwindcss
  }

  try {
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
    infos.title = await page.title()

    // Get page language
    const matches = html.match(new RegExp('<html[^>]*[: ]lang="([a-z]{2}((-|_)[A-Z]{2})?)"', 'i'));
    if (matches && matches.length) {
      infos.language = matches[1].split('-')[0]
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

    const hrend = process.hrtime(hrstart)
    logger.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

    logger.info('Saving screenshot...')
    // Take screenshot
    await page.screenshot({
      path: join(__dirname, '..', 'screenshots', `${url.hostname}.jpg`),
      type: 'jpeg',
      quality: 90
    })
    logger.info(infos)
  } catch (err) {
    logger.warn('Invalid URL %s', originalUrl)
    logger.error(err)
  }
}
Promise.all(
  [
    detect(argv._[0] || 'https://nuxtjs.org'),
    // detect('https://fr.louisvuitton.com'),
    // detect('https://careers.google.com'),
    // detect('https://www.backmarket.fr'),
    // detect('https://www.lecollectionist.com')
  ]
).then(() => browser.close())
