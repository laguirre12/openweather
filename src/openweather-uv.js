/**
 * A module for interacting with the OpenWeather UV Index API (currently in
 * beta). Reference can be found at {@link https://openweathermap.org/api/uvi}.
 * @module openweather-uv
 * @author laguirre <aguirreluis1234@gmail.com>
 */

const got = require('got');
const url = require('url');

let APPID; // global reference to API_KEY


//--------------------------------------------------------------------
// Enums
//--------------------------------------------------------------------

/**
 * Enum for the Openweather API's that are supported by this module
 * @constant
 * @readonly
 * @enum {symbol(string)}
 */
const UVRequestType = Object.freeze({
  CURRENT: Symbol('current'),
  HISTORY: Symbol('history'),
  FORECAST: Symbol('forecast'),

  /**
   * Returns a string representation of the given UVRequestType.
   * @param {UVRequestType} type the request type to get the name of
   * @return {string} the string name of the request type
   */
  getName(type) {
    switch(type) {
      case UVRequestType.CURRENT: return 'current';
      case UVRequestType.HISTORY: return 'history';
      case UVRequestType.FORECAST: return 'forecast';
      default: throw 'unknown request type';
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

class UVRequest {
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
   * @return {UVRequest | string} The 'appid' string assigned to this
   * request if no parameters are passed. Otherwise this.
   */
  key(appid) {
    if (!arguments.length) return this.appid_;
    this.appid_ = appid;
    return this;
  }

  /**
   * Given a geo coordinates sets the location of the request. If no
   * parameters are passed, reports the assigned coordinates.
   * @param {number} [lat] The latitude of the location.
   * @param {number} [lon] The longitude of the location.
   * @return {UVRequest | object} An object containing the lat and lon
   * properties of the request if no parameters are passed, otherwise this.
   */
  coords(lat, lon) {
    if (!arguments.length) return { lat: this.lat_, lon: this.lon_ };
    this.lat_ = lat;
    this.lon_ = lon;
    return this;
  }


  // TODO(la): should these throw errors? it's fine if you set them, but they
  // wont be used when creating the url...

  /**
   * Sets the number of days ahead that data should be retrieved for. This
   * parameter is only used for the Forecast endpoint, and data is available
   * upto 8 days ahead. For more reference check {@link https://openweathermap.org/api/uvi#forecast}.
   * @param {number} count the number days to return data for
   * @return {UVRequest | number} the number of
   */
  limit(count) {
    if (this.type !== UVRequestType.HISTORY) {
      throw 'The number of returned days is only available for the forecast endpoint';
    }
    if (!arguments.length) return this.count_;
    this.count_ = count;
    return this;
  }

  /**
   * Sets the start and end times for the UV index data to be retrieved.
   * This parameters are only used for the Historical data endpoint, and the
   * times should be in UNIX time. As stated at {@link https://openweathermap.org/api/uvi#history},
   * the data is available starting from the 2017-06-22.
   * @param {string} [start] the starting point of the time period in UNIX time
   * @param {string} [end] the ending point of the time period in UNIX time
   * @return {UVRequest | object}
   */
  timePeriod(start, end) {
    if (this.type_ !== UVRequestType.HISTORY) {
      throw 'Time periods are only available for the History data endpoint!';
    }
    if (!arguments.length) return { start: this.start_, end: this.end_ };
    this.start_ = start;
    this.end_ = end;
    return this;
  }

  /**
   * Constructs the url for the corresponding API request using all
   * provided parameters.
   * @return {string} the url that corresponds to this request.
   */
  url() {
    const requestUrl = new url.URL(BaseUrl[this.type_]);
    const params = requestUrl.searchParams;
    params.append('APPID', this.appid_);
    params.append('lat', this.lat_);
    params.append('lon', this.lon_);

    // only used for the 'forecast' endpoint
    if (this.type_ !== UVRequestType.FORECAST) {
      params.append('cnt', this.cnt_);
    }

    // only used for the 'historical' endpoint'
    if (this.type_ !== UVRequestType.HISTORY) {
      params.append('start', this.start_);
      params.append('end', this.end_);
    }

    return requestUrl.href;
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
// factory methods
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
 * Returns a new UVRequest for the Openweather UV Index API that has a
 * UVRequestType of 'current'.
 * @return {UVRequest} A new UVRequest
 */
function current() {
  return new UVRequest.type(UVRequestType.CURRENT);
}

/**
 * Returns a new UVRequest for the Openweather UV Index API that has a
 * UVRequestTYpe of 'history'.
 * @return {UVRequest} A new UVRequest
 */
function history() {
  return new UVRequest.type(UVRequestType.HISTORY);
}

/**
 * Returns a new UVRequest for the Openweather UV Index API that has a
 * UVRequestType of 'forecast'.
 * @return {UVRequest} A new UVRequest
 */
function forecast() {
  return new UVRequest.type(UVRequestType.FORECAST);
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
