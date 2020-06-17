# Vue Telemetry Analyzer

CLI to analyze a website and detect Vue and its ecosystem ✨

This module is used by [vuetelemetry.com](https://vuetelemetry.com) to detect Vue and its ecosystem on a website.

You can help the community by using the [browser extension](https://github.com/nuxt-company/vue-telemetry-extensions) 💚

## Installation

```bash
npm install -g vue-telemetry-analyzer # Or yarn global add vue-telemetry-analyzer
```

## Usage

```bash
vta [url]

# Example
vta https://fr.nuxtjs.org
```

[![render1585566509798](https://user-images.githubusercontent.com/904724/77906279-fb455d80-7287-11ea-86f2-d7eca773ba56.gif)](https://terminalizer.com/view/a30a95523602)


It supports multiple [frameworks](#frameworks), [UI librairies](#ui-librairies) and [vue plugins](#vue-plugins).

## Frameworks

- [NuxtJS](https://nuxtjs.org)
- [Quasar](https://quasar.dev)
- [Gridsome](https://gridsome.org)
- [Vuepress](https://vuepress.vuejs.org)

To support a new Vue framework, please look at [detectors/frameworks.json](detectors/frameworks.json).

## UI Librairies

- [Element UI](https://element.eleme.io)
- [Vuetify](https://vuetifyjs.com)
- [Bootstrap Vue](https://bootstrap-vue.js.org)
- [TailwindCSS](https://tailwindcss.com)
- [Buefy](https://buefy.org)
- [Inkline](https://inkline.io)

To support a new UI library, please look at [detectors/uis.json](detectors/uis.json).

## Vue Plugins

- [Vue Router](https://router.vuejs.org)
- [Vuex](https://vuex.vuejs.org)
- [Vue Meta](https://vue-meta.nuxtjs.org)
- [Vue Apollo](https://apollo.vuejs.org)
- [Vue Warehouse](https://www.bazzite.com/docs/vue-warehouse)

To support a new Vue plugin, please look at [detectors/plugins.json](detectors/plugins.json).

## Nuxt Infos

When [NuxtJS](https://nuxtjs.org) is detected as a framework, it will also detect:

- If the website is *server-rendered* (`mode: 'universal'`)
- If the website is *static* (`nuxt generate`)

See [detectors/nuxt.meta.json](detectors/nuxt.meta.json) for the detection.

It will also detecrt the Nuxt modules used, refer to [detectors/nuxt.modules.json](detectors/nuxt.modules.json) to support new Nuxt modules.


## NPM module

You can use `vue-telemetry-analyzer` locally on your project:

```bash
npm install vue-telemetry-analyzer # Or yarn add vue-telemetry
```

Since this module is made to work on serverless environement by using [puppeteer-core](https://www.npmjs.com/package/puppeteer-core) and [chrome-aws-lambda](http://npmjs.com/package/chrome-aws-lambda), you need to install [puppeteer](https://www.npmjs.com/package/puppeteer) locally as a dev dependency:

```bash
npm install --save-dev puppeteer # Or yarn add --dev puppeteer
```

Then you can use the module in your project:

```js
const analyze = require('vue-telemetry-analyzer')

analyze('https://nuxtjs.org')
  .then(result => console.log(result))
  .catch(error => console.error(error))
```

Result:

```js
{
  url: 'https://nuxtjs.org/',
  hostname: 'nuxtjs.org',
  domain: 'nuxtjs.org',
  // website metadata
  meta: {
    language: 'en',
    title: 'Nuxt.js - The Vue.js Framework',
    description: 'Nuxt.js presets all the configuration needed to make...'
  },
  vueVersion: '2.6.11',
  // Vue Framework
  framework: 'nuxt',
  hasSSR: true,
  isStatic: true,
  // Vue plugins
  plugins: [
    'vue-router',
    'vue-meta',
    'vuex'
  ],
  // UI Librairy
  ui: 'tailwindcss',
  // Framework modules
  frameworkModules: [
    '@nuxt/http',
    '@nuxtjs/pwa',
    '@nuxtjs/google-analytics'
  ],
  screenshot: '/var/folders/....../8f1a071384d0b4.jpg'
}
```

## Contributing

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Update the code right inside `src/` or `detectors/`
4. Test it with `./bin/vta.js https://your-url-to-test`
5. If you add a new detector, please add the icon in `icons/` (SVG cleaned with [SVGOMG](https://jakearchibald.github.io/svgomg/))

## License

[MIT License](./LICENSE)
