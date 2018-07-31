const url = require('url');
const nock = require('nock');
const assert = require('assert');
const uv = require('../src/openweather').uv;
const InvalidRequestType = require('../src/openweather').InvalidRequestType;

describe('openweather-uv', function () {
  /** UVRequest Class tests */
  describe('#UVRequest', function () {
    describe('#constructor()', function () {
      it('should have no default properties set', function () {
        const req = new uv.UVRequest();
        assert.strictEqual(req.appid(), undefined);
        assert.strictEqual(req.type(), undefined);
        assert.strictEqual(req.limit(), undefined);
        assert.deepStrictEqual(req.coords(), {
          lat: undefined,
          lon: undefined
        });
        assert.deepStrictEqual(req.timePeriod(), {
          start: undefined,
          end: undefined
        });
      });

      it('should set all properties used for a CURRENT request', function () {
        const config = {
          appid: 'API-KEY',
          type: uv.UVRequestType.CURRENT,
          lat: 113.166,
          lon: 55.133,
        };
        const req = new uv.UVRequest(config);
        assert.strictEqual(req.appid(), config.appid);
        assert.strictEqual(req.type(), config.type);
        assert.deepStrictEqual(req.coords(), { lat: config.lat, lon: config.lon });
      });

      it('should set all properties used for a FORECAST ', function () {
        const config = {
          appid: 'API-KEY',
          type: uv.UVRequestType.HISTORY,
          lat: 113.166,
          lon: 55.133,
          limit: 4
        };
        const req = new uv.UVRequest(config);
        assert.strictEqual(req.appid(), config.appid);
        assert.strictEqual(req.type(), config.type);
        assert.strictEqual(req.limit(), config.limit);
        assert.deepStrictEqual(req.coords(), { lat: config.lat, lon: config.lon });
      });

      it('should set all properties used for a HISTORY request', function () {
        const config = {
          appid: 'API-KEY',
          type: uv.UVRequestType.HISTORY,
          lat: 113.166,
          lon: 55.133,
          limit: 4,
          start: '1498049953',
          end: '1498481991'
        };
        const req = new uv.UVRequest(config);
        assert.strictEqual(req.appid(), config.appid);
        assert.strictEqual(req.type(), config.type);
        assert.strictEqual(req.limit(), config.limit);
        assert.deepStrictEqual(req.coords(), { lat: config.lat, lon: config.lon });
        assert.deepStrictEqual(req.timePeriod(), {
          start: '1498049953',
          end: '1498481991'
        });
      });
    });

    describe('#appid()', function () {
      it('should set the appid', function () {
        const key = 'API-KEY';
        const req = (new uv.UVRequest()).appid(key);
        assert.strictEqual(req.appid(), key);
      });
    });

    describe('#type()', function () {
      let req;
      beforeEach(function () {
        req = new uv.UVRequest();
      });

      it('should set the RequestType to CURRENT', function () {
        req.type(uv.UVRequestType.CURRENT);
        assert.strictEqual(req.type(), uv.UVRequestType.CURRENT);
      });

      it('should set the RequestType to HISTORY', function () {
        req.type(uv.UVRequestType.HISTORY);
        assert.strictEqual(req.type(), uv.UVRequestType.HISTORY);
      });

      it('should set the RequestType to FORECAST', function () {
        req.type(uv.UVRequestType.FORECAST);
        assert.strictEqual(req.type(), uv.UVRequestType.FORECAST);
      });
    });

    describe('#coords()', function () {
      const latValue = 26.301741;
      const lonValue = -98.163338;
      it('should set the coordinates for the request', function () {
        const req = (new uv.UVRequest()).coords(latValue, lonValue);
        assert.deepStrictEqual(req.coords(), { lat: latValue, lon: lonValue });
      });
    });

    describe('#limit()', function () {
      it('should set a limit on the number of days in the forecast', function () {
        const limitValue = 3;
        const req = uv.forecast().limit(3);
        req.limit(limitValue);   // limit should only be set for FORECAST type
        assert.strictEqual(req.limit(), limitValue);
      });
    });

    describe('#timePeriod()', function () {
      const start = '1498049953';
      const end = '1498481991';
      it('should set the time period for the search', function () {
        const req = uv.history().timePeriod(start, end);
        assert.deepStrictEqual(req.timePeriod(), {
          start: start,
          end: end
        });
      });
    });

    describe('#url()', function () {
      const params = {
        appid: 'API-KEY',
        lat: 26.301741,
        lon: -98.163338,
        limit: 4,
        start: '1498049953',
        end: '1498481991'
      };
      it('should set the specified params for current data', function () {
        const req = (new uv.UVRequest())
          .type(uv.UVRequestType.CURRENT)
          .appid(params.appid)
          .coords(params.lat, params.lon);
        const urlObj = url.parse(req.url(), true);
        assert.strictEqual(urlObj.hostname, 'api.openweathermap.org');
        assert.strictEqual(urlObj.pathname, '/data/2.5/uvi');
        assert.deepEqual(urlObj.query, {
          APPID: params.appid,
          lat: params.lat,
          lon: params.lon,
        });
      });

      it('should set the specified params for forecast data', function () {
        const req = (new uv.UVRequest())
          .type(uv.UVRequestType.FORECAST)
          .appid(params.appid)
          .coords(params.lat, params.lon)
          .limit(params.limit);
        const urlObj = url.parse(req.url(), true);
        assert.strictEqual(urlObj.hostname, 'api.openweathermap.org');
        assert.strictEqual(urlObj.pathname, '/data/2.5/uvi/forecast');
        assert.deepEqual(urlObj.query, {
          APPID: params.appid,
          lat: params.lat,
          lon: params.lon,
          limit: params.limit
        });
      });

      it('should set the specified params for the history request', function () {
        const req = (new uv.UVRequest())
          .type(uv.UVRequestType.HISTORY)
          .appid(params.appid)
          .coords(params.lat, params.lon)
          .limit(params.limit)
          .timePeriod(params.start, params.end);
        const urlObj = url.parse(req.url(), true);
        assert.strictEqual(urlObj.hostname, 'api.openweathermap.org');
        assert.strictEqual(urlObj.pathname, '/data/2.5/uvi/history');
        assert.deepEqual(urlObj.query, {
          APPID: params.appid,
          lat: params.lat,
          lon: params.lon,
          limit: params.limit,
          start: params.start,
          end: params.end
        });
      });
    });

    describe('#exec()', function () {
      const returnValue = { status : 'success!' };
      const params = {
        appid: 'API-KEY',
        lat: 26.301741,
        lon: -98.163338,
        limit: 4,
        start: '1498049953',
        end: '1498481991'
      };

      it('should set the specified params for current data', function () {
        nock('http://api.openweathermap.org')
          .get('/data/2.5/uvi')
          .query(true)
          .reply(200, returnValue);
        const req = (new uv.UVRequest())
          .type(uv.UVRequestType.CURRENT)
          .appid(params.appid)
          .coords(params.lat, params.lon);
        assert.doesNotReject(req.exec().then(value => {
          assert.deepEqual(value, returnValue);
        }));
      });

      it('should set the specified params for forecast data', function () {
        nock('http://api.openweathermap.org')
          .get('/data/2.5/uvi/forecast')
          .query(true)
          .reply(200, returnValue);
        const req = (new uv.UVRequest())
          .type(uv.UVRequestType.FORECAST)
          .appid(params.appid)
          .coords(params.lat, params.lon)
          .limit(params.limit);
        assert.doesNotReject(req.exec().then(value => {
          assert.deepEqual(value, returnValue);
        }));
      });

      it('should set the specified params for the history request', function () {
        nock('http://api.openweathermap.org')
          .get('/data/2.5/uvi/history')
          .query(true)
          .reply(200, returnValue);
        const req = (new uv.UVRequest())
          .type(uv.UVRequestType.HISTORY)
          .appid(params.appid)
          .coords(params.lat, params.lon)
          .limit(params.limit)
          .timePeriod(params.start, params.end);
        assert.doesNotReject(req.exec().then(value => {
          assert.deepEqual(value, returnValue);
        }));
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

    /** UVRequestType test */
    describe('UVRequestType enum', function () {
      describe('#getName()', function () {
        it('should return current', function () {
          const current = uv.UVRequestType.CURRENT;
          const name = uv.UVRequestType.getName(current);
          assert.strictEqual(name, 'current');
        });

        it('should return history', function () {
          const history = uv.UVRequestType.HISTORY;
          const name = uv.UVRequestType.getName(history);
          assert.strictEqual(name, 'history');
        });

        it('should return forecast', function () {
          const forecast = uv.UVRequestType.FORECAST;
          const name = uv.UVRequestType.getName(forecast);
          assert.strictEqual(name, 'forecast');
        });

        it('should thrown an InvalidRequestType error', function () {
          const other = null; // dummy value
          const func = () => uv.UVRequestType.getName(other);
          assert.throws(func, InvalidRequestType, 'Unknown UVRequestType');
        });
      });
    });
  });
});
