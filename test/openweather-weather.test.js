const url = require('url');
const nock = require('nock');
const assert = require('assert');
const weather = require('../src/openweather').weather;
const InvalidRequestType = require('../src/openweather').InvalidRequestType;

describe('openweather-weather', function () {
  /** Test WeatherRequest class */
  describe('WeatherRequest', function () {
    describe('#constructor()', function () {
      it('should have no properties set', function () {
        const req = new weather.WeatherRequest();
        assert.strictEqual(req.appid(), undefined);
        assert.strictEqual(req.type(), undefined);
        assert.strictEqual(req.id(), undefined);
        assert.strictEqual(req.limit(), undefined);
        assert.strictEqual(req.units(), undefined);
        assert.strictEqual(req.language(), undefined);
        assert.deepStrictEqual(req.coords(), {
          lat: undefined,
          lon: undefined
        });
        assert.deepStrictEqual(req.zip(), {
          zip: undefined,
          country: undefined
        });
        assert.deepStrictEqual(req.city(), {
          city: undefined,
          country: undefined
        });
      });

      it('should have all properties set by the config', function () {
        const config = {
          appid: 'API-KEY',
          type: weather.WeatherRequestType.CURRENT,
          id: 'city-id',
          zip: '11111',
          city: 'Austin',
          country: 'Country',
          lat: 100.113,
          lon: 55.166,
          limit: 3,
          units: weather.TemperatureUnit.STANDARD,
          language: 'en'
        };
        const req = new weather.WeatherRequest(config);
        assert.strictEqual(req.id(), config.id);
        assert.strictEqual(req.appid(),  config.appid);
        assert.strictEqual(req.type(),  config.type);
        assert.strictEqual(req.limit(), config.limit);
        assert.strictEqual(req.units(), config.units);
        assert.strictEqual(req.language(), config.language);
        assert.deepStrictEqual(req.coords(), {
          lat: config.lat,
          lon: config.lon
        });
        assert.deepStrictEqual(req.zip(), {
          zip: config.zip,
          country: config.country
        });
        assert.deepStrictEqual(req.city(), {
          city: config.city,
          country: config.country
        });
      });
    });

    describe('#appid()', function () {
      it('should set the requests api key', function () {
        const key = 'API-KEY';
        const req = (new weather.WeatherRequest()).appid(key);
        assert.strictEqual(req.appid(), key);
      });
    });

    describe('#type()', function () {
      let req;
      beforeEach(function () {
        req = new weather.WeatherRequest();
      });

      it('should set the request type to CURRENT', function () {
        req.type(weather.WeatherRequestType.CURRENT);
        assert.strictEqual(req.type(), weather.WeatherRequestType.CURRENT);
      });

      it('should set the request type to FORECAST_5', function () {
        req.type(weather.WeatherRequestType.FORECAST_5);
        assert.strictEqual(req.type(), weather.WeatherRequestType.FORECAST_5);
      });

      it('should set the request type to FORECAST_16', function () {
        req.type(weather.WeatherRequestType.FORECAST_16);
        assert.strictEqual(req.type(), weather.WeatherRequestType.FORECAST_16);
      });
    });

    describe('#id()', function () {
      const idValue = '4688275';
      it('should set the city of the weather request', function () {
        const req = (new weather.WeatherRequest()).id(idValue);
        assert.strictEqual(req.id(), idValue);
      });
    });

    describe('#coords()', function () {
      const latValue = 26.301741;
      const lonValue = -98.163338;
      it('should set the coordinates of a weather request', function () {
        const req = (new weather.WeatherRequest()).coords(latValue, lonValue);
        assert.deepStrictEqual(req.coords(), {
          lat: latValue,
          lon: lonValue
        });
      });
    });

    describe('#city()', function () {
      const cityName = 'Antwerp';
      const countryCode = 'be';
      it('should set the city of a weather request', function () {
        const req = (new weather.WeatherRequest()).city(cityName);
        assert.strictEqual(req.city().city, cityName);
      });

      it('should set the city and country', function () {
        const req = (new weather.WeatherRequest()).city(cityName, countryCode);
        assert.strictEqual(req.city().city, cityName);
        assert.strictEqual(req.city().country, countryCode);
        assert.deepStrictEqual(req.city(), {
          city: cityName,
          country: countryCode
        });
      });
    });

    describe('#zip()', function () {
      const zipCode = '11111';
      const countryCode = 'be';
      it('should set the zip code of a weather request', function () {
        const req = (new weather.WeatherRequest()).zip(zipCode);
        assert.strictEqual(req.zip().zip, zipCode);
      });

      it('should set the zip and country code', function () {
        const req = (new weather.WeatherRequest()).zip(zipCode, countryCode);
        assert.strictEqual(req.zip().zip, zipCode);
        assert.strictEqual(req.zip().country, countryCode);
        assert.deepStrictEqual(req.zip(), {
          zip: zipCode,
          country: countryCode
        });
      });
    });

    describe('#limit()', function () {
      const limitValue = 3;
      it('should set a limit property of the request', function () {
        const req = (new weather.WeatherRequest()).limit(limitValue);
        assert.strictEqual(req.limit(), limitValue);
      });
    });

    describe('#units()', function () {
      let req;
      beforeEach(function () {
        req = new weather.WeatherRequest();
      });

      it('should set the temperature units to imperial', function () {
        req.units(weather.TemperatureUnit.IMPERIAL);
        assert.strictEqual(req.units(), weather.TemperatureUnit.IMPERIAL);
      });

      it('should set the temperature units to standard', function () {
        req.units(weather.TemperatureUnit.STANDARD);
        assert.strictEqual(req.units(), weather.TemperatureUnit.STANDARD);
      });

      it('should set the temperature units to metric', function () {
        req.units(weather.TemperatureUnit.METRIC);
        assert.strictEqual(req.units(), weather.TemperatureUnit.METRIC);
      });
    });

    describe('#language()', function () {
      const languageValue = 'sp';
      it('should set the language code', function () {
        const req = (new weather.WeatherRequest()).language(languageValue);
        assert.strictEqual(req.language(), languageValue);
      });
    });

    describe('#url()', function () {
      const params = {  // params object used in tests
        mode: 'json',
        APPID: 'API-KEY',
        cnt: '4',
        q: 'Austin',
        lang: 'sk',
        units: 'imperial'
      };
      it('should have the correct params for the current weather', function () {
        const req = weather.current()
          .appid(params.APPID)
          .city(params.q)
          .limit(params.cnt)
          .language(params.lang)
          .units(weather.TemperatureUnit.IMPERIAL);
        const urlObj = url.parse(req.url(), true);
        assert.strictEqual(urlObj.hostname, 'api.openweathermap.org');
        assert.strictEqual(urlObj.pathname, '/data/2.5/weather');
        assert.deepEqual(urlObj.query, params);
      });

      it('should have the specified params for the 5 day forecast', function() {
        const req = weather.forecast5()
          .appid(params.APPID)
          .city(params.q)
          .limit(params.cnt)
          .language(params.lang)
          .units(weather.TemperatureUnit.IMPERIAL);
        const urlObj = url.parse(req.url(), true);
        assert.strictEqual(urlObj.hostname, 'api.openweathermap.org');
        assert.strictEqual(urlObj.pathname, '/data/2.5/forecast');
        assert.deepEqual(urlObj.query, params);
      });

      it('should have the specified params for the 16 day forecast', function () {
        const latValue = 26.301741;
        const lonValue = -98.163338;
        const req = weather.forecast16()
          .appid('API-KEY')
          .coords(latValue, lonValue);
        const urlObj = url.parse(req.url(), true);
        assert.strictEqual(urlObj.hostname, 'api.openweathermap.org');
        assert.strictEqual(urlObj.pathname, '/data/2.5/forecast/daily');
        assert.deepEqual(urlObj.query, {
          mode: 'json',
          APPID: 'API-KEY',
          lat: latValue.toString(),
          lon: lonValue.toString()
        });
      });
    });

    describe('#exec()', function () {
      const returnValue = { body : 'success!'};
      it('send an API request to the CURRENT endpoint', function () {
        const params = {
          mode: 'json',
          APPID: 'API-KEY',
          lang: 'es',
          units: 'imperial',
          q: 'Austin',
        };

        nock('http://api.openweathermap.org')
          .get('/data/2.5/weather')
          .query(params)
          .reply(200, returnValue);

        const req = weather.current()
          .city('Austin')
          .appid('API-KEY')
          .language('es')
          .units(weather.TemperatureUnit.IMPERIAL);

        assert.doesNotReject(req.exec().then(value => {
          assert.deepEqual(value, returnValue);
          assert.ok(nock.isDone());
        }));
      });

      it('sends an API request to the 5 day Forecast endpoint', function () {
        const params = {
          mode: 'json',
          APPID: 'API-KEY',
          units: 'metric',
          zip: '11111',
          cnt: 4
        };
        nock('http://api.openweathermap.org')
          .get('/data/2.5/forecast')
          .query(params)
          .reply(200, returnValue);
        const req = (new weather.WeatherRequest())
          .type(weather.WeatherRequestType.FORECAST_5)
          .appid(params.APPID)
          .units(weather.TemperatureUnit.METRIC)
          .zip(params.zip)
          .limit(params.cnt);
        assert.doesNotReject(req.exec().then(value => {
          assert.deepEqual(value, returnValue);
          assert.ok(nock.isDone());
        }));
      });

      it('sends an API request to the 16 day Forecast endpoint', function () {
        const params = {
          mode: 'json',
          id: 'id',
          APPID: 'API-KEY',
          units: 'standard',
          lat: 26.301741,
          lon: -98.163338
        };
        nock('http://api.openweathermap.org')
          .get('/data/2.5/forecast/daily')
          .query(params)
          .reply(200, returnValue);
        const req = (new weather.WeatherRequest())
          .type(weather.WeatherRequestType.FORECAST_16)
          .id(params.id)
          .appid(params.APPID)
          .units(weather.TemperatureUnit.STANDARD)
          .coords(params.lat, params.lon);
        assert.doesNotReject(req.exec().then(value => {
          assert.deepEqual(value, returnValue);
          assert.ok(nock.isDone());
        }));
      });
    });
  });

  /** Test factory functions below */
  describe('#forecast5()', function () {
    it('should return a WeatherRequest of request type FORECAST_5', function () {
      const req = weather.forecast5();
      assert.strictEqual(req.type(), weather.WeatherRequestType.FORECAST_5);
    });
  });

  describe('#forecast16()', function () {
    it('should return a WeatherRequest of request type FORECAST', function () {
      const req = weather.forecast16();
      assert.strictEqual(req.type(), weather.WeatherRequestType.FORECAST_16);
    });
  });

  describe('#current()', function () {
    it('should return a WeatherRequest of request type CURRENT', function () {
      const req = weather.current();
      assert.strictEqual(req.type(), weather.WeatherRequestType.CURRENT);
    });
  });

  /** Test the default key for weather requests are set. */
  describe('#defaultKey()', function () {
    const defaultKey = 'API-KEY';
    const overrideKey = 'NEW-API-KEY';
    beforeEach(function () {
      weather.defaultKey(defaultKey);
    });

    it('should set the default key for a new WeatherRequest', function () {
      assert.deepStrictEqual(weather.defaultKey(), defaultKey);
    });

    it('should reset the default key for a new WeatherRequest', function () {
      weather.defaultKey(overrideKey);
      assert.notStrictEqual(weather.defaultKey(), defaultKey);
      assert.strictEqual(weather.defaultKey(), overrideKey);
    });

    it('should set the default key for a new WeatherRequest', function () {
      const req = new weather.WeatherRequest();
      assert.deepStrictEqual(req.appid(), defaultKey);
    });

    it('should be able to override the default key', function () {
      const req = new weather.WeatherRequest();
      req.appid(overrideKey);
      assert.strictEqual(req.appid(), overrideKey);
    });
  });

  /** TemperatureUnit tests */
  describe('TemperatureUnit Enum', function () {
    describe('#getName()', function () {
      it('should return metric', function () {
        const metric = weather.TemperatureUnit.METRIC;
        const name = weather.TemperatureUnit.getName(metric);
        assert.strictEqual(name, 'metric');
      });

      it('should return standard', function () {
        const standard = weather.TemperatureUnit.STANDARD;
        const name = weather.TemperatureUnit.getName(standard);
        assert.strictEqual(name, 'standard');
      });

      it('should return imperial', function () {
        const imperial = weather.TemperatureUnit.IMPERIAL;
        const name = weather.TemperatureUnit.getName(imperial);
        assert.strictEqual(name, 'imperial');
      });
    });
  });

  /** WeatherRequestType test */
  describe('WeatherRequestType Enum', function () {
    describe('#getName()', function () {
      it('should return current', function () {
        const current = weather.WeatherRequestType.CURRENT;
        const name = weather.WeatherRequestType.getName(current);
        assert.strictEqual(name, 'current');
      });

      it('should return forecast5', function () {
        const forecast = weather.WeatherRequestType.FORECAST_5;
        const name = weather.WeatherRequestType.getName(forecast);
        assert.strictEqual(name, 'forecast5');
      });

      it('should return forecast16', function () {
        const forecast = weather.WeatherRequestType.FORECAST_16;
        const name = weather.WeatherRequestType.getName(forecast);
        assert.strictEqual(name, 'forecast16');
      });

      it('should throw an InvalidRequestType', function () {
        const other = null; // dummy value
        const func = () => weather.WeatherRequestType.getName(other);
        assert.throws(func, InvalidRequestType, 'Unknown UVRequestType');
      });
    });
  });
});
