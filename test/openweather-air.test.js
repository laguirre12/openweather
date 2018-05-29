const url = require('url');
const assert = require('assert');
const air = require('../src/openweather-air');


describe('openweather-air', function () {
  describe('#AirRequest', function () {
    let req;
    let key;
    beforeEach(function () {
      key = '1111';
      req = new air.AirRequest();
    });

    describe('#constructor()', function () {
    });

    describe('#appid()', function () {
      it('should set the', function () {
        req.appid(key);
        assert.strictEqual(req.appid(), key);
      });
    });

    describe('#type()', function () {
      it('should set the RequestType to CURRENT', function () {
        req.type(air.AirRequestType.CURRENT);
        assert.strictEqual(req.type(), air.AirRequestType.CURRENT);
      });

      it('should set the RequestType to HISTORY', function () {
        req.type(air.AirRequestType.HISTORY);
        assert.strictEqual(req.type(), air.AirRequestType.HISTORY);
      });

      it('should set the RequestType to FORECAST', function () {
        req.type(air.AirRequestType.FORECAST);
        assert.strictEqual(req.type(), air.AirRequestType.FORECAST);
      });
    });

    describe('#coords()', function () {
    });

    describe('#datetime()', function () {
    });

    describe('#url()', function () {
    });

    describe('#exec()', function () {
    });
  });

  // basic unit tests factory methods

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
});
