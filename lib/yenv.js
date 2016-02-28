'use strict';

/**
 * yenv.js
 * environment management with YAML.
 * by Jeff Hansen
 */

const yaml = require('js-yaml');
const fs = require('fs');

/**
 * Returns a new object where the environment values have been applied the given values.
 *
 * @param  {Object} values
 * The original values.
 *
 * @param  {Object} envObj
 * The environment object.
 *
 * @return {Object}
 * The merged object
 *
 * @api private
 */
function applyEnv(values, envObj) {
  return Object.assign({}, values, envObj);
}

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
module.exports = function yenv(
  filePath,
  opts
) {
  filePath = filePath || 'env.yaml';
  opts = Object.assign({
    envObject: process.env
  }, opts || {});

  opts = Object.assign({
    env: opts.envObject.NODE_ENV || 'development'
  }, opts);

  // Read the file.
  const contents = fs.readFileSync(filePath, 'utf-8');

  // No? Ok.
  if (!contents) return applyEnv({}, opts.envObject);

  const yamlMarkup = contents.toString();
  const parsed = yaml.safeLoad(yamlMarkup);
  const wantedEnv = parsed[opts.env];

  return applyEnv(wantedEnv, opts.envObject);
};