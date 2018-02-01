'use strict'
const path = require('path')

/**
 * Makes a fixture function.
 *
 * @param  {string} folder
 * @return {Function}
 */
module.exports = function makeFixture(folder) {
  const fixture = file => path.join(__dirname, '../fixtures', folder, file)
  return fixture
}
