'use strict'
const yenv = require('../../lib/yenv')
const fixture = require('../_helpers/fixture')('')

describe('raw mode', function() {
  it('converts values to strings', function() {
    const actual = yenv(fixture('simple.yaml'), {
      env: 'development',
      envObject: {},
      raw: true,
      strict: false
    })
    expect(actual.int).to.equal('123')
    expect(actual.bool).to.equal('true')
    expect(actual.null).not.to.exist
  })
})
