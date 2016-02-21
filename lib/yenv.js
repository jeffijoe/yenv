'use strict';
/**
 * yenv.js
 * environment management with YAML
 * by Jeff Hansen
 */

const yaml = require('yaml');
const fs = require('fs');

/**
 * Synchronously reads the given YAML-file,
 * then overwrites the values with what's currently in process.env.
 *
 * @param {String} filePath
 * The file to read.
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
 */
module.exports = function yenv(
  filePath,
  opts
) {
  filePath = filePath || 'env.yaml';
  opts = Object.assign({
    env: 'development',
    envObject: process.env
  }, opts);

  const env = opts.envObject || process.env;
  const contents = fs.readFileSync(filePath);
  if (!contents) return {};
  const yamlMarkup = contents.toString();
  const parsed = yaml.eval(yamlMarkup);
  console.log('markup', yamlMarkup);

  console.log('parsed yaml', parsed);
};