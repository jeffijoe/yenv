'use strict'
const yenv = require('../../lib/yenv')
const path = require('path')

const fixture = file => path.join(__dirname, '../fixtures', file)

describe('yenv', function() {
  describe('defaults', function() {
    it('falls back to env.yaml for filenames', function() {
      yenv()
    })

    it('falls back to development when NODE_ENV is empty.', function() {
      yenv(fixture('simple.yaml'), { envObject: {} }).string.should.equal(
        'hello dev'
      )
    })
  })

  describe('simple.yaml', function() {
    it('returns the contents of the YAML-file for development mode', function() {
      const env = yenv(fixture('simple.yaml'))
      env.string.should.equal('hello dev')
      env.int.should.equal(123)
      env.bool.should.be.true
    })

    it('returns the contents of the YAML-file for production mode', function() {
      const env = yenv(fixture('simple.yaml'), { env: 'production' })
      env.string.should.equal('hello prod')
      env.int.should.equal(456)
      env.bool.should.be.false
    })

    it('should let envObject values take over', function() {
      const envObject = {
        string: 'i win'
      }
      const env = yenv(fixture('simple.yaml'), { env: 'production', envObject })
      env.string.should.equal(envObject.string)
      env.int.should.equal(456)
      env.bool.should.be.false
    })
  })

  describe('empty.yaml', function() {
    it('returns whatever is in the process.env', function() {
      const env = yenv(fixture('empty.yaml'), { raw: true })
      env.should.deep.equal(process.env)
    })
  })

  describe('composition.yaml', function() {
    it('development composes base and auth', function() {
      const env = yenv(fixture('composition.yaml'), {
        env: 'development',
        envObject: {}
      })
      env.should.deep.equal({
        PORT: 1338,
        FB_APP_ID: 123,
        DEV: true,
        DEV_ONLY_OPTION: 123,
        SEED_DATABASE: true
      })
    })
  })

  describe('composition-order.yaml', function() {
    it('should set name to section2 because it was last in the array', function() {
      const env = yenv(fixture('composition-order.yaml'), {
        env: 'main',
        envObject: {}
      })
      env.should.deep.equal({
        name: 'section 2',
        s1Only: true,
        s2Only: true
      })
    })
  })

  describe('composition-circular', function() {
    it('does not break on circular composition', function() {
      expect(() =>
        yenv(fixture('composition-circular.yaml'), {
          env: 'main',
          envObject: {}
        })
      ).to.throw(
        'Circular sections! Path: main -> section1 -> section2 -> [section1]'
      )
    })
  })

  describe('composition-array-and-string.yaml', function() {
    it('supports arrays and a single string', function() {
      const env = yenv(fixture('composition-array-and-string.yaml'), {
        env: 'main',
        envObject: {}
      })
      env.should.deep.equal({
        s1: true,
        s2: true,
        name: 'section 2',
        main: true
      })
    })
  })
})
