const url = require('url');
const nock = require('nock');
const assert = require('assert');
const weather = require('../src/openweather-weather');

const source = nock('http://api.weathermap.org/data/2.5/')
  .get('/weather?')
  .reply(200, {
    text: 'yay',
    id: '123ABC',
  });


describe('openweather-weather', function () {

  /** Test WeatherRequest class */
  describe('WeatherRequest', function () {
    let req;
    beforeEach(function () {
      req = new weather.WeatherRequest();
    });

    describe('#constructor()', function () {
      it('should have no properties set', function () {
        req = new weather.WeatherRequest();
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
        req = new weather.WeatherRequest(config);
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
        const key = '11111';
        req.appid(key);
        assert.strictEqual(req.appid(), key);
      });
    });

    describe('#type()', function () {
      it('should set the request type to CURRENT', function () {
        req.type(weather.WeatherRequestType.CURRENT);
        assert.strictEqual(req.type(), weather.WeatherRequestType.CURRENT);
      });

      it('should set the request type to FORECAST', function () {
        req.type(weather.WeatherRequestType.FORECAST);
        assert.strictEqual(req.type(), weather.WeatherRequestType.FORECAST);
      });
    });

    describe('#id()', function () {
      const idValue = '4688275';
      it('should set the city of the weather request', function () {
        req.id(idValue);
        assert.strictEqual(req.id(), idValue);
      });
    });

    describe('#coords()', function () {
      const latValue = 26.301741;
      const lonValue = -98.163338;
      it('should set the coordinates of a weather request', function () {
        req.coords(latValue, lonValue);
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
        req.city(cityName);
        assert.strictEqual(req.city().city, cityName);
      });

      it('should set the city and country', function () {
        req.city(cityName, countryCode);
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
        req.zip(zipCode);
        assert.strictEqual(req.zip().zip, zipCode);
      });

      it('should set the zip and country code', function () {
        req.zip(zipCode, countryCode);
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
        req.limit(limitValue);
        assert.strictEqual(req.limit(), limitValue);
      });
    });

    describe('#units()', function () {
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
        req.language(languageValue);
        assert.strictEqual(req.language(), languageValue);
      });
    });


    describe('#url()', function () {
      it('should have the right Current weather data endpoint', function () {
        const req = weather.current();
        const urlObj = url.parse(req.url(), true);
        assert.strictEqual(urlObj.hostname, 'api.openweathermap.org');
        assert.strictEqual(urlObj.pathname, '/data/2.5/weather');
      });

      it('should have the right forecast weather data endpoint', function () {
        const req = weather.forecast();
        const urlObj = url.parse(req.url(), true);
        assert.strictEqual(urlObj.hostname, 'api.openweathermap.org');
        assert.strictEqual(urlObj.pathname, '/data/2.5/forecast');
      });

      it('should have the specified city and other params', function () {
        const req = weather.current()
          .appid('111')
          .city('Madrid', 'es')
          .language('sk')
          .limit(4)
          .units(weather.TemperatureUnit.IMPERIAL);
        const urlObj = url.parse(req.url(), true);
        assert.strictEqual(urlObj.hostname, 'api.openweathermap.org');
        assert.strictEqual(urlObj.pathname, '/data/2.5/weather');
        assert.deepEqual(urlObj.query, {
          mode: 'json',
          APPID: '111',
          cnt: '4',
          q: 'Madrid,es',
          lang: 'sk',
          units: 'imperial',
        });
      });

      it('should have the specified geo coords and other params', function () {
        const latValue = 26.301741;
        const lonValue = -98.163338;
        const req = weather.forecast()
          .appid('111')
          .coords(latValue, lonValue);
        const urlObj = url.parse(req.url(), true);
        assert.strictEqual(urlObj.hostname, 'api.openweathermap.org');
        assert.strictEqual(urlObj.pathname, '/data/2.5/forecast');
        assert.deepEqual(urlObj.query, {
          mode: 'json',
          APPID: '111',
          lat: latValue.toString(),
          lon: lonValue.toString()
        });
      });
    });



    // TODO(la): use nock to mock HTTP requests
    // (https://scotch.io/tutorials/nodejs-tests-mocking-http-requests)
    describe('#exec()', function () {
      const req = weather.forecast().appid('111').city('Edinburg');
    });
  });



  /** Test forecast() factory function. */
  describe('#forecast()', function () {
    it('should return a WeatherRequest of request type FORECAST', function () {
      const req = weather.forecast();
      assert.strictEqual(req.type(), weather.WeatherRequestType.FORECAST);
    });
  });

  /** Test current() factory function. */
  describe('#current()', function () {
    it('should return a WeatherRequest of request type CURRENT', function () {
      const req = weather.current();
      assert.strictEqual(req.type(), weather.WeatherRequestType.CURRENT);
    });
  });



  /** Test the default key for weather requests are set. */
  describe('#defaultKey()', function () {
    const defaultKey = '111';
    const overrideKey = '222';
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



  // temperature unit tests
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
        const name = weather.TemperatureUnit.getName(imperial)
        assert.strictEqual(name, 'imperial');
      });
    });
  });



  // RequestType tests
  describe('WeatherRequestType Enum', function () {
    describe('#getName()', function () {
      it('should return current', function () {
        const current = weather.WeatherRequestType.CURRENT;
        const name = weather.WeatherRequestType.getName(current);
        assert.strictEqual(name, 'current');
      });

      it('should return forecast', function () {
        const forecast = weather.WeatherRequestType.FORECAST;
        const name = weather.WeatherRequestType.getName(forecast);
        assert.strictEqual(name, 'forecast');
      });
    });
  });

});
