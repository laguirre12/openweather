/**
 * A module for interacting with the OpenWeather UV Index API (currently in
 * beta). Reference can be found at: {@link https://openweathermap.org/api/uvi}
 * @module openweather-uv
 * @author laguirre <aguirreluis1234@gmail.com>
 */

const got = require('got');
const url = require('url');
const InvalidRequestType = require('./openweather-base').InvalidRequestType;

let APPID; // global reference to API_KEY


//--------------------------------------------------------------------
// Enums
//--------------------------------------------------------------------

/**
 * Enum for the Openweather API's that are supported by this module
 * @constant
 * @readonly
 * @enum {symbol(string)}
 * @implements {RequestType}
 * @property {symbol(string)} CURRENT current UV index endpoint ({@link https://openweathermap.org/api/uvi#current})
 * @property {symbol(string)} HISTORY history UV index endpoint ({@link https://openweathermap.org/api/uvi#forecast})
 * @property {symbol(string)} FORECAST forecast UV index endpoint ({@link https://openweathermap.org/api/uvi#history})
 */
const UVRequestType = Object.freeze({
  CURRENT: Symbol('current'),
  HISTORY: Symbol('history'),
  FORECAST: Symbol('forecast'),

  /**
   * Returns a string representation of the given UVRequestType.
   * @param {UVRequestType} type the UVRequestType to get the name of
   * @returns {string} the string name of the request type
   */
  getName(type) {
    switch(type) {
      case UVRequestType.CURRENT: return 'current';
      case UVRequestType.HISTORY: return 'history';
      case UVRequestType.FORECAST: return 'forecast';
      default: throw InvalidRequestType('Unknown UVRequestType');
    }
  }
});

//--------------------------------------------------------------------
// Maps for RequestTypes to URL's
//--------------------------------------------------------------------

/**
 * @private
 */
const base = 'http://api.openweathermap.org/data/2.5/uvi';

/**
 * Map of url's for each endpoint covered in this module.
 * @private
 */
const BaseUrl = {};
BaseUrl[UVRequestType.CURRENT] = base + '';
BaseUrl[UVRequestType.HISTORY] = base + '/history';
BaseUrl[UVRequestType.FORECAST] = base + '/forecast';
Object.freeze(BaseUrl);

//--------------------------------------------------------------------
// Request classes
//--------------------------------------------------------------------

/**
 * Represents an OpenWeather API call to the UV index API. Each UVRequest
 * has type and an associated URL that will constructed for the request.
 * Parameters for the request can be set using chainable methods that act as
 * both getters and setters for the given property.
 * @implements {OpenWeatherRequest}
 * @example
 * // creates a new UVRequest with no properties set
 * const req = new UVRequest();
 * @example
 * // creates a new UVRequest for the current data endpoint
 * // the UVRequest has all properties used by the current data endpoin
 * const req = new UVRequest({
 *   appid: 'API-KEY',
 *   type: UVRequestType.CURRENT,  // either CURRENT, HISTORY, or FORECAST
 *   lat: 100.113,                 // Requests to the UV index API must use
 *   lon: 55.166,                  //  geo coordinates
 * });
 * @example
 * // creates a new UVRequest for the history data endpoint
 * // the UVRequest has all properties used in the history data endpoint
 * const req = new UVRequest({
 *   appid: 'API-KEY',
 *   type: UVRequestType.HISTORY,
 *   lat: 100.113,
 *   lon: 55.166,
 *   start: '',        // starting and ending point of timeperiod - Only used by
 *   end: ''           // the HISTORY data endpoint
 * });
 * @example
 * // creates a new UVRequest for the forecast data endpoint
 * // the UVRequest has all properties used in the request
 * const req = new UVRequest({
 *   appid: 'API-KEY',
 *   type: UVRequestType.FORECAST,
 *   lat: 100.113,
 *   lon: 55.166,
 *   limit: 3, // number of days in response - used only by FORECAST endpoint
 * });
 */
class UVRequest {
  /**
   * Constructs a UVRequest object, takes an optional configuration
   * object to specify default properties of the request. The properties used
   * in the config object can be seen in the examples
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

    this.cnt_ = config.cnt;

    this.start_ = config.start;
    this.end_ = config.end;
  }

  /**
   * Sets the API KEY for this UVRequest, if no parameters are passed returns
   * this requests API KEY. By default all PolutionRequests have the global
   * default APPID.
   * @param {string} [appid] The OpenWeather API key to use for this request.
   * @returns {UVRequest | string} The 'appid' string assigned to this
   * request if no parameters are passed otherwise this
   */
  appid(appid) {
    if (!arguments.length) return this.appid_;
    this.appid_ = appid;
    return this;
  }

  /**
   * Given a UVRequestType, sets the UVRequestType for the Request to specify
   * which OpenWeather UV index data endpoint this request is for.
   * @param {UVRequestType} [requestType] the type of this UVRequest
   * @returns {UVRequest | UVRequestType} The RequestType assigned to
   * this request if no parameters are passed, otherwise this
   */
  type(requestType) {
    if (!arguments.length) return this.type_;
    this.type_ = requestType;
    return this;
  }

  /**
   * Given a geo coordinates sets the location of the request. If no
   * parameters are passed, reports the assigned coordinates.
   * @param {number} [lat] The latitude of the location
   * @param {number} [lon] The longitude of the location
   * @returns {UVRequest | Object} An object containing the lat and lon
   * properties of the request if no parameters are passed, otherwise this
   */
  coords(lat, lon) {
    if (!arguments.length) return { lat: this.lat_, lon: this.lon_ };
    this.lat_ = lat;
    this.lon_ = lon;
    return this;
  }

  /**
   * Sets the number of days ahead that data should be retrieved for. This
   * parameter is only used for the Forecast endpoint, and data is available
   * upto 8 days ahead. For more reference check {@link https://openweathermap.org/api/uvi#forecast}.
   * @param {number} count the number days to return data for
   * @returns {UVRequest | number} the number of days to return data for if
   * no parameters are passed, otherwise this
   */
  limit(count) {
    if (!arguments.length) return this.count_;
    this.count_ = count;
    return this;
  }

  /**
   * Sets the start and end times for the UV index data to be retrieved.
   * This parameters are only used for the Historical data endpoint, and the
   * times should be in UNIX time. As stated at {@link https://openweathermap.org/api/uvi#history},
   * the data is available starting from the 2017-06-22.
   * @param {string} [start] start point of the time period as a UNIX time string
   * @param {string} [end] end point of the time period as a UNIX time string
   * @returns {UVRequest | Object} an Object containing the specified start and
   * end times if no parameters are passed, otherwise this
  */
  timePeriod(start, end) {
    if (!arguments.length) return { start: this.start_, end: this.end_ };
    this.start_ = start;
    this.end_ = end;
    return this;
  }

  /**
   * Constructs the url for the corresponding API request using all
   * provided parameters.
   * @returns {string} the url that corresponds to this request.
   */
  url() {
    const requestUrl = new url.URL(BaseUrl[this.type_]);
    const params = requestUrl.searchParams;
    params.append('APPID', this.appid_);
    params.append('lat', this.lat_);
    params.append('lon', this.lon_);

    // only used for the 'forecast' endpoint
    if (this.type_ === UVRequestType.FORECAST) {
      params.append('cnt', this.cnt_);
    }

    // only used for the 'historical' endpoint'
    if (this.type_ === UVRequestType.HISTORY) {
      params.append('start', this.start_);
      params.append('end', this.end_);
    }

    return requestUrl.href;
  }

  /**
   * Executes the API request.
   * @param {function(err, res)} [callback] a callback function that is called
   * with a possible error and the API response.
   * @returns {Promise} A promise representing the result of the request.
   */
  exec(callback) {
    const url = this.url();
    callback = callback || (() => {});
    return got(url)
      .then(res => res.body)
      .then(res => callback(null, res))
      .catch(err => callback(err));
  }
}

//--------------------------------------------------------------------
// factory methods
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
 * Returns a new UVRequest for the Openweather UV Index API that has a
 * UVRequestType of 'current'.
 * @returns {UVRequest} A new UVRequest of type CURRENT
 */
function current() {
  return new UVRequest().type(UVRequestType.CURRENT);
}

/**
 * Returns a new UVRequest for the Openweather UV Index API that has a
 * UVRequestTYpe of 'history'.
 * @returns {UVRequest} A new UVRequest
 */
function history() {
  return new UVRequest().type(UVRequestType.HISTORY);
}

/**
 * Returns a new UVRequest for the Openweather UV Index API that has a
 * UVRequestType of 'forecast'.
 * @returns {UVRequest} A new UVRequest
 */
function forecast() {
  return new UVRequest().type(UVRequestType.FORECAST);
}

//--------------------------------------------------------------------
// Exports
//--------------------------------------------------------------------

module.exports = {
  current: current,
  history: history,
  forecast: forecast,
  defaultKey: defaultKey,

  UVRequest: UVRequest,
  UVRequestType: UVRequestType
};
