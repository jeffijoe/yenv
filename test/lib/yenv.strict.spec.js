'use strict'
const yenv = require('../../lib/yenv')
const catchError = require('../_helpers/catchError')
const sinon = require('sinon')
const { UndefinedKeyError } = require('keyblade')
const fixture = require('../_helpers/fixture')('importing')

describe('strict mode', function () {
  it('throws when keys are missing', function () {
    const logSpy = sinon.spy()
    const actual = yenv(fixture('importing.yaml'), {
      env: 'development',
      envObject: {},
      strict: true,
      logBeforeThrow: (arg1, arg2) => logSpy(arg1, arg2),
    })
    const err = catchError(() => actual.NONEXISTING)
    logSpy.should.have.been.called
    err.should.be.instanceOf(UndefinedKeyError)
    err.message.should.contain('NONEXISTING')
  })

  it('allows optional keys to be undefined', () => {
    const logSpy = sinon.spy()
    const actual = yenv(fixture('importing.yaml'), {
      env: 'development',
      envObject: {},
      strict: true,
      logBeforeThrow: (arg1, arg2) => logSpy(arg1, arg2),
      optionalKeys: ['OPTIONAL'],
    })
    expect(catchError(() => actual.NONEXISTING)).to.exist
    logSpy.should.have.been.called
    expect(actual.OPTIONAL).to.equal(undefined)
  })
})

describe('loose mode', () => {
  it('allows nonexisting keys', () => {
    const logSpy = sinon.spy()
    const actual = yenv(fixture('importing.yaml'), {
      env: 'development',
      envObject: {},
      strict: false,
      logBeforeThrow: (arg1, arg2) => logSpy(arg1, arg2),
    })
    expect(actual.NONEXISTING).to.equal(undefined)
    logSpy.should.not.have.been.called
  })
})
