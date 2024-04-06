# Vue Telescope Analyzer

CLI to analyze a website and detect Vue and its ecosystem ✨

This module is used by [vuetelescope.com](https://vuetelescope.com) to detect Vue and its ecosystem on a website.

You can help the community discover new Vue websites by using the [browser extension](https://github.com/nuxtlabs/vue-telescope-extensions) 💚

## Installation

```bash
npm i -g vue-telescope-analyzer
```

## Usage

```bash
vta [url]

# Example
vta https://nuxt.com
```

[![render1585566509798](https://user-images.githubusercontent.com/904724/77906279-fb455d80-7287-11ea-86f2-d7eca773ba56.gif)](https://terminalizer.com/view/a30a95523602)

It supports multiple [frameworks](#frameworks), [UI libraries](#ui-libraries) and [Vue plugins](#vue-plugins).

## Frameworks

- [Nuxt](https://nuxt.com)
- [Quasar](https://quasar.dev)
- [Gridsome](https://gridsome.org)
- [VuePress](https://vuepress.vuejs.org)
- [Vue Storefront](https://www.vuestorefront.io/)
- [îles](https://iles-docs.netlify.app)
- [TresJs](https://tresjs.org/)

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
- [Vue Material](https://www.creative-tim.com/vuematerial)
- [Vulk](https://vulk.cssninja.io)
- [Arco Design](https://arco.design)

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
- [Vue Tour](https://github.com/pulsardev/vue-tour)
- [Pinia](https://pinia.vuejs.org/)
- [Harlem](https://harlemjs.com)
- [FormKit](https://formkit.com)

To support a new Vue plugin, please look at [detectors/plugins.json](detectors/plugins.json).

## Nuxt Info

When [Nuxt](https://nuxt.com) is detected as a framework, it will also detect:

- If the website is _server-rendered_ (`mode: 'universal'`)
- If the website is _static_ (`nuxt generate`)

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

analyze('https://nuxt.com')
  .then(result => console.log(result))
  .catch(error => console.error(error))
```

Result:

```js
{ url: 'https//nuxt.com/',
  hostname: 'nuxt.com',
  domain: 'nuxt.com',
  meta:
   { language: 'en',
     title: 'Nuxt: The Intuitive Vue Framework · Nuxt',
     description:
      'Nuxt is an open source framework that makes web development intuitive and powerful. Create performant and production-grade full-stack web apps and websites with confidence.',
     siteName: 'Nuxt',
     isAdultContent: false },
  vueVersion: '3.4.21',
  hasSSR: true,
  isStatic: true,
  framework:
   { slug: 'nuxtjs',
     name: 'Nuxt',
     imgPath: '/framework/nuxt.svg',
     url: 'https://nuxt.com',
     version: '3.10.3' },
  plugins:
   [ { slug: 'vue-router',
       name: 'vue-router',
       imgPath: null,
       url: 'https://router.vuejs.org/' } ],
  ui:
   { slug: 'tailwind-css',
     name: 'Tailwind CSS',
     imgPath: '/ui/tailwind.svg',
     url: 'https://tailwindcss.com/' },
  frameworkModules:
   [ { slug: 'nuxt-content',
       name: '@nuxt/content',
       imgPath: null,
       url: 'https://content.nuxtjs.org' },
     { slug: 'nuxtjs-color-mode',
       name: '@nuxtjs/color-mode',
       imgPath: null,
       url: 'https://color-mode.nuxtjs.org' },
     { slug: 'nuxt-ui', name: '@nuxt/ui', imgPath: null, url: 'https://ui.nuxt.com' },
     { slug: 'nuxt-ui-pro',
       name: '@nuxt/ui-pro',
       imgPath: null,
       url: 'https://ui.nuxt.com/pro' } ],
  screenshot: '/var/folders/.../00b97a2040a9aeffc8d5c9d855d2643a.jpg' }
```

## Contributing

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Update the code right inside `src/` or `detectors/`
4. Test it with `./bin/vta.js https://your-url-to-test`
5. If you add a new detector, please add the icon in `icons/` (SVG cleaned with [SVGOMG](https://jakearchibald.github.io/svgomg/))

## License

[MIT License](./LICENSE)
