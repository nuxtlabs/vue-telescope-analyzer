#!/usr/bin/env node

import ora from 'ora'
import consola from 'consola'
import { defineCommand, runMain } from 'citty'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { analyze } from '../src/index.mjs'
import { loadJsonFileSync } from 'load-json-file'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = loadJsonFileSync(resolve(__dirname, '../package.json'))

const main = defineCommand({
  meta: {
    name: 'vta',
    description: 'Vue Telescope Analyzer',
    version: pkg.version
  },
  args: {
    url: {
      type: 'positional',
      description: 'URL to analyze',
      required: true
    },
    browser: {
      type: 'string',
      description: 'Browser WS endpoint to use',
      required: false
    }
  },
  async setup ({ args }) {
    const spinner = ora(`Detecting Vue on ${args.url}`).start()
    setTimeout(() => spinner.color = 'magenta', 2500)
    setTimeout(() => spinner.color = 'blue', 5000)
    setTimeout(() => spinner.color = 'yellow', 7500)

    const hrstart = process.hrtime()
    try {
      const result = await analyze(args.url, { browserWSEndpoint: args.browser })
      spinner.stop()
      consola.log(result)

      const hrend = process.hrtime(hrstart)
      consola.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
      process.exit(0)
    } catch (err) {
      consola.error(err.message)
      if (err.body) consola.log(err.body)
      process.exit(1)
    }
  }
})

runMain(main)
