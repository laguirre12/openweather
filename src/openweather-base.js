/**
 * A module containing various interfaces and and a custom error used
 * throughout the openweather modules. The interfaces described in this
 * module are only descrbied by JSDoc virtual comments.
 * @module openweather-base
 * @author laguirre <aguirreluis1234@gmail.com>
 */

//------------------------------------------------------------------------
// Request Interface - only described by virtual comments
//------------------------------------------------------------------------

/**
 * A general interface for an OpenWeather API Request. Each Request should have
 * the following methods:
 * * constructor(config) - construct a request with configuration object
 * * url() - generate the url associated with the url
 * * exec(callback) - execute the API request
 * * appid(appid) - set the API-KEY for the request
 * @interface OpenWeatherRequest
 */

/**
 * Constructs an OpenWeatherRequest and takes an optional config. object that
 * can set all properties of the request.
 * @function
 * @name OpenWeatherRequest#constructor
 * @param {Object} [config] a configuration object
 */

/**
 * Given an key value sets the API KEY for this specific request,
 * otherwise returns the 'appid' for this request.
 * @function
 * @name OpenWeatherRequest#appid
 * @param {string} [appid] The OpenWeather API key to use for this request
 * @returns {OpenWeatherRequest | string} The 'appid' string assigned to this
 * request if no parameters are passed, otherwise this
 */

/**
 * Constructs the url for the corresponding OpenWeather request using all
 * provided parameters.
 * @function
 * @name OpenWeatherRequest#url
 * @returns {string} The url that corresponds to the API request
 */

/**
 * Executes the API request.
 * @function
 * @name OpenWeatherRequest#exec
 * @param {function(err, data)} [callback] a callback function
 * @returns {Promise} a promise representing the result of this request
 */

//------------------------------------------------------------------------
// RequestType Interface - only described via virtual comments
//------------------------------------------------------------------------

/**
 * An Interface used to specify which OpenWeather API (endpoint) an
 * OpenWeatherRequest is referring to. Each RequestType should contain a set
 * of properties representing individual types and the methods:
 * * getName(type) - retrieve the string represention of the type
 * @interface RequestType
 */

/**
 * Returns a string representation of the given RequestType.
 * @function
 * @name RequestType#getName
 * @returns {string} the string representation of the RequestType
 * @throws {InvalidRequestType} if the given value is not a recognized
 * RequestType
 */

//------------------------------------------------------------------------
// Custom Errors
//------------------------------------------------------------------------

/**
 * A custom error class used for when an unexpected RequestType is used. The
 * constructor modifies the stack trace to remove the call to this error's
 * constructor.
 */
class InvalidRequestType extends TypeError {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, InvalidRequestType);
  }
}

module.exports = {
  InvalidRequestType: InvalidRequestType,
};
