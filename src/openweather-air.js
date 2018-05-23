/**
 * A module for interacting with the OpenWeather air pollution API (in beta).
 * Provides an interface for sending requests to the following endpoints: <br>
 * {@link https://openweathermap.org/api/pollution/co}<br>
 * {@link https://openweathermap.org/api/pollution/o3}<br>
 * {@link https://openweathermap.org/api/pollution/no2}<br>
 * {@link https://openweathermap.org/api/pollution/so2}.
 * @module openweather-air
 * @author laguirre <aguirreluis1234@gmail.com>
 */

const got = require('got');

let APPID; // global references to API_KEY


//--------------------------------------------------------------------
// Enums
//--------------------------------------------------------------------

/**
 * Enum for Openweather Air pollution API that are supported by this module.
 * @constant
 * @readonly
 * @enum {symbol(string)}
 */
const PollutionRequestType = Object.freeze({
  O3: Symbol('o3'),
  CO: Symbol('co'),
  SO2: Symbol('so2'),
  NO2: Symbol('no2'),

  /**
   * Returns a string representation of the given PollutionRequestType.
   * @param {PollutionRequestType} type the RequestType to get the name of
   * @return {string} string value of the given PollutionRequestType
   */
  getName: function (type) {
    switch (type) {
      case PollutionRequestType.O3: return 'ozone';
      case PollutionRequestType.CO: return 'carbon-monoxide';
      case PollutionRequestType.SO2: return 'sulfur-dioxide';
      case PollutionRequestType.NO2: return 'nitrogen-dioxide';
      default: throw 'unkown pollution type';
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
BaseUrl[PollutionRequestType.CO] = base + 'co';
BaseUrl[PollutionRequestType.O3] = base + 'o3';
BaseUrl[PollutionRequestType.CO2] = base + 'so2';
BaseUrl[PollutionRequestType.NO2] = base + 'no2';
Object.freeze(BaseUrl);

//--------------------------------------------------------------------
// Request classes
//--------------------------------------------------------------------

/**
 * Represents an OpenWeather air pollution API call. Each PollutionRequest has
 * a type and an associated URL that is constructed for the request. Parameters
 * for the request can be set using chainable methods that act as both getters
 * and setters for the given property.
 */
class PollutionRequest {
  /**
   * Constructs a PollutionRequest object, takes an optional configuration
   * object to specify default properties of the request. PollutionRequest have
   * are given a default API Key (set globally) and a default request Time of
   * their creation time, unless otherwise specified.
   * @param {object} [config] A configuration object for the request.
   */
  constructor(config) {
    if (config === null || typeof config!== 'object') {
      config = {};
    }
    this.appid_ = config.appid || APPID;
    this.type_ = config.type;
    this.lat_ = config.lat;
    this.lon_ = config.lon;
    this.datetime_ = config.datetime || (new Date());
  }

  /**
   * Sets the API KEY for this PollutionRequest, if no parameters are passed
   * returns this requests API KEY. By default all PolutionRequests have the
   * global default APPID.
   * @param {string} [appid] The OpenWeather API key to use for this request.
   * @return {PollutionRequest | string} The 'appid' string assigned to this
   * request if no parameters are passed. Otherwise 'this'.
   */
  key(appid) {
    if (!arguments.length) return this.appid_;
    this.appid_ = appid;
    return this;
  }

  /**
   * Constructs the url for the corresponding OpenWeather request using all
   * provided parameters.
   * @return {string} The url that corresponds to the API request
   */
  url() {
    const timeStr = this.datetime_.toISOString();
    const input = `/${this.lat_},${this.lon_}/${timeStr}.json?appid=${this.appid_}`;
    const requestUrl = encodeURI(BaseUrl[this.type_] + input);
    return requestUrl;
  }

  /**
   * Given a RequestType, specifies which endpoint of the OpenWeather Air
   * Pollution API this request corresponds to. If no parameters are passed,
   * returns the assigned RequestType.
   * @param {PollutionRequestType} [requestType] The type of this
   * PollutionRequest
   * @return {PollutionRequest | PollutionRequestType} The PollutionRequestType
   * assigned to this request if no parameters are passed, otherwise this.
   */
  type(requestType) {
    if (!arguments.length) return this.type_;
    this.type_ = requestType;
    return this;
  }

  /**
   * Given a geo coordinates sets the location of the request. If no
   * parameters are passed, reports the assigned coordinates.
   * @param {number} [lat] The latitude of the location.
   * @param {number} [lon] The longitude of the location.
   * @return {PollutionRequest | object} An object containing the lat and lon
   * properties of the request if no parameters are passed, otherwise this.
   */
  coords(lat, lon) {
    if (!arguments.length) return { lat: this.lat_, lon: this.lon_ };
    this.lat_ = lat;
    this.lon_ = lon;
    return this;
  }

  /**
   * Given a Date object, sets the time for the PollutionRequest. If no
   * arguments are passe, reports the assigned Date of this request. By default
   * PollutionRequests have their create time as their default Datetime.
   * @param {Date} [time] The time of the PollutionRequest.
   * @return {PollutionRequest | Date} The Date of this PollutionRequest if no
   * parameters are passed, otherwise this.
   */
  datetime(time) {
    if (!arguments.length) return this.time_;
    this.datetime_ = time;
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
 * Add the response to the HTTP request to the cache.
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
 * Returns a PollutionRequest for the OpenWeather Air Pollution ozone endpoint.
 * The PollutionRequest will have the 'O3' RequestType.
 * @return {PollutionRequest} A generic request for the ozone air pollution API
 */
function ozone() {
  return new PollutionRequest().type(PollutionRequestType.O3);
}

/**
 * Returns a PollutionRequest for the OpenWeather Air Pollution carbon monoxide
 * endpoint. The PollutionRequest will have the 'CO' RequestType.
 * @return {PollutionRequest} A generic request for the 'CO' air pollution API
 */
function carbonMonoxide() {
  return new PollutionRequest().type(PollutionRequestType.CO);
}

/**
 * Returns a new PollutionRequest for the OpenWeather Air Pollution
 * sulfur-dioxide endpoint. The PollutionRequest will have the 'SO2'
 * RequestType.
 * @return {PollutionRequest} A generic request for the 'SO2' air pollution API
 */
function sulfurDioxide() {
  return new PollutionRequest().type(PollutionRequestType.SO2);
}

/**
 * Returns a new PollutionRequest for the OpenWeather Air Pollution
 * nitrogen-dioxide endpoint. The PollutionRequest will have the 'NO2'
 * RequestType.
 * @return {PollutionRequest} A generic request for the 'NO2' air pollution API
 */
function nitrogenDioxide() {
  return new PollutionRequest().type(PollutionRequestType.NO2);
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

  PollutionRequest: PollutionRequest,
  PollutionRequestType:PollutionRequestType,
};
