# OpenWeather

## Contents

## NPM Scripts

### Weather Modules
Each module consists of a Request Class, Enums for specific API endpoints (and possible units), and factory methods for creating new Requests. In order to send requests each Request must be given an API Ke, which can be set globally for the module. Each Request Class consists of chainable setters/getters that set specific properties for the request and an `exec()` method that executes the request. The `exec()` functions support both Promises and callbacks. Example:
~~~~
const weather = require('openweather-weather');
weather.defaultKey('Your-API-KEY'>);

// a request to the free Weather Forecast with the default API key
const req = weather.forecast().city('Austin');

console.log(req.city());  // returns 'Austin'
console.log(req.url());   // the string URL corresponding to the API request

// sends the request
req.exec()
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
~~~~

* `openweather.js`: A wrapper module that wraps all other openweather modules into one single module.
* `openweather-air.js`: A module for solely interacting with the OpenWeather Air pollution API.
* `openweather-weather.js`: A module for solely interacting with the Current Weather and Forecast OpenWeather APIs. Currently only supports the free tier versions of the APIs.

# TODOs
2. add caching of results
3. dependency injection for HTTP request
4. add support for the following api's
   *  - 16 day & daily forecast (paid)
