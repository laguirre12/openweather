# OpenWeather

## Contents
This is a set of modules meant to interact with various OpenWeather APIs.

## NPM Scripts
* `doc`: creates the documentation pages found
* `lint`: runs ESLint on the source code
* `clean`: removes the node\_modules and docs directory
* `test`: runs the test suite

### Weather Modules
Each module consists of a Request Class, Enums for specific API endpoints (and possible units), and factory methods for creating new Requests. In order to send requests each Request must be given an API-KEY, which can be set globally for the module. Each Request Class consists of chainable setters/getters that set specific properties for the request and an `exec()` method that executes the request. The `exec()` functions support both Promises and callbacks. Example:


* `openweather.js`: A module that wraps the other openweather modules together. This module exports all functions and classes from the other openweather modules.
        const openweather = require('openweather');
        openweather.defaultKey('<API-KEY>');

* `openweather-uv.js`: A module for solely interacting with the OpenWeather UV Index data API.
        const uv = require('openweather-uv');
        uv.defaultKey('<API-KEY>');

        const req = uv.current()
                      .coords(101.133, 55.166);

        console.log(req.coords());  // returns { lat: 101.133, lon: 55.166}
        console.log(req.url());     // the string URL corresponding to the API request

        // execute the request using Promises
        req.exec()
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });

        // or use a callback
        function print(err, data) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(data);
        }

        req.exec(print);



UVRequest methods:

|   method   |  description  |
| ---------  | ------------- |
| appid      | sets/gets the API-KEY of the request |
| coords     | sets/gets the geo. coords of the request |
| limit      | |
| timePeriod | |
| exec       | executes the API request |
| url        | generates the URL associated with this request |

* `openweather-air.js`: A module for solely interacting with the OpenWeather Air pollution API.
      const air = require('openweather-air');
      air.defaultKey('<API-KEY>');

      // a request to the Air pollution data API for the ozone endpoint
      const req = air.ozone()
                     .appid('<Another API-KEY>') // override default key
                     .coords(101.133, 55.166)
                     .datetime(new Date());

      console.coords();  // returns { lat: 101.133, lon: 55.166}
      console.log(req.url());   // the string URL corresponding to the API request

      // sends the request
      req.exec()
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });

AirRequest methods:

|  method  |  description  |
| -------- | ------------- |
| appid    | sets/gets the API-KEY of the request |
| coords   | sets/gets the geo. coordinates of the request |
| type     | sets/gets the AirRequestType to specify the API endpoint |
| datetime | sets/gets the assigned time for the request |
| exec     | executes the API request |
| url      | generates the URL associated with this request |


* `openweather-weather.js`: A module for solely interacting with the Current Weather and Forecast OpenWeather APIs. Currently only supports the free tier versions of the APIs.
      const weather = require('openweather-weather');
      weather.defaultKey('<API-KEY>');

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

WeatherRequest methods:

|  method  |  description  |
| -------- | ------------- |
| appid    | sets/gets the API-KEY of the request |
| city     | sets/gets the city (and/or country code) of the request |
| coords   | sets/gets the geo. coordinates of the request |
| id       | sets/gets the location of the request by specifying a city id |
| zip      | sets/gets the zip code (and/or country code) of the request |
| language | sets/gets the language of the weather description |
| limit    | sets/gets the limit on the number of cities in the API response |
| type     | sets/gets the RequestType to specify the Weather API endpoint |
| units    | sets/gets the units for temperature for the response |
| exec     | executes the API request |
| url      | generates the URL associated with this request  |


# TODOs
0. general Request (interface) module that each Request class will extend
1. create an executable for a CLI that imports the openweather modules
2. add caching of results
   * general caching module that each can use
4. add support for the following api's
   *  - 16 day & daily forecast (paid)
5. General RequestType error
