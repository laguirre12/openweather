/**
 * A module for interacting with the free OpenWeather weather API. Provides
 * an interface for interacting with the OpenWeather Current Weather API
 * ({@link https://openweathermap.org/current}) and the 5 day forecast API
 * ({@link https://openweathermap.org/forecast5}).
 * @module openweather-weather
 * @author laguirre <aguirreluis1234@gmail.com>
 */

const got = require('got');
const url = require('url');

let APPID; // global references to API_KEY

//--------------------------------------------------------------------
// Enums
//--------------------------------------------------------------------

/**
 * Enum for the possible temperature units received from requests. Standard
 * units are kelvin.
 * @constant
 * @readonly
 * @enum {symbol(string)}
 */
const TemperatureUnit = Object.freeze({
  METRIC: Symbol('metric'),
  STANDARD: Symbol('standard'),  // kelvin
  IMPERIAL: Symbol('imperial'),

  /**
   * Returns a string representation of the given TemperatureUnit.
   * @param {TemperatureUnit} unit the unit to get the name of
   * @return {string} string value of given TemperatureUnit
   */
  getName: function (unit) {
    switch (unit) {
      case TemperatureUnit.METRIC: return 'metric';
      case TemperatureUnit.STANDARD: return 'standard';
      case TemperatureUnit.IMPERIAL: return 'imperial';
      default: throw 'unknown unit type';
    }
  }
});

/**
 * Enum for the Openweather API's that are supported by this module.
 * @constant
 * @readonly
 * @enum {symbol(string)}
 */
const WeatherRequestType = Object.freeze({
  FORECAST: Symbol('forecast'), // 5 day & 3 hour forecast
  CURRENT: Symbol('current'),

  /**
   * Returns a string representation of the given WeatherRequestType.
   * @param {WeatherRequestType} type the RequestType to get the name of
   * @return {string} string value of given TemperatureUnit
   */
  getName: function (type) {
    switch (type) {
      case WeatherRequestType.CURRENT: return 'current';
      case WeatherRequestType.FORECAST: return 'forecast';
      default: throw 'unknown request type';
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
BaseUrl[WeatherRequestType.CURRENT] = base  + 'weather?';
BaseUrl[WeatherRequestType.FORECAST] = base + 'forecast?';
Object.freeze(BaseUrl);


//--------------------------------------------------------------------
// Request class
//--------------------------------------------------------------------

/**
 * Represents an OpenWeather API call. Each WeatherRequest has a type and an
 * associated URL that is constructed for the request. Parameters for the
 * request can be set using chainable methods that act as both getters and
 * setters for the given property.
 */
class WeatherRequest {
  /**
   * Constructs a WeatherRequest object, takes a configuration object to
   * specify default properties of the request.
   * @param {object} [config] A configuration object for the request.
   */
  constructor(config) {
    if (config === null || typeof config !== 'object')  {
      config = {};
    }
    this.appid_ = config.appid || APPID;
    this.type_ = config.type;
    this.id_ = config.cityId;
    this.zip_ = config.zip;
    this.city_ = config.city;
    this.country_ = config.country || 'us';  // default USA
    this.coords_ = config.coords;
    this.limit_ = config.limit;
    this.units_ = config.units || TemperatureUnit.STANDARD; // standard units
    this.language_ = config.language || 'en'; // default english
  }

  /**
   * Constructs the url for the corresponding OpenWeather request using all
   * provided parameters.
   * @return {string} The url that corresponds to the API request
   */
  url() {
    const requestUrl = new url.URL(BaseUrl[this.type_]);
    const params = requestUrl.searchParams;

    // necessary for request
    params.append('mode', 'json');
    params.append('APPID', this.appid_);

    // optional for requests
    if (this.id_) params.append('id', this.id_);
    if (this.limit_) params.append('cnt', this.limit_);
    if (this.zip_) params.append('zip', `${this.zip_},${this.country_}`);
    if (this.city_) params.append('q', `${this.city_},${this.country_}`);
    if (this.coords_) {
      params.append('lat', this.lat_);
      params.append('lon', this.lon_);
    }

    // these are set by default in constructor
    params.append('lang', this.language_);
    params.append('units', TemperatureUnit.getName(this.units_));
    return requestUrl.href;
  }

  /**
   * Given an appid value sets the API KEY for this specific request,
   * otherwise returns the 'appid' for this request. Sets the 'APPID' param of
   * the request url.
   * @param {string} [appid] The OpenWeather API key to use for this request.
   * @return {WeatherRequest | string} The 'appid' string assigned to this
   * request if no parameters are passed, otherwise this.
   */
  key(appid) {
    if (!arguments.length) return this.appid_;
    this.appid_ = appid;
    return this;
  }

  /**
   * Given a WeatherRequestType, specifies which OpenWeather API this request
   * corresponds to. If no parameters are passed, returns the assigned
   * WeatherRequestType.
   * @param {WeatherRequestType} [requestType] The type of this WeatherRequest.
   * @return {WeatherRequest | WeatherRequestType} The RequestType assigned to
   * this request if no parameters are passed, otherwise this.
   */
  type(requestType) {
    if (!arguments.length) return this.type_;
    this.type_ = requestType;
    return this;
  }

  /**
   * Given a city id, sets the location of the request by specifying the
   * unique city id. If no parameters are passed, returns the assigned
   * WeatherRequestType. City ids can be found on the OpenWeather API reference
   * at {@link http://bulk.openweathermap.org/sample/}.
   * @param {string} [cityId] The id of the city to search for.
   * @return {WeatherRequest | string} The city id assigned to this request
   * if no parameters are passed, otherwise this.
   */
  id(cityId) {
    if (!arguments.length) return this.id_;
    this.id_ = cityId;
    return this;
  }

  /**
   * Given a geo coordinates sets the location of the request. If no
   * parameters are passed, reports the assigned coordinates.
   * @param {number} [lat] The latitude of the location.
   * @param {number} [lon] The longitude of the location.
   * @return {WeatherRequest | object} An object containing the 'lat' and 'lon'
   * properties of the request if no parameters are passed, otherwise this.
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
   * @param {country} [country] The country code for the city (default 'us')
   * @return {WeatherRequest | object} An object containing the assigned
   * 'city' name and 'country' code if no parameters are passed, otherwise
   * this.
   */
  city(name, country = 'us') {
    if (!arguments.length) return { city: this.city_, country: this.country_ };
    this.city_ = name;
    this.country_ = country;
    return this;
  }

  /**
   * Given a zip code and optionally a country code sets the location of the
   * request. If no parameters are passed, reports assigned zip/country codes.
   * @param {string} [code] Zip code
   * @param {string} [country] Country code, not required
   * @return {WeatherRequest | object} An object containg the assigned 'zip'
   * and 'country' codes if no paramters are passed, otherwise, this.
   */
  zip(code, country = undefined) {
    if (!arguments.length) return { zip: this.zip_, country: this.country_ };
    this.zip_ = code;
    this.country_ = country;
    return this;
  }

  /**
   * Given a value, sets a limit on the number of resulting cities that should
   * be returned by the API Request. If no parameters are passed, returns the
   * assigned limit. By default, API requests have no limit.
   * @param {number} [count] Max number of results, an integer greater than 0
   * @return {WeatherRequest | number} The assigned limit value, otherwise this
   */
  limit(count) {
    if (!arguments.length) return this.limit_;
    this.limit_ = count;
    return this;
  }


  // TODO(la): should i create functions to set the units
  // .toStandad(), .toImperial(), .toMetric()

  /**
   * Given a TemperatureUnit, sets the expected temperature units for the API
   * request. If no parameters are passed, reports the assigned temperature
   * unit.
   * @param {TemperatureUnit} [type] Which unit type to use for the result
   * @return {WeatherRequest | TemperatureUnit} The TemperatureUnit of the
   * request if no parameters are passed, otherwise this.
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
   * @link{https://openweathermap.org/current#multi}.
   * @param {string} [code] The language code for the desired language.
   * @return {WeatherRequest | string} The assigned language code for the
   * request if no parameters are passed, otherwise this.
   */
  language(code) {
    if (!arguments.length) return this.language_;
    this.language_ = code;
    return this;
  }

  /**
   * Executes the API request.
   * @param {function(err, res)} [callback] a callback function that is called
   * with a possible error and the API response.
   * @return {Promise} A promise representing the result of the request.
   */
  exec(callback) {
    const url = this.url();
    callback = callback || (() => {});
    return got(url)
      .then(addToCache)
      .then(res => res.body)
      .then(res => callback(null, res))
      .catch(err => callback(err));
  }
}

/**
 * Adds the response to the HTTP request to the cache.
 * @param {object} response response received from an HTTP request with got.
 * @return {object} response
 */
function addToCache(response) {
  // TODO(la): implement this (payload can be found in response.body)
  return response;
}


//--------------------------------------------------------------------
// Factories and Other Methods
//--------------------------------------------------------------------


/**
 * Sets and retrieves the global (default) API key to use for requests.
 * @param {string} appid Default API key
 * @return {string} The current default API KEY
 */
function defaultKey(appid) {
  if (arguments.length) APPID = appid;
  return APPID;
}

/**
 * Returns a WeatherRequest for the OpenWeather forecast API. The
 * WeatherRequest will have 'forecast' WeatherRequestType.
 * @return {WeatherRequest} A generic request for the forecast API
 */
function forecast() {
  return new WeatherRequest().type(WeatherRequestType.FORECAST);
}

/**
 * Returns a WeatherRequest for the OpenWeather current Weather API. The
 * WeatherRequest will have the 'current' WeatherRequestType.
 * @return {WeatherRequest} A generic request for the current weather API
 */
function current() {
  return new WeatherRequest().type(WeatherRequestType.CURRENT);
}


//--------------------------------------------------------------------
// Exports
//--------------------------------------------------------------------

module.exports = {
  current: current,
  forecast: forecast,
  defaultKey: defaultKey,

  WeatherRequest: WeatherRequest,
  TemperatureUnit: TemperatureUnit,
  WeatherRequestType: WeatherRequestType,
};
