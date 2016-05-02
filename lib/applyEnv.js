'use strict';
const composeSections = require('./composeSections');

/**
 * Returns a new object where the environment
 * values have been applied the given values.
 *
 * Additionally, composes sections as described by the wanted section's `compose`
 * attribute.
 *
 * @param {Object} parsed
 * The parsed object from the YAML-file.
 *
 * @param {String} opts.env
 * The environment section we want to return.
 *
 * @param {Object} opts.envObject
 * The environment object.
 *
 * @return {Object}
 * The merged object
 *
 * @api private
 */
module.exports = function applyEnv(parsed, opts) {
  const wantedSection = composeSections(
    parsed,
    [opts.env]
  );

  return Object.assign({}, wantedSection, opts.envObject);
};