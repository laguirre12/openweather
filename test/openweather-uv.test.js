const url = require('url');
const nock = require('nock');
const assert = require('assert');

const uv = require('../src/openweather-uv');

describe('openweather-uv', function () {

  // TODO(la)
  describe('#UVRequest', function () {
  });


  // basic unit tests factory methods

  describe('#defaultKey()', function () {
    const defaultKey = '111';
    beforeEach(function () {
      uv.defaultKey(defaultKey);
    });

    it('should set the default key for a new UVRequest', function () {
      assert.deepStrictEqual(uv.defaultKey(), defaultKey);
    });

    it('should reset the default key for a new UVRequest', function () {
      uv.defaultKey('222');
      assert.notStrictEqual(uv.defaultKey(), defaultKey);
      assert.strictEqual(uv.defaultKey(), '222');
    });

    it('should set the default key for a new UVRequest', function () {
      const req = new uv.UVRequest();
      assert.deepStrictEqual(req.appid(), defaultKey);
    });

    it('should be able to override the default key', function () {
      const req = new uv.UVRequest();
      req.appid('222');
      assert.strictEqual(req.appid(), '222');
    });
  });

  describe('#current()', function () {
    it('should have a RequestType of CURRENT', function () {
      const req = uv.current();
      assert.strictEqual(req.type(), uv.UVRequestType.CURRENT);
    });
  });

  describe('#forecast()', function () {
    it('should have a RequestType of FORECAST', function () {
      const req = uv.forecast();
      assert.strictEqual(req.type(), uv.UVRequestType.FORECAST);
    });
  });

  describe('#history()', function () {
    it('should have a RequestType of HISTORY', function () {
      const req = uv.history();
      assert.strictEqual(req.type(), uv.UVRequestType.HISTORY);
    });
  });
});
