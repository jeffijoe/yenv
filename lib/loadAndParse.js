'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

/**
 * Loads and parses the given file.
 *
 * @param  {string} filePath
 * Path to the file.
 *
 * @return {object}
 * The parsed file.
 */
module.exports = function loadAndParse(filePath) {
  // Read the file.
  const contents = fs.readFileSync(
    filePath,
    'utf-8'
  );

  if (!contents) return {};
  const yamlMarkup = contents.toString();
  const parsed = yaml.safeLoad(yamlMarkup);
  return parsed;
};