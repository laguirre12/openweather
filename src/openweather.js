/**
 * A module for interacting with the OpenWeather API. Works as a Wrapper for
 * the following modules:
 * * openweather-uv
 * * openweather-air
 * * openweather-weather
 *
 * Due to name conflicts, some factory names are changed. Below is a list of
 * the exported functions and a:
 *
 * | function name  | corresponding function           |
 * | --------------- | ------------------------------- |
 * | uvCurrent       | openweather-uv.current          |
 * | uvHistory       | openweather-uv.history          |
 * | uvForecast      | openweather-uv.forecast         |
 * |                 |                                 |
 * | weatherCurrent  | openweather-weather.current     |
 * | weatherForecast | openweather-weather.forecast    |
 * |                 |                                 |
 * | ozone           | openweather-air.ozone           |
 * | sulfurDioxide   | openweather-air.sulfurDioxide   |
 * | carbonMonoxide  | openweather-air.carbonMonoxide  |
 * | nitrogenDioxide | openweather-air.nitrogenDioxide |
 *
 *
 * | Class or Type      |  Corresponding Class or Type           |
 * | ------------------ | -------------------------------------- |
 * | UVRequest          | openweather-uv.UVRequest               |
 * | AirRequest         | openweather-air.AirRequest             |
 * | WeatherRequest     | openweather-weather.WeatherRequest     |
 * |                    |                                        |
 * | UVRequestType      | openweather-uv.UVRequestType           |
 * | AirRequestType     | openweather-air.AirRequestType         |
 * | WeatherRequestType | openweather-weather.WeatherRequestType |

 * @author laguirre <aguirreluis1234@gmail.com>
 * @module openweather
 * @license MIT
 */
const uv = require('./openweather-uv');
const air = require('./openweather-air');
const weather = require('./openweather-weather');

let APPID; // global references to API_KEY


/**
 * Sets and retrieves the global (default) API key to use for all requests.
 * The provided key is used for all OpenWeatherRequest's.
 * @param {string} appid Default API key
 * @returns {string} The current default API KEY
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
/**
 * Exports
 *
 */
module.exports = {
  defaultKey: defaultKey,

  uvCurrent: uv.current,
  uvHistory: uv.history,
  uvForecast: uv.forecast,
  UVRequest: UVRequest,
  UVRequestType: UVRequestType,

  weatherCurrent: weather.current,
  weatherForecast: weather.forecast,
  WeatherRequest: weather.WeatherRequest,
  TemperatureUnit: weather.TemperatureUnit,
  WeatherRequestType: weather.WeatherRequestType,

  ozone: air.ozone,
  sulfurDioxide: air.sulfurDioxide,
  carbonMonoxide: air.carbonMonoxide,
  nitrogenDioxide: air.nitrogenDioxide,
  AirRequest: air.AirRequest,
  AirRequestType: air.AirRequestType,
};
