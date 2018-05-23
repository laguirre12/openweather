const url = require('url');
const assert = require('assert');
const air = require('../src/server/weather/openweather-air');

/**
 * Given a url extracts the parameters of the url using the 'url' module.
 * @param {string} url -
 * @return {object} - an object containing the
 */
function extractParams(url) {
  return url.parse(url, true).query;
}

describe('openweather-air', function() {
  describe('', function() {
  });

  describe('#defaultKey()', function() {
    const defaultKey = '111';
    beforeEach(function() {
      air.defaultKey(defaultKey);
    });

    it('should set the default key for a new PollutionRequest', function() {
      assert.deepStrictEqual(air.defaultKey(), defaultKey);
    });

    it('should reset the default key for a new PollutionRequest', function() {
      air.defaultKey('222');
      assert.notStrictEqual(air.defaultKey(), defaultKey);
      assert.strictEqual(air.defaultKey(), '222');
    });

    it('should set the default key for a new PollutionRequest', function() {
      const req = new air.PollutionRequest();
      assert.deepStrictEqual(req.key(), defaultKey);
    });

    it('should be able to override the default key', function() {
      const req = new air.PollutionRequest();
      req.key('222');
      assert.strictEqual(req.key(), '222');
    });
  });

  describe('#ozone()', function() {
    it('should have the PollutionRequestType.O3 type', function() {
      const req = air.ozone();
      assert.strictEqual(req.type(), air.PollutionRequestType.O3);
    });
  });

  describe('#carbonMonoxide()', function() {
    it('should have the PollutionRequestType.CO type', function() {
      const req = air.carbonMonoxide();
      assert.strictEqual(req.type(), air.PollutionRequestType.CO);
    });
  });

  describe('#sulfurDioxide()', function() {
    it('should have the PollutionRequestType.SO2 type', function() {
      const req = air.sulfurDioxide();
      assert.strictEqual(req.type(), air.PollutionRequestType.SO2);
    });
  });

  describe('#nitrogenDioxide()', function() {
    it('should have the PollutionRequestType.NO2 type', function() {
      const req = air.nitrogenDioxide();
      assert.strictEqual(req.type(), air.PollutionRequestType.NO2);
    });
  });
});
