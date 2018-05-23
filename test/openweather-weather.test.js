const url = require('url');
const nock = require('nock');
const assert = require('assert');
const weather = require('../src/server/weather/openweather-weather');

const source = nock('http://api.weathermap.org/data/2.5/')
  .get('/weather?')
  .reply(200, {
    text: "yay",
    id: "123ABC",
  });


describe('openweather-weather', function() {

  /** Test WeatherRequest class */
  describe('WeatherRequest', function() {
    let w;
    beforeEach(function() {
      w = new weather.WeatherRequest();
    });

    // TODO(la): write constructor test
    describe('#constructor()', function() {
    });

    describe('#key()', function() {
      it('should set the requests api key', function() {
        const key = '11111';
        w.key(key);
        assert.strictEqual(w.key(), key);
      });
    });

    describe('#type()', function() {
      it('should set the request type to CURRENT', function() {
        w.type(weather.WeatherRequestType.CURRENT);
        assert.strictEqual(w.type(), weather.WeatherRequestType.CURRENT);
      });

      it('should set the request type to FORECAST', function() {
        w.type(weather.WeatherRequestType.FORECAST);
        assert.strictEqual(w.type(), weather.WeatherRequestType.FORECAST);
      });
    });

    describe('#id()', function() {
      it('should set the city of the weather request', function() {
        w.id('4688275');
        assert.strictEqual(w.id(), '4688275');
      });
    });

    describe('#coords()', function() {
      it('should set the coordinates of a weather request', function() {
        w.coords(26.301741, -98.163338);
        assert.deepEqual(w.coords(), { lat: 26.301741, lon: -98.163338});
      });
    });

    describe('#city()', function() {
      it('should set the city of a weather request', function() {
        w.city('cityName');
        assert.strictEqual(w.city().city, 'cityName');
      });

      it('should have a default country of \'us\'', function() {
        assert.strictEqual(w.city().country, 'us');
      });

      it('should override the default country', function() {
        w.city('cityName', 'be');
        assert.strictEqual(w.city().country, 'be');
      });

      it('should return an object with city and country props', function() {
        w.city('cityName', 'be');
        assert.deepEqual(w.city(), { city: 'cityName', country: 'be' });
      });
    });

    describe('#zip()', function() {
      it('should set the zip code of a weather request', function() {
        w.zip('11111');
        assert.strictEqual(w.zip().zip, '11111');
      });

      it('should have a default country of \'us\'', function() {
        assert.strictEqual(w.city().country, 'us');
      });

      it('should override the default country', function() {
        w.zip('11111', 'be');
        assert.strictEqual(w.zip().country, 'be');
      });

      it('should return an object with zip and country props', function() {
        w.zip('11111', 'be');
        assert.deepEqual(w.zip(), { zip: '11111', country: 'be' });
      });
    });

    describe('#limit()', function() {
      it('should set a limit property of the request', function() {
        w.limit(3);
        assert.strictEqual(w.limit(), 3);
      });
    });

    describe('#units()', function() {
      it('should have default standard units', function() {
        assert.strictEqual(w.units(), weather.TemperatureUnit.STANDARD);
      });

      it('should set the temperature units to imperial', function() {
        w.units(weather.TemperatureUnit.IMPERIAL);
        assert.strictEqual(w.units(), weather.TemperatureUnit.IMPERIAL);
      });

      it('should set the temperature units to metric', function() {
        w.units(weather.TemperatureUnit.METRIC);
        assert.strictEqual(w.units(), weather.TemperatureUnit.METRIC);
      });
    });

    describe('#language()', function() {
      it('should set the language code', function() {
        w.language('sp');
        assert.strictEqual(w.language(), 'sp');
      });

      it('should have a default language of \'el\'', function() {
        assert.strictEqual(w.language(), 'el');
      });
    });


    describe('#url()', function() {
      it('should have the specified parameters', function () {
        const w = weather.current()
          .key('111')
          .city('Madrid', 'es')
          .language('sk')
          .limit(4)
          .units(weather.TemperatureUnit.IMPERIAL);
        const urlObj = url.parse(w.url(), true);
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
    });



    // TODO(la): use nock to mock HTTP requests
    // (https://scotch.io/tutorials/nodejs-tests-mocking-http-requests)
    describe('#exec()', function() {
      const req = weather.forecast().key('111').city('Edinburg');
      req.exec();
    });
  });



  /** Test forecast() factory function. */
  describe('#forecast()', function() {
    it('should return a WeatherRequest of request type FORECAST', function() {
      const w = weather.forecast();
      assert.strictEqual(w.type(), weather.WeatherRequestType.FORECAST);
    });
  });

  /** Test current() factory function. */
  describe('#current()', function() {
    it('should return a WeatherRequest of request type CURRENT', function() {
      const w = weather.current();
      assert.strictEqual(w.type(), weather.WeatherRequestType.CURRENT);
    });
  });



  /** Test the default key for weather requests are set. */
  describe('#defaultKey()', function() {
    const defaultKey = '111';
    beforeEach(function() {
      weather.defaultKey(defaultKey);
    });

    it('should set the default key for a new WeatherRequest', function() {
      assert.deepStrictEqual(weather.defaultKey(), defaultKey);
    });

    it('should reset the default key for a new WeatherRequest', function() {
      weather.defaultKey('222');
      assert.notStrictEqual(weather.defaultKey(), defaultKey);
      assert.strictEqual(weather.defaultKey(), '222');
    });

    it('should set the default key for a new WeatherRequest', function() {
      const w = new weather.WeatherRequest();
      assert.deepStrictEqual(w.key(), defaultKey);
    });

    it('should be able to override the default key', function() {
      const w = new weather.WeatherRequest();
      w.key('222');
      assert.strictEqual(w.key(), '222');
    });
  });


  // temperature unit tests
  describe('TemperatureUnit Enum', function() {
    describe('#getName()', function() {
      it('should return metric', function() {
        const metric = weather.TemperatureUnit.METRIC;
        const name = weather.TemperatureUnit.getName(metric);
        assert.strictEqual(name, 'metric');
      });

      it('should return standard', function() {
        const standard = weather.TemperatureUnit.STANDARD;
        const name = weather.TemperatureUnit.getName(standard);
        assert.strictEqual(name, 'standard');
      });

      it('should return imperial', function() {
        const imperial = weather.TemperatureUnit.IMPERIAL;
        const name = weather.TemperatureUnit.getName(imperial)
        assert.strictEqual(name, 'imperial');
      });
    });
  });


  // RequestType tests
  describe('WeatherRequestType Enum', function() {
    describe('#getName()', function() {
      it('should return current', function() {
        const current = weather.WeatherRequestType.CURRENT;
        const name = weather.WeatherRequestType.getName(current);
        assert.strictEqual(name, 'current');
      });

      it('should return forecast', function() {
        const forecast = weather.WeatherRequestType.FORECAST;
        const name = weather.WeatherRequestType.getName(forecast);
        assert.strictEqual(name, 'forecast');
      });
    });
  });
});
