'use strict'
const composeSections = require('./composeSections')
const coerce = require('coercer')

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
 * @param {Object} opts.raw
 * If `true`, formats values as strings, if `false`, uses `coercer`.
 *
 * @return {Object}
 * The merged object
 *
 * @api private
 */
module.exports = function applyEnv(parsed, opts) {
  const wantedSection = composeSections(parsed, [opts.env])

  const result = Object.assign({}, wantedSection, opts.envObject)
  return opts.raw ? raw(result) : coerce(result)
}

/**
 * Serializes env values as strings.
 */
function raw(obj) {
  const result = {}
  for (const key in obj) {
    const value = obj[key]
    if (value !== null && value !== undefined) {
      result[key] = value.toString()
    }
  }
  return result
}
