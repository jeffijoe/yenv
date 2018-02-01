/* eslint no-unused-expressions: 0 */
const yenv = require('./yenv')
require('yargs')
  .usage('$0 <cmd> [args]')
  .command({
    command: 'print [file] [env] [format] [args]',
    describe: 'Prints the given environment in the given format',
    handler: printEnv,
    builder: yargs =>
      yargs
        .positional('file', {
          type: 'string',
          describe: 'The environment to print'
        })
        .positional('env', {
          type: 'string',
          describe: 'The environment to print'
        })
        .positional('format', {
          type: 'string',
          describe: 'The format to print in; can be json or dotenv'
        })
        .default('format')
        .option('r', {
          describe:
            'If specified, prints all values as strings (like a real environment would)',
          type: 'boolean',
          alias: 'raw',
          default: false
        })
        .option('f', {
          describe:
            'Only includes the values read from the file, not the actual user environment',
          type: 'boolean',
          default: false,
          alias: 'fileOnly'
        })
  })
  .demandCommand(1)
  .help().argv

function printEnv(args) {
  const raw = args.raw || false
  const env = args.env || 'development'
  const file = args.file || 'env.yaml'
  const fileOnly = args.fileOnly || false
  const format = args.format || 'json'
  const result = yenv(file, {
    raw: raw,
    env: env,
    envObject: fileOnly ? {} : process.env
  })
  switch (format) {
    case 'json':
      printJSON(result)
      break
    case 'dotenv':
      printEnvList(result)
      break

    default:
      console.log('Unknown format; use json or dotenv')
      process.exit(1)
  }
}

function printJSON(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

function printEnvList(obj) {
  const lines = []
  for (const key in obj) {
    lines.push(key + '=' + JSON.stringify(obj[key]))
  }
  console.log(lines.join('\n'))
}
