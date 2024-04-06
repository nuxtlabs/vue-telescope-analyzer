#!/usr/bin/env node

import ora from 'ora'
import consola from 'consola'
import { defineCommand, runMain } from 'citty'
import { analyze } from '../src/index.mjs'

const main = defineCommand({
  meta: {
    name: 'vta',
    description: 'Vue Telescope Analyzer'
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
