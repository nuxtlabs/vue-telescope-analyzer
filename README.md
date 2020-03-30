# Vue Telemetry

CLI to analyze a website and detect Vue and its ecosystem ✨

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

analyze('https://fr.nuxtjs.org')
  .then(result => console.log(result))
  .catch(error => console.error(error))
```

Result:

```js
{
  url: 'https://fr.nuxtjs.org/',
  hostname: 'fr.nuxtjs.org',
  domain: 'nuxtjs.org',
  // website metadata
  meta: {
    language: 'fr',
    title: 'Nuxt.js - Le Framework Vue.js',
    description: 'Nuxt.js fournit toutes les configurations nécessaires pour rendre...'
  },
  // Vue Framework
  framework: 'nuxt',
  // Vue plugins
  plugins: [
    'vue-router',
    'vue-meta',
    'vuex'
  ],
  // UI Librairy
  ui: 'tailwindcss',
  // When framework === 'nuxt'
  nuxt: {
    ssr: true,
    static: true,
    modules: [
      '@nuxt/http',
      '@nuxtjs/pwa',
      '@nuxtjs/google-analytics'
    ]
  }
}
```

## Contributing

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Update the code right inside `src/` or `detectors/`
4. Test it with `./bin/vta.js https://your-url-to-test`

## License

[MIT License](./LICENSE)
