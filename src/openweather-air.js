/**
 * A module for interacting with the OpenWeather air pollution API (in beta).
 * Provides an interface for sending requests to the following endpoints: <br>
 * * {@link https://openweathermap.org/api/pollution/co}
 * * {@link https://openweathermap.org/api/pollution/o3}
 * * {@link https://openweathermap.org/api/pollution/no2}
 * * {@link https://openweathermap.org/api/pollution/so2}
 *
 * NOTE: As specified by the OpenWeather docs, all responses are currently
 * available as JSON
 * @module openweather-air
 * @author laguirre <aguirreluis1234@gmail.com>
 */

const got = require('got');
const InvalidRequestType = require('./openweather-base').InvalidRequestType;

let APPID; // global references to API_KEY

//--------------------------------------------------------------------
// Enums
//--------------------------------------------------------------------

/**
 * Enum for Openweather Air pollution API that are supported by this module.
 * @constant
 * @readonly
 * @enum {symbol(string)}
 * @implements RequestType
 * @property {symbol(string)} O3 the ozone data endpoint
 * ({@link https://openweathermap.org/api/pollution/o3})
 * @property {symbol(string)} CO the carbon-monoxide data endpoint
 * ({@link https://openweathermap.org/api/pollution/co})
 * @property {symbol(string)} SO2 the sulfur-dioxide data endpoint
 * ({@link https://openweathermap.org/api/pollution/so2})
 * @property {symbol(string)} NO2 the nitrogen-dioxide data endpoint
 * ({@link https://openweathermap.org/api/pollution/no2})
 */
const AirRequestType = Object.freeze({
  O3: Symbol('o3'),
  CO: Symbol('co'),
  SO2: Symbol('so2'),
  NO2: Symbol('no2'),

  /**
   * Returns a string representation of the given AirRequestType.
   * @param {AirRequestType} type the RequestType to get the name of
   * @returns {string} string value of the given AirRequestType
   * @throws {InvalidRequestType} if the given value is not a recognized
   * AirRequestType
   */
  getName: function (type) {
    switch (type) {
      case AirRequestType.O3: return 'o3';    // ozone
      case AirRequestType.CO: return 'co';   // carbon-monoxide
      case AirRequestType.SO2: return 'so2'; //sulfur-dioxide
      case AirRequestType.NO2: return 'no2'; // nitrogen-dioxide
      default: throw new InvalidRequestType('Unknown AirRequestType');
    }
  }
});


//--------------------------------------------------------------------
// Maps for RequestTypes to URL's
//--------------------------------------------------------------------

/**
 * Base url used for all API requests.
 * @private
 */
const base = 'http://api.openweathermap.org/pollution/v1/';

/**
 * Map of url's for each endpoint covered in this module.
 * @private
 */
const BaseUrl = {};
BaseUrl[AirRequestType.CO] = base + 'co';
BaseUrl[AirRequestType.O3] = base + 'o3';
BaseUrl[AirRequestType.CO2] = base + 'so2';
BaseUrl[AirRequestType.NO2] = base + 'no2';
Object.freeze(BaseUrl);

//--------------------------------------------------------------------
// Request classes
//--------------------------------------------------------------------

/**
 * Represents an OpenWeather air pollution API call. Each AirRequest has
 * a type and an associated URL that is constructed for the request. Parameters
 * for the request can be set using chainable methods that act as both getters
 * and setters for the given property.
 * @implements {OpenWeatherRequest}
 * @example
 * // creates a new AirRequest with no properties set
 * const req = new AirRequest();
 * @example
 * // creates a new AirRequest with all properties used in the request
 * const req = new AirRequest({
 *   appid: 'API-KEY',
 *   type: AirRequestType.O3,          // can be O3, CO, SO2, or NO2
 *   lat: 100.113,                     // Requests to the Air pollution API
 *   lon: 55.166,                      //   must use geo coordinates
 *   datetime: new Date().toISOString  // an ISO time string
 * });
 */
class AirRequest {
  /**
   * Constructs a AirRequest object, takes an optional configuration
   * object to specify default properties of the request. AirRequest have
   * are given the default API Key (set globally) and a default datetime of the
   * objects creation, unless otherwise specified.
   *
   * NOTE: The datetime value should be a ISO 8601 time string. The default
   * datetime is: `(new Date()).toISOString()`, and according to the
   * OpenWeather API docs. all dates are UTC only.
   * @param {Object} [config] A configuration object for the request
   */
  constructor(config) {
    if (config === null || typeof config !== 'object') {
      config = {};
    }
    this.appid_ = config.appid || APPID;
    this.type_ = config.type;
    this.lat_ = config.lat;
    this.lon_ = config.lon;
    this.datetime_ = config.datetime || (new Date()).toISOString();
  }

  /**
   * Sets the API KEY for this AirRequest, if no parameters are passed
   * returns this requests API KEY. By default all PolutionRequests have the
   * global default APPID.
   * @param {string} [appid] The OpenWeather API key to use for this request.
   * @returns {AirRequest | string} The 'appid' string assigned to this
   * request if no parameters are passed. Otherwise 'this'.
   */
  appid(appid) {
    if (!arguments.length) return this.appid_;
    this.appid_ = appid;
    return this;
  }

  /**
   * Constructs the url for the corresponding OpenWeather request using all
   * provided parameters.
   * @returns {string} The url that corresponds to the API request
   */
  url() {
    const input = `/${this.lat_},${this.lon_}/${this.datetime_}.json?appid=${this.appid_}`;
    const requestUrl = encodeURI(BaseUrl[this.type_] + input);
    return requestUrl;
  }

  /**
   * Given a RequestType, specifies which endpoint of the OpenWeather Air
   * Pollution API this request corresponds to. If no parameters are passed,
   * returns the assigned RequestType.
   * @param {AirRequestType} [requestType] The type of this
   * AirRequest
   * @returns {AirRequest | AirRequestType} The AirRequestType
   * assigned to this request if no parameters are passed, otherwise this
   */
  type(requestType) {
    if (!arguments.length) return this.type_;
    this.type_ = requestType;
    return this;
  }

  /**
   * Given a geo coordinates sets the location of the request. If no
   * parameters are passed, reports the assigned coordinates.
   *
   * @param {number} [lat] The latitude of the location
   * @param {number} [lon] The longitude of the location
   * @returns {AirRequest | Object} An object containing the lat and lon
   * properties of the request if no parameters are passed, otherwise this
   */
  coords(lat, lon) {
    if (!arguments.length) return { lat: this.lat_, lon: this.lon_ };
    this.lat_ = lat;
    this.lon_ = lon;
    return this;
  }


  /**
   * Given a Date string, sets the time period for the AirRequest. If no
   * arguments are passed, reports the assigned Date. By default
   * AirRequests have their creation time as their default datetime. As stated
   * in on the OpenWeather docs, the time period for Air pollution data
   * depends on the format of the given time string. Refer to the example taken
   * from the OpenWeather docs.
   *
   * NOTE: The time string should be in the ISO8601 format and should be UTC.
   *  ex: "2016-03-03T12:00:00Z"
   * @example
   * const req = air.ozone();
   * req.datetime('2016-01-02T15:04:05Z'); // searches between 2016-01-02T15:04:05Z and 2016-01-02T15:04:05.9999Z
   * req.datetime('2016-01-02T15:04Z');    // searches between 2016-01-02T15:04:00Z and 2016-01-02T15:04:59.9999Z
   * req.datetime('2016-01-02T15Z');       // searches between 2016-01-02T15:00:00Z and 2016-01-02T15:59:59.9999Z
   * req.datetime('2016-01-02Z');          // searches between 2016-01-02T00:00:00Z and 2016-01-02T23:59:59.9999Z
   * req.datetime('2016-01Z');             // searches between 2016-01-01T00:00:00Z and 2016-12-31T23:59:59.9999Z
   * req.datetime('2016Z');                // searches between 2016-01-01T00:00:00Z and 2016-12-31T23:59:99.9999Z
   *
   * @param {string} [time] An ISO8601 time string
   * @returns {AirRequest | Date} The Date of this AirRequest if no parameters
   * are passed, otherwise this
   */
  datetime(time) {
    if (!arguments.length) return this.datetime_;
    this.datetime_ = time;
    return this;
  }

  /**
   * Executes the API request.
   * @param {function(err, res)} [callback] a callback function that is called
   * with a possible error and the API response
   * @returns {Promise} A promise representing the result of the request
   */
  exec(callback) {
    const url = this.url();
    callback = callback || (() => {});
    return got(url)
      .then(res => res.body)
      .then(res => callback(res))
      .catch(err => callback(null, err));
  }
}

//--------------------------------------------------------------------
// Factories and Other Methods
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
 * Returns a AirRequest for the OpenWeather Air Pollution ozone endpoint.
 * The AirRequest will have the 'O3' RequestType.
 * @returns {AirRequest} A generic request for the ozone air pollution API
 */
function ozone() {
  return new AirRequest().type(AirRequestType.O3);
}

/**
 * Returns a AirRequest for the OpenWeather Air Pollution carbon monoxide
 * endpoint. The AirRequest will have the 'CO' RequestType.
 * @returns {AirRequest} A generic request for the 'CO' air pollution API
 */
function carbonMonoxide() {
  return new AirRequest().type(AirRequestType.CO);
}

/**
 * Returns a new AirRequest for the OpenWeather Air Pollution
 * sulfur-dioxide endpoint. The AirRequest will have the 'SO2'
 * RequestType.
 * @returns {AirRequest} A generic request for the 'SO2' air pollution API
 */
function sulfurDioxide() {
  return new AirRequest().type(AirRequestType.SO2);
}

/**
 * Returns a new AirRequest for the OpenWeather Air Pollution
 * nitrogen-dioxide endpoint. The AirRequest will have the 'NO2'
 * RequestType.
 * @returns {AirRequest} A generic request for the 'NO2' air pollution API
 */
function nitrogenDioxide() {
  return new AirRequest().type(AirRequestType.NO2);
}


//--------------------------------------------------------------------
// Exports
//--------------------------------------------------------------------

module.exports = {
  ozone: ozone,
  sulfurDioxide: sulfurDioxide,
  carbonMonoxide: carbonMonoxide,
  nitrogenDioxide: nitrogenDioxide,
  defaultKey: defaultKey,

  AirRequest: AirRequest,
  AirRequestType:AirRequestType,
};
