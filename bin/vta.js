#!/usr/bin/env node

const ora = require('ora')
const consola = require('consola')
const yargs = require('yargs')

yargs
  .usage('$0 [url]', 'analyze an url', (yargs) => {
    yargs.positional('url', {
      describe: 'the url to analyze',
      type: 'string'
    })
  }, (argv) => {
    if (!argv.url) {
      consola.error('Please provide an url to analyze')
      return yargs.showHelp()
    }
    const spinner = ora(`Detecting Vue on ${argv.url}`).start()
    setTimeout(() => spinner.color = 'magenta', 2500)
    setTimeout(() => spinner.color = 'blue', 5000)
    setTimeout(() => spinner.color = 'yellow', 7500)

    const hrstart = process.hrtime()
    require('..')(argv.url)
      .then(result => {
        spinner.stop()
        consola.log(result)

        const hrend = process.hrtime(hrstart)
        consola.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
        process.exit(0)
      })
      .catch(err => {
        consola.error(err)
        process.exit(1)
      })
  })
  .argv

