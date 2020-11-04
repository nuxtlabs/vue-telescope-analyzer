const { parsePatterns, asArray } = require('./utils')

const detectors = {
  vue: require('../detectors/vue.json'),
  meta: require('../detectors/vue.meta.json'),
  frameworks: require('../detectors/frameworks.json'),
  plugins: require('../detectors/plugins.json'),
  uis: require('../detectors/uis.json'),
  nuxt: {
    meta: require('../detectors/nuxt.meta.json'),
    modules: require('../detectors/nuxt.modules.json')
  }
}

exports.hasVue = function (context) {
  return isMatching(detectors.vue, context)
}

exports.getVueMeta = async function(context) {
  const meta = {}
  await Promise.all(
    Object.keys(detectors.meta).map(async (key) => {
      meta[key] = await isMatching(detectors.meta[key], context)
    })
  )
  return meta
}

exports.getFramework = async function (context) {
  for (const framework of Object.keys(detectors.frameworks)) {
    if (await isMatching(detectors.frameworks[framework].detectors, context)) {
      return detectors.frameworks[framework].metas
    }
  }
  return null
}

exports.getUI = async function (context) {
  const uis = new Set()

  await Promise.all(
    Object.keys(detectors.uis).map(async (ui) => {
      if (await isMatching(detectors.uis[ui].detectors, context)) {
        uis.add(detectors.uis[ui].metas)
      }
    })
  )

  return Array.from(uis)
}

exports.getPlugins = async function (context) {
  const plugins = new Set()

  await Promise.all(
    Object.keys(detectors.plugins).map(async (plugin) => {
      if (await isMatching(detectors.plugins[plugin].detectors, context)) {
        plugins.add(detectors.plugins[plugin].metas)
      }
    })
  )

  return Array.from(plugins)
}

exports.getNuxtMeta = async function (context) {
  const meta = {}

  await Promise.all(
    Object.keys(detectors.nuxt.meta).map(async (key) => {
      meta[key] = await isMatching(detectors.nuxt.meta[key], context)
    })
  )

  return meta
}

exports.getNuxtModules = async function (context) {
  const modules = new Set()

  await Promise.all(
    Object.keys(detectors.nuxt.modules).map(async (name) => {
      if (await isMatching(detectors.nuxt.modules[name].detectors, context)) {
        modules.add(detectors.nuxt.modules[name].metas)
      }
    })
  )

  return Array.from(modules)
}

async function isMatching (detector, { originalHtml, html, scripts, page }) {
  // If we can detect technology from response html
  if (detector.originalHtml) {
    for (const pattern of parsePatterns(detector.originalHtml)) {
      if (pattern.regex.test(originalHtml)) return true
    }
  }
  // If we can detect technology from html
  if (detector.html) {
    for (const pattern of parsePatterns(detector.html)) {
      if (pattern.regex.test(html)) return true
    }
  }
  // Check with scripts src
  if (detector.script) {
    for (const pattern of parsePatterns(detector.script)) {
      for (const uri of scripts) {
        if (pattern.regex.test(uri)) return true
      }
    }
  }
  // Or JS evaluation
  if (detector.js) {
    for (const js of asArray(detector.js)) {
      try {
        if (await page.evaluate(`Boolean(${js})`)) return true
      } catch (e) {}
    }
  }
  return false
}
