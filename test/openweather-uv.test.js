const url = require('url');
const nock = require('nock');
const assert = require('assert');

const uv = require('../src/openweather-uv');

describe('openweather-uv', function () {

  /** UVRequest Class tests below */
  describe('#UVRequest', function () {
    let req;
    beforeEach(function () {
      req = new uv.UVRequest();
    });

    describe('#constructor()', function () {
      it('should have no default properties set', function () {
        req = new uv.UVRequest();
        assert.strictEqual(req.appid(), undefined);
        assert.strictEqual(req.type(), undefined);
        assert.deepStrictEqual(req.coords(), {
          lat: undefined,
          lon: undefined
        });

        // these should only be set for FORECAST and HISTORY time
        /*
        assert.strictEqual(req.limit(), undefined);
        assert.deepStrictEqual(req.datetime(), {
          zip: undefined,
          country: undefined
        }); */
      });

      it('should set all properties for a HISTORY request', function () {
        const config = {
          appid: 'API-KEY',
          type: uv.UVRequestType.HISTORY,
          lat: 113.166,
          lon: 55.133,
          start: '',
          end: ''
        };
        req = new uv.UVRequest(config);
      });
    });

    describe('#appid()', function () {
      it('should set the appid', function () {
        const key = '1111';
        req.appid(key);
        assert.strictEqual(req.appid(), key);
      });
    });

    describe('#type()', function () {
      it('should set the RequestType to CURRENT', function () {
        req.type(uv.UVRequestType.CURRENT);
        assert.strictEqual(req.type, uv.UVRequestType.CURRENT);
      });

      it('should set the RequestType to HISTORY', function () {
        req.type(uv.UVRequestType.HISTORY);
        assert.strictEqual(req.type, uv.UVRequestType.HISTORY);
      });

      it('should set the RequestType to FORECAST', function () {
        req.type(uv.UVRequestType.FORECAST);
        assert.strictEqual(req.type, uv.UVRequestType.FORECAST);
      });
    });

    describe('#coords()', function () {
      it('should set the coordinates for the request', function () {
        const latValue = 26.301741;
        const lonValue = -98.163338;
        req.coords(latValue, lonValue);
        assert.deepStrictEqual(req.coords(), { lat: latValue, lon: lonValue });
      });
    });

    describe('#limit()', function () {
      it('should set alimit on the number of days in the forecast', function () {
        const limitValue = 3;
        req.type(uv.UVRequestType.FORECAST);
        req.limit(limitValue);      // limit should only be set for FORECAST type
        assert.strictEqual(req.limit(), limitValue);
      });
    });

    describe('#url()', function () {
    });


    // TODO(la): use nock to mock HTTP requests
    // (https://scotch.io/tutorials/nodejs-tests-mocking-http-requests)
    describe('#exec()', function () {
    });
  });

  /** Default Key tests below */

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

  /** Factory method tests below */

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
