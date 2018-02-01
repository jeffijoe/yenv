'use strict'
const yenv = require('../../lib/yenv')
const catchError = require('../_helpers/catchError')

const fixture = require('../_helpers/fixture')('importing')

describe('importing', function() {
  it('imports and merges the files', function() {
    const actual = yenv(fixture('importing.yaml'), {
      env: 'development',
      envObject: {}
    })

    actual.I_WIN.should.equal('importing')
    actual.IMPORTED1.should.equal('imported1')
    actual.IMPORTED2.should.equal('imported2')
    actual.OVERRIDE_IMPORTED1.should.equal('imported2')
    actual.IMPORTED_FROM_1.should.equal('imported-from-1')
  })

  it('prevents circular imports', function() {
    const err = catchError(() => yenv(fixture('circular-importer.yaml')))
    err.message.should.contain('Circular import')
    err.message.should.contain('circular-importer.yaml')
    err.message.should.contain('circular-imported.yaml')
  })

  it('allows composition across files', function() {
    const actual = yenv(fixture('composition-importer.yaml'), {
      env: 'development',
      envObject: {}
    })
    actual.PORT.should.equal(1337)
    actual.DB_PORT.should.equal(7331)
    actual.HEHE.should.equal(2)
    actual.HOST.should.equal('example.com')
    actual.DB_USER.should.equal('local')
    actual.COMPOSED.should.be.true
  })

  it('allows for nonexisting files when using ~import', () => {
    const actual = yenv(fixture('optional-import.yaml'), {
      env: 'development',
      envObject: {}
    })
    console.log(actual)
    expect(actual.TEST).to.equal(true)
  })

  it('disallows nonexisting files when using ~require', () => {
    const err = catchError(() =>
      yenv(fixture('required-import.yaml'), {
        env: 'development',
        envObject: {}
      })
    )
    expect(err.message).to.contain('nonexisting')
  })
})
