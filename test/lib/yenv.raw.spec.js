'use strict'
const yenv = require('../../lib/yenv')
const fixture = require('../_helpers/fixture')('')

describe('raw mode', function() {
  it('converts values to strings', function() {
    const actual = yenv(fixture('simple.yaml'), {
      env: 'development',
      envObject: {},
      raw: true
    })
    expect(actual.int).to.equal('123')
    expect(actual.bool).to.equal('true')
  })
})
