const nock = require('nock');

const url = require('url');
const assert = require('assert');
const air = require('../src/openweather').air;
const InvalidRequestType = require('../src/openweather').InvalidRequestType;

describe('openweather-air', function () {

  /** AirRequest Class tests */
  describe('#AirRequest', function () {
    let req;
    beforeEach(function () {
      req = new air.AirRequest();
    });

    describe('#constructor()', function () {
      it('should have default properties', function () {
        req = new air.AirRequest();
        assert.strictEqual(req.appid(), undefined);
        assert.strictEqual(req.type(), undefined);
        assert.deepStrictEqual(req.coords(), {
          lat: undefined,
          lon: undefined
        });
        // TODO(la): how to predict the creation time?
        // assert.strictEqual(req.datetime(), undefined);
      });

      it('should have all values set', function () {
        const config = {
          appid: 'API-KEY',
          type: air.AirRequestType.CO,
          lat: 100.113,
          lon: 55.166,
          datetime: (new Date()).toISOString()
        };
        req = new air.AirRequest(config);
        assert.strictEqual(req.appid(), config.appid);
        assert.strictEqual(req.type(), config.type);
        assert.strictEqual(req.datetime(), config.datetime);
        assert.deepStrictEqual(req.coords(), {
          lat: config.lat,
          lon: config.lon
        });
      });
    });

    describe('#appid()', function () {
      const key = '111';
      it('should set the', function () {
        req.appid(key);
        assert.strictEqual(req.appid(), key);
      });
    });

    describe('#type()', function () {
      it('should set the RequestType to CO', function () {
        req.type(air.AirRequestType.CO);
        assert.strictEqual(req.type(), air.AirRequestType.CO);
      });

      it('should set the RequestType to O3', function () {
        req.type(air.AirRequestType.O3);
        assert.strictEqual(req.type(), air.AirRequestType.O3);
      });

      it('should set the RequestType to SO2', function () {
        req.type(air.AirRequestType.SO2);
        assert.strictEqual(req.type(), air.AirRequestType.SO2);
      });

      it('should set the RequestType to NO2', function () {
        req.type(air.AirRequestType.NO2);
        assert.strictEqual(req.type(), air.AirRequestType.NO2);
      });
    });

    describe('#coords()', function () {
      const latValue = 26.301741;
      const lonValue = -98.163338;
      it('should set the longitude and latitude of the request', function () {
        req.coords(latValue, lonValue);
        assert.deepStrictEqual(req.coords(), {
          lat: latValue,
          lon: lonValue,
        });
      });
    });

    describe('#datetime()', function () {
      const datetime = '2016-01-02T15:04:05Z';
      it('should set the tiem', function () {
        req.datetime(datetime);
        assert.strictEqual(req.datetime(), datetime);
      });
    });

    // TODO(la): extract the parameters from the url
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
      air.defaultKey(defaultKey);
    });

    it('should set the default key for a new AirRequest', function () {
      assert.deepStrictEqual(air.defaultKey(), defaultKey);
    });

    it('should reset the default key for a new AirRequest', function () {
      air.defaultKey('222');
      assert.notStrictEqual(air.defaultKey(), defaultKey);
      assert.strictEqual(air.defaultKey(), '222');
    });

    it('should set the default key for a new AirRequest', function () {
      const req = new air.AirRequest();
      assert.deepStrictEqual(req.appid(), defaultKey);
    });

    it('should be able to override the default key', function () {
      const req = new air.AirRequest();
      req.appid('222');
      assert.strictEqual(req.appid(), '222');
    });
  });


  /** Factory method tests below */
  describe('#ozone()', function () {
    it('should have the AirRequestType.O3 type', function () {
      const req = air.ozone();
      assert.strictEqual(req.type(), air.AirRequestType.O3);
    });
  });

  describe('#carbonMonoxide()', function () {
    it('should have the AirRequestType.CO type', function () {
      const req = air.carbonMonoxide();
      assert.strictEqual(req.type(), air.AirRequestType.CO);
    });
  });

  describe('#sulfurDioxide()', function () {
    it('should have the AirRequestType.SO2 type', function () {
      const req = air.sulfurDioxide();
      assert.strictEqual(req.type(), air.AirRequestType.SO2);
    });
  });

  describe('#nitrogenDioxide()', function () {
    it('should have the AirRequestType.NO2 type', function () {
      const req = air.nitrogenDioxide();
      assert.strictEqual(req.type(), air.AirRequestType.NO2);
    });
  });


  /** AirRequestType test */
  describe('AirRequestType enum', function () {
    describe('#getName()', function () {
      it('should return \'o3\'', function () {
        const type = air.AirRequestType.O3;
        const name = air.AirRequestType.getName(type);
        assert.strictEqual(name, 'o3');
      });

      it('should return \'co\'', function () {
        const type = air.AirRequestType.CO;
        const name = air.AirRequestType.getName(type);
        assert.strictEqual(name, 'co');
      });

      it('should return \'so2\'', function () {
        const type = air.AirRequestType.SO2;
        const name = air.AirRequestType.getName(type);
        assert.strictEqual(name, 'so2');
      });

      it('should return \'no2\'', function () {
        const type = air.AirRequestType.NO2;
        const name = air.AirRequestType.getName(type);
        assert.strictEqual(name, 'no2');
      });

      it('should thrown an InvalidRequestType error', function () {
        const other = null; // dummy value
        const func = () => air.AirRequestType.getName(other);
        assert.throws(func, InvalidRequestType, 'Unknown AirRequestType');
      });
    });
  });
});
