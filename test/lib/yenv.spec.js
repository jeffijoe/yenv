'use strict';
const yenv = require('../../lib/yenv');
const path = require('path');

const fixture = file => path.join(__dirname, '../fixtures', file);

describe('yenv', function() {
  describe('defaults', function() {
    it('falls back to env.yaml for filenames', function() {
      yenv();
    });

    it('falls back to development when NODE_ENV is empty.', function() {
      yenv(fixture('simple.yaml'), { envObject: {} }).string.should.equal('hello dev');
    });
  });

  describe('simple.yaml', function() {
    it('returns the contents of the YAML-file for development mode', function() {
      const env = yenv(fixture('simple.yaml'));
      env.string.should.equal('hello dev');
      env.int.should.equal(123);
      env.bool.should.be.true;
    });

    it('returns the contents of the YAML-file for production mode', function() {
      const env = yenv(fixture('simple.yaml'), { env: 'production' });
      env.string.should.equal('hello prod');
      env.int.should.equal(456);
      env.bool.should.be.false;
    });

    it('should let envObject values take over', function() {
      const envObject = {
        string: 'i win'
      };
      const env = yenv(fixture('simple.yaml'), { env: 'production', envObject });
      env.string.should.equal(envObject.string);
      env.int.should.equal(456);
      env.bool.should.be.false;
    });
  });

  describe('empty.yaml', function() {
    it('returns whatever is in the process.env', function() {
      const env = yenv(fixture('empty.yaml'));
      env.should.deep.equal(process.env);
    });
  });
});