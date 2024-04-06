import { parsePatterns, asArray } from './utils.mjs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { loadJsonFileSync } from 'load-json-file'

const dir = dirname(fileURLToPath(import.meta.url))

const vue = loadJsonFileSync(resolve(dir, '../detectors/vue.json'))
const vueMeta = loadJsonFileSync(resolve(dir, '../detectors/vue.meta.json'))
const frameworks = loadJsonFileSync(resolve(dir, '../detectors/frameworks.json'))
const plugins = loadJsonFileSync(resolve(dir, '../detectors/plugins.json'))
const uis = loadJsonFileSync(resolve(dir, '../detectors/uis.json'))
const nuxtMeta = loadJsonFileSync(resolve(dir, '../detectors/nuxt.meta.json'))
const nuxtModules = loadJsonFileSync(resolve(dir, '../detectors/nuxt.modules.json'))

const detectors = {
  vue,
  meta: vueMeta,
  frameworks,
  plugins,
  uis,
  nuxt: {
    meta: nuxtMeta,
    modules: nuxtModules
  }
}

export function hasVue (context) {
  return isMatching(detectors.vue, context)
}

export async function getVueMeta (context) {
  const meta = {}
  await Promise.all(
    Object.keys(detectors.meta).map(async (key) => {
      meta[key] = await isMatching(detectors.meta[key], context)
    })
  )
  return meta
}

export async function getFramework (context) {
  for (const framework of Object.keys(detectors.frameworks)) {
    if (await isMatching(detectors.frameworks[framework].detectors, context)) {
      return detectors.frameworks[framework].metas
    }
  }
  return null
}

export async function getUI (context) {
  const uis = new Set()

  await Promise.all(
    Object.keys(detectors.uis).map(async (ui) => {
      if (await isMatching(detectors.uis[ui].detectors, context)) {
        uis.add(detectors.uis[ui])
      }
    })
  )

  const ui = Array.from(uis).sort((a, b) => (typeof b.priority !== 'undefined' ? b.priority : 1) - (typeof a.priority !== 'undefined' ? a.priority : 1))[0]
  if (ui) {
    return ui.metas
  }
  return null
}

export async function getPlugins (context) {
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

export async function getNuxtMeta (context) {
  const meta = {}

  await Promise.all(
    Object.keys(detectors.nuxt.meta).map(async (key) => {
      meta[key] = await isMatching(detectors.nuxt.meta[key], context)
    })
  )

  return meta
}

export async function getNuxtModules (context) {
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

async function isMatching (detector, { originalHtml, html, scripts, page, headers }) {
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
  // If we can detect technology from headers
  if (headers && detector.headers && typeof detector.headers === 'object' && Object.keys(detector.headers).length > 0) {
    for (const header of Object.keys(headers)) {
      if (Object.keys(detector.headers).find(key => key.toLowerCase() === header.toLowerCase())) {
        if (detector.headers[header].toLowerCase() === headers[header].toLowerCase()) return true
      }
    }
  }
  return false
}
