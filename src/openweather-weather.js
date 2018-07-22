/**
 * A module for interacting with the free OpenWeather weather API. Provides
 * an interface for interacting with the OpenWeather Current Weather API
 * ({@link https://openweathermap.org/current}), the 5 day hourly forecast
 * API ({@link https://openweathermap.org/forecast5}), and the 16 day daily.
 * forecast API ({@link https://openweathermap.org/forecast16}).
 * @module openweather-weather
 * @author laguirre <aguirreluis1234@gmail.com>
 */

const got = require('got');
const url = require('url');
const InvalidRequestType = require('./openweather-base').InvalidRequestType;

let APPID; // global references to API_KEY

//--------------------------------------------------------------------
// General Enums
//--------------------------------------------------------------------

/**
 * Enum for the possible temperature units received from requests. Standard
 * units are kelvin.
 * @constant
 * @readonly
 * @enum {symbol(string)}
 * @property {symbol(string)} METRIC metric units
 * @property {symbol(string)} STANDARD standard (kelvin) units
 * @property {symbol(string)} IMPERIAL imperial units
 * @property {function(string)} getName a function to retrieve string names of
 * units
 */
const TemperatureUnit = Object.freeze({
  METRIC: Symbol('metric'),
  STANDARD: Symbol('standard'),  // kelvin
  IMPERIAL: Symbol('imperial'),

  /**
   * Returns a string representation of the given TemperatureUnit.
   * @param {TemperatureUnit} unit the unit to get the name of
   * @returns {string} the string value of the given TemperatureUnit
   * @throws {InvalidRequestType} if the given value is not a recognized
   * TemperatureUnit
   */
  getName: function (unit) {
    switch (unit) {
      case TemperatureUnit.METRIC: return 'metric';
      case TemperatureUnit.STANDARD: return 'standard';
      case TemperatureUnit.IMPERIAL: return 'imperial';
      default: throw new InvalidRequestType('Unknown TemperatureUnit');
    }
  }
});

//--------------------------------------------------------------------
// WeatherRequestType Enum
//--------------------------------------------------------------------

/**
 * Enum for the Openweather API's that are supported by this module.
 * @constant
 * @readonly
 * @enum {symbol(string)}
 * @implements RequestType
 * @property {symbol(string)} CURRENT the current weather data endpoint
 * ({@link https://openweathermap.org/current})
 * @property {symbol(string)} FORECAST_5 the 5 Day forecast weather
 * data endpoint({@link https://openweathermap.org/forecast5})
 * @property {symbol(string)} FORECAST_16 the 16 day forecast weather data
 * endpoint ({@link https://openweathermap.org/forecast16})
 * @property {function(WeatherRequestType)} getName retrieves the string name
 * of the RequestType
 */
const WeatherRequestType = Object.freeze({
  CURRENT: Symbol('current'),
  FORECAST_5: Symbol('forecastDay'),
  FORECAST_16: Symbol('forecastHour'),

  /**
   * Returns a string representation of the given WeatherRequestType.
   * @param {WeatherRequestType} type the RequestType to get the name of
   * @returns {string} string value of given WeatherRequestType
   * @throws {InvalidRequestType} if the given value is not a recognized
   * WeatherRequestType
   */
  getName: function (type) {
    switch (type) {
      case WeatherRequestType.CURRENT: return 'current';
      case WeatherRequestType.FORECAST_5: return 'forecast5';
      case WeatherRequestType.FORECAST_16: return 'forecast16';
      default: throw new InvalidRequestType('Unknown WeatherRequestType');
    }
  }
});

//--------------------------------------------------------------------
// Maps for WeatherRequestTypes to URL's
//--------------------------------------------------------------------

/**
 * Base url used for all API requests.
 * @private
 */
const base = 'http://api.openweathermap.org/data/2.5/';

/**
 * Map of base URL's for each OpenWeather API.
 * @private
 */
const BaseUrl = {};
BaseUrl[WeatherRequestType.CURRENT] = base  + 'weather';
BaseUrl[WeatherRequestType.FORECAST_5] = base + 'forecast';
BaseUrl[WeatherRequestType.FORECAST_16] = base + 'forecast/daily';
Object.freeze(BaseUrl);

//--------------------------------------------------------------------
// Request class
//--------------------------------------------------------------------

/**
 * Represents an OpenWeather API call. Each WeatherRequest has a type and an
 * associated URL that is constructed for the request. Parameters for the
 * request can be set using chainable methods that act as both getters and
 * setters for the given property. WeatherRequests only support a single
 * location.
 *
 * NOTE: The OpenWeather API by default assigns a country code of 'us',
 * language of 'en' (english), and assumes standard (kelvin) temperature units.
 * These default values are NOT set by the WeatherRequest object, but noted on
 * each corresponding function.
 * @implements {OpenWeatherRequest}
 * @example
 * // creates a new request with no properties set
 * const req = new WeatherRequest();
 * req.appid('API-KEY')
 *    .type(WeatherRequestType.CURRENT)
 *    .city('Austin')
 *    .language('en');
 * @example
 * // constructs a new request with all properties used in the request
 * const req = new WeatherRequest({
 *   appid: 'API-KEY',
 *   type: WeatherRequestType.CURRENT, // CURRENT, FORECAST_5, or FORECAST_16
 *   id: 'city-id',                    // id of city to search for
 *   zip: '11111',                     // zip code of the city
 *   city: 'Austin',                   // city name
 *   country: 'us',                    // country code
 *   lat: 100.113,                     // geo. coordinates of the request
 *   lon: 55.166,
 *   limit: 3,                         // limit on number of results
 *   units: TemperatureUnit.STANDARD,  // which units temperature should be in
 *   language: 'en'                    // language for weather description
 * });
 *
 * req.key() === 'API-KEY';
 * req.type() === WeatherRequestType.CURRENT;
 *
 * // NOTE: you only need one of: city id, city name & country, zip & country,
 * // or geo. coordinates for the request
 */
class WeatherRequest {
  /**
   * Constructs a WeatherRequest object, takes a configuration object to
   * specify default properties of the request. The properties used in the
   * config object can be seen in the examples.
   * @param {Object} [config] A configuration object for the request
   */
  constructor(config) {
    if (config === null || typeof config !== 'object')  {
      config = {};
    }
    this.appid_ = config.appid || APPID;
    this.type_ = config.type;
    this.id_ = config.id;
    this.zip_ = config.zip;
    this.city_ = config.city;
    this.country_ = config.country;
    this.lat_ = config.lat;
    this.lon_ = config.lon;
    this.limit_ = config.limit;
    this.units_ = config.units;
    this.language_ = config.language;
  }

  /**
   * Constructs the url for the corresponding OpenWeather request using all
   * provided parameters.
   * @returns {string} The url that corresponds to the API request
   */
  url() {
    const requestUrl = new url.URL(BaseUrl[this.type_]);
    const params = requestUrl.searchParams;

    // necessary for request
    params.append('mode', 'json');
    params.append('APPID', this.appid_);

    // optional for requests
    if (this.id_)       params.append('id', this.id_);
    if (this.zip_)      params.append('zip', `${this.zip_},${this.country_}`);
    if (this.limit_)    params.append('cnt', this.limit_);
    if (this.language_) params.append('lang', this.language_);
    if (this.units_)    params.append('units', TemperatureUnit.getName(this.units_));
    if (this.lat_ && this.lon_) {
      params.append('lat', this.lat_);
      params.append('lon', this.lon_);
    }

    // TODO(la): clean this up
    if (this.city_) {
      let value = `${this.city_}`;
      if (this.country_)
        value += `,${this.country_}`;
      params.append('q', value);
    }
    return requestUrl.href;
  }

  /**
   * Given an key value sets the API KEY for this specific request,
   * otherwise returns the 'appid' for this request. Sets the 'APPID' param of
   * the request url.
   * @param {string} [appid] The OpenWeather API key to use for this request
   * @returns {WeatherRequest | string} The 'appid' string assigned to this
   * request if no parameters are passed, otherwise this
   */
  appid(appid) {
    if (!arguments.length) return this.appid_;
    this.appid_ = appid;
    return this;
  }

  /**
   * Given a WeatherRequestType, specifies which OpenWeather weather API this
   * request corresponds to. If no parameters are passed, returns the assigned
   * WeatherRequestType.
   * @param {WeatherRequestType} [requestType] The type of this WeatherRequest
   * @returns {WeatherRequest | WeatherRequestType} The RequestType assigned to
   * this request if no parameters are passed, otherwise this
   */
  type(requestType) {
    if (!arguments.length) return this.type_;
    this.type_ = requestType;
    return this;
  }

  /**
   * Given a city id, sets the location of the request by specifying the
   * unique city id. If no parameters are passed, returns the currently
   * assigned city id. City ids can be found on the OpenWeather API reference
   * at {@link http://bulk.openweathermap.org/sample/}.
   * @param {string} [cityId] The id of the city to search for
   * @returns {WeatherRequest | string} The city id assigned to this request
   * if no parameters are passed, otherwise this
   */
  id(cityId) {
    if (!arguments.length) return this.id_;
    this.id_ = cityId;
    return this;
  }

  /**
   * Given a geo coordinates sets the location of the request. If no
   * parameters are passed, reports the assigned coordinates.
   * @param {number} [lat] The latitude of the location
   * @param {number} [lon] The longitude of the location
   * @returns {WeatherRequest | Object} An object containing the 'lat' and 'lon'
   * properties of the request if no parameters are passed, otherwise this
   */
  coords(lat, lon) {
    if (!arguments.length) return { lat : this.lat_, lon : this.lon_ };
    this.lat_ = lat;
    this.lon_ = lon;
    return this;
  }

  /**
   * Given a city name and optionally a country code, sets the location of
   * the request. If no parameters are passed, reports the assigned location.
   * @param {string} [name] The name of the city to search for.
   * @param {country} [country] The country code for the city.
   * @returns {WeatherRequest | Object} An object containing the assigned
   * 'city' name and 'country' code if no parameters are passed, otherwise
   * this
   */
  city(name, country) {
    if (!arguments.length) return { city: this.city_, country: this.country_ };
    this.city_ = name;
    this.country_ = country;
    return this;
  }

  /**
   * Given a zip code and optionally a country code sets the location of the
   * request. If no parameters are passed, reports assigned zip/country codes.
   * @param {string} [code] Zip code
   * @param {string} [country] Country code for the zip code, not required
   * @returns {WeatherRequest | Object} An object containg the assigned 'zip'
   * and 'country' codes if no paramters are passed, otherwise this
   */
  zip(code, country) {
    if (!arguments.length) return { zip: this.zip_, country: this.country_ };
    this.zip_ = code;
    this.country_ = country || this.country_;
    return this;
  }

  /**
   * Sets a limit on the length of the response data. This value specifies the
   * the `cnt` parameter of the request, and limits the amount of data returned
   * in the forecasts.
   * NOTE: This parameter is not used for the CURRENT weather endpoint.
   * @param {number} [count] Max number of results, an integer greater than 0
   * @returns {WeatherRequest | number} The assigned `limit` value, otherwise
   * this
   */
  limit(count) {
    if (!arguments.length) return this.limit_;
    this.limit_ = count;
    return this;
  }

  /**
   * Given a TemperatureUnit, sets the expected temperature units for the API
   * request. If no parameters are passed, reports the assigned temperature
   * unit. According to the API documentation the default unit is kelvin
   * [TemperatureUNIT.STANDARD]{@link TemperatureUnit#STANDARD}.
   * @param {TemperatureUnit} [type] Which unit type to use for the result
   * @returns {WeatherRequest | TemperatureUnit} The TemperatureUnit of the
   * request if no parameters are passed, otherwise this
   */
  units(type) {
    if (!arguments.length) return this.units_;
    this.units_ = type;
    return this;
  }

  /**
   * Given a language code, sets the desired language for the result of
   * the API request. If no parameters are passed return the assigned language.
   * Language codes can be found on the OpenWeather API references
   * {@link https://openweathermap.org/current#multi}.
   * @param {string} [code] The language code for the desired language.
   * @returns {WeatherRequest | string} The assigned language code for the
   * request if no parameters are passed, otherwise this
   */
  language(code) {
    if (!arguments.length) return this.language_;
    this.language_ = code;
    return this;
  }

  /**
   * Executes the API request.
   * @param {function(err, res)} [callback] a callback function that is called
   * with a possible error and the API response
   * @returns {Promise} A promise representing the result of the request
   */
  // TODO(la): fix asynchronous support for both callback and promises
  exec(callback) {
    const url = this.url();
    callback = callback || ((val, err) => {
      return (val, err);
    });
    return got(url, { json: true })
      .then(res => res.body)
      .then(res => callback(res))
      .catch(err => {
        return callback(null, err)
      });
  }
}

//--------------------------------------------------------------------
// Factories and Other functions
//--------------------------------------------------------------------


/**
 * Sets and retrieves the global (default) API key to use for requests.
 * @param {string} appid Default API key
 * @returns {string} The current default API KEY
 */
function defaultKey(appid) {
  if (arguments.length) APPID = appid;
  return APPID;
}

/**
 * Returns a WeatherRequest for the OpenWeather forecast API. The
 * WeatherRequest will have 'forecast5' WeatherRequestType.
 * @returns {WeatherRequest} A generic request for the forecast5 API
 */
function forecast5() {
  return new WeatherRequest().type(WeatherRequestType.FORECAST_5);
}

/**
 * Returns a WeatherRequest for the OpenWeather forecast API. The
 * WeatherRequest will have 'forecast16' WeatherRequestType.
 * @returns {WeatherRequest} A generic request for the forecast16 API
 */
function forecast16() {
  return new WeatherRequest().type(WeatherRequestType.FORECAST_16);
}

/**
 * Returns a WeatherRequest for the OpenWeather current Weather API. The
 * WeatherRequest will have the 'current' WeatherRequestType.
 * @returns {WeatherRequest} A generic request for the current weather API
 */
function current() {
  return new WeatherRequest().type(WeatherRequestType.CURRENT);
}


//--------------------------------------------------------------------
// Exports
//--------------------------------------------------------------------

module.exports = {
  current: current,
  forecast5: forecast5,
  forecast16: forecast16,
  defaultKey: defaultKey,

  WeatherRequest: WeatherRequest,
  TemperatureUnit: TemperatureUnit,
  WeatherRequestType: WeatherRequestType,
};
