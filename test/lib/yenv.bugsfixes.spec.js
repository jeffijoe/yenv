'use strict'
const yenv = require('../../lib/yenv')

const fixture = require('../_helpers/fixture')('empty-sections-merge-bug')

describe('bugfixes', function() {
  describe('empty sections (issue #8)', function() {
    it('makes sure an empty section in the imported file does not screw shit up', function() {
      const result = yenv(fixture('root1.yaml'), { env: 'development' })
      expect(result).to.exist
      expect(result.SET).be.true
    })

    it('makes sure an empty section in the importing file does not screw shit up', function() {
      const result = yenv(fixture('root2.yaml'), { env: 'development' })
      expect(result).to.exist
      expect(result.SET).be.true
    })
  })
})
