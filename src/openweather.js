/**
 * A module that exports all the contents of the other openweather modules as
 * separate objects. The module exports three objects
 * @module openweather
 * @author laguirre <aguirreluis1234@gmail.com>
 */
const uv = require('./openweather-uv');
const air = require('./openweather-air');
const weather = require('./openweather-weather');
const InvalidRequestType = require('./openweather-base').InvalidRequestType;


//--------------------------------------------------------------------
// Exports
//--------------------------------------------------------------------

module.exports = {
  uv: uv,
  air: air,
  weather: weather,
  InvalidRequestType: InvalidRequestType
};
