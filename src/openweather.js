/**
 * A module for interacting with the OpenWeather API. Works as a Wrapper for
 * the other openweather modules.
 * @module openweather
 * @author laguirre <aguirreluis1234@gmail.com>
 */
const uv = require('./openweather-uv');
const air = require('./openweather-air');
const weather = require('./openweather-weather');

let APPID; // global references to API_KEY


/**
 * Sets and retrieves the global (default) API key to use for all requests.
 * @param {string} appid Default API key
 * @return {string} The current default API KEY
 */
function defaultKey(appid) {
  if (arguments.length) {
    APPID = appid;
    uv.defaultKey(APPID);
    air.defaultKey(APPID);
    weather.defaultKey(APPID);
  }
  return APPID;
}


// export object
module.exports = {
  defaultKey: defaultKey,

  // TODO(la): openweather-uv exports

  current: weather.current,
  forecast: weather.forecast,
  WeatherRequest: weather.WeatherRequest,
  TemperatureUnit: weather.TemperatureUnit,
  WeatherRequestType: weather.WeatherRequestType,

  ozone: air.ozone,
  sulfurDioxide: air.sulfurDioxide,
  carbonMonoxide: air.carbonMonoxide,
  nitrogenDioxide: air.nitrogenDioxide,
  PollutionRequest: air.PollutionRequest,
  PollutionRequestType: air.PollutionRequestType,
};
