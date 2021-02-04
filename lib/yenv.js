'use strict'

/**
 * yenv.js
 * environment management with YAML.
 * by Jeff Hansen
 */
const path = require('path')
const { keyblade } = require('keyblade')
const applyEnv = require('./applyEnv')
const loadAndParse = require('./loadAndParse')
const processImports = require('./processImports')

/**
 * Synchronously reads the given YAML-file,
 * then overwrites the values with what's currently in process.env.
 *
 * @param {String} filePath
 * The file to read. Defaults to "env.yaml".
 *
 * @param {Object} opts
 * Options object.
 *
 * @param {String} opts.env
 * The environment to read from in the file root.
 * Defaults to process.env.NODE_ENV, and then to "development"
 *
 * @param {Object} opts.envObject
 * The environment object to read from, defaults to process.env.
 *
 * @return {Object}
 * The environment object.
 *
 * @example
 *
 * Declaring:
 *
 * ```yaml
 * development:
 *   PORT: 8080
 * production:
 *   PORT: 80
 * ```
 *
 * Reading:
 *
 * ```javascript
 * // Simple
 * const env = yenv('some/file.yaml')
 *
 * // Advanced
 * const env = yenv('some/file.yaml', {
 *   env: 'production' // the top-level element to read.
 * })
 * ```
 */
module.exports = function yenv(filePath, opts) {
  opts = Object.assign(
    {
      envObject: process.env,
      cwd: process.cwd(),
      raw: false,
      strict: true,
      optionalKeys: [],
    },
    opts || {}
  )

  opts = Object.assign(
    {
      env: opts.envObject.NODE_ENV || 'development',
    },
    opts
  )

  filePath = path.resolve(opts.cwd, filePath || 'env.yaml')
  const parsed = loadAndParse(filePath, false)
  const processed = processImports(
    parsed,
    Object.assign({}, opts, {
      importingFile: filePath,
    })
  )

  const result = applyEnv(processed, opts)
  if (opts.strict) {
    return keyblade(result, {
      ignore: opts.optionalKeys,
      message: (key) => `[yenv] ${key} not found in the loaded environment`,
      logBeforeThrow: opts.logBeforeThrow,
    })
  }
  return result
}
