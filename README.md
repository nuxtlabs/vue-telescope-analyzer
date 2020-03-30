# Vue Telemetry

Help the community discover websites made with [Vue](https://vuejs.org).

```bash
npx vue-telemetry https://fr.nuxtjs.org
```

It supports multiple vue plugins, frameworks and UI librairies.

```js
{
  url: 'https://fr.nuxtjs.org/',
  hostname: 'fr.nuxtjs.org',
  domain: 'nuxtjs.org',
  language: 'fr',
  framework: 'nuxt',
  plugins: [
    'vue-router',
    'vue-meta',
    'vuex'
  ],
  ui: 'tailwindcss',
  title: 'Nuxt.js - Le Framework Vue.js',
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

To test it: `node src/analyze.js https://my-url.com`

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
