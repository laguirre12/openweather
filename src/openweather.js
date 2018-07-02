/**
 * A module that exports all the individual openweather modules as one.
 * @module openweather
 * @author laguirre <aguirreluis1234@gmail.com>
 */
const uv = require('./openweather-uv');
const air = require('./openweather-air');
const weather = require('./openweather-weather');

module.exports = {
  uv: uv,
  air: air,
  weather: weather
};
