# Vue Telescope Analyzer

CLI to analyze a website and detect Vue and its ecosystem ✨

This module is used by [vuetelescope.com](https://vuetelescope.com) to detect Vue and its ecosystem on a website.

You can help the community discover new Vue websites by using the [browser extension](https://github.com/nuxt-company/vue-telescope-extensions) 💚

## Installation

```bash
npm install -g vue-telescope-analyzer # Or yarn global add vue-telescope-analyzer
```

## Usage

```bash
vta [url]

# Example
vta https://fr.nuxtjs.org
```

[![render1585566509798](https://user-images.githubusercontent.com/904724/77906279-fb455d80-7287-11ea-86f2-d7eca773ba56.gif)](https://terminalizer.com/view/a30a95523602)


It supports multiple [frameworks](#frameworks), [UI libraries](#ui-libraries) and [Vue plugins](#vue-plugins).

## Frameworks

- [Nuxt](https://nuxtjs.org)
- [Quasar](https://quasar.dev)
- [Gridsome](https://gridsome.org)
- [VuePress](https://vuepress.vuejs.org)

To support a new Vue framework, please look at [detectors/frameworks.json](detectors/frameworks.json).

## UI Libraries

- [Element UI](https://element.eleme.io)
- [Vuetify](https://vuetifyjs.com)
- [Bootstrap Vue](https://bootstrap-vue.js.org)
- [TailwindCSS](https://tailwindcss.com)
- [Buefy](https://buefy.org)
- [Inkline](https://inkline.io)
- [Chakra UI Vue](https://vue.chakra-ui.com)
- [Oruga](https://oruga.io)
- [VueTailwind](https://www.vue-tailwind.com/)
- [PrimeVue](https://www.primefaces.org/primevue/showcase)
- [iView](http://iview.talkingdata.com)

To support a new UI library, please look at [detectors/uis.json](detectors/uis.json).

## Vue Plugins

- [Vue Router](https://router.vuejs.org)
- [Vuex](https://vuex.vuejs.org)
- [Vue Meta](https://vue-meta.nuxtjs.org)
- [Vue Apollo](https://apollo.vuejs.org)
- [Vue Warehouse](https://marquez.co/docs/vue-warehouse)
- [Vue i18n](https://kazupon.github.io/vue-i18n/)
- [Vue Formulate](https://vueformulate.com/)
- [Inertia.js](https://inertiajs.com)
- [vee-validate](https://vee-validate.logaretm.com)
- [Vue Composition API](https://github.com/vuejs/composition-api)

To support a new Vue plugin, please look at [detectors/plugins.json](detectors/plugins.json).

## Nuxt Info

When [Nuxt](https://nuxtjs.org) is detected as a framework, it will also detect:

- If the website is *server-rendered* (`mode: 'universal'`)
- If the website is *static* (`nuxt generate`)

See [detectors/nuxt.meta.json](detectors/nuxt.meta.json) for the detection.

It will also detect the Nuxt modules used, refer to [detectors/nuxt.modules.json](detectors/nuxt.modules.json) to support new Nuxt modules.


## NPM Module

You can use `vue-telescope-analyzer` locally on your project:

```bash
npm install vue-telescope-analyzer # Or yarn add vue-telescope-analyzer
```

Then you can use the module in your project:

```js
const analyze = require('vue-telescope-analyzer')

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
    description: 'Nuxt.js presets all the configuration needed to make...',
    siteName: 'NuxtJS',
    isAdultContent: false
  },
  vueVersion: '2.6.11',
  hasSSR: true,
  isStatic: true,
  // Vue Framework
  framework: {
    slug: 'nuxtjs',
    name: 'NuxtJS',
    imgPath: '/framework/nuxt.svg', // prefix with https://icons.vuetelescope.com
  },
  // Vue plugins
  plugins: [
    {
      slug: 'vue-router',
      name: 'vue-router',
      imgPath: null,
      url: 'https://router.vuejs.org/'
    },
    {
      slug: 'vue-meta',
      name: 'vue-meta',
      imgPath: null,
      url: 'https://vue-meta.nuxtjs.org'
    },
    {
      slug: 'vuex',
      name: 'vuex',
      imgPath: null,
      url: 'https://vuex.vuejs.org'
    }
  ],
  // UI Librairy
  ui: {
    slug: 'tailwind-css',
    name: 'Tailwind CSS',
    imgPath: '/ui/tailwind.svg',
    url: 'https://tailwindcss.com/'
  },
  // Framework modules
  frameworkModules: [
    {
      slug: 'nuxt-http',
      name: '@nuxt/http',
      imgPath: null,
      url: 'https://http.nuxtjs.org'
    },
    {
      slug: 'nuxtjs-pwa',
      name: '@nuxtjs/pwa',
      imgPath: null,
      url: 'https://pwa.nuxtjs.org/'
    },
    {
      slug: 'nuxtjs-google-analytics',
      name: '@nuxtjs/google-analytics',
      imgPath: null,
      url: 'https://github.com/nuxt-community/analytics-module'
    },
    {
      slug: 'nuxtjs-color-mode',
      name: '@nuxtjs/color-mode',
      imgPath: null,
      url: 'https://github.com/nuxt-community/color-mode-module'
    }
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
