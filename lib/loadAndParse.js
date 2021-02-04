'use strict'

const fs = require('fs')
const yaml = require('js-yaml')

/**
 * Loads and parses the given file.
 *
 * @param  {string} filePath
 * Path to the file.
 *
 * @param  {string} optional
 * If `true`, returns an empty object if the file does not exist.
 *
 * @return {object}
 * The parsed file.
 */
module.exports = function loadAndParse(filePath, optional) {
  // Read the file.
  let contents
  try {
    contents = fs.readFileSync(filePath, 'utf-8')
  } catch (error) {
    /* istanbul ignore next */
    if (error.code !== 'ENOENT') {
      throw error
    }

    if (optional) {
      return {}
    }

    throw new Error(`[yenv] Required file ${filePath} does not exist.`)
  }

  if (!contents) return {}
  const yamlMarkup = contents.toString()
  const parsed = yaml.load(yamlMarkup)
  return parsed
}
