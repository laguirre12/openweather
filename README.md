# OpenWeather

## NPM Scripts
* `doc`: creates the documentation pages found
* `lint`: runs ESLint on the source code
* `clean`: removes the node\_modules and docs directory
* `test`: runs the test suite

## Contents
This is a set of modules meant to interact with various OpenWeather APIs. Each module consists of a Request Class, Enums for specific API endpoints (and possible units), and factory methods for creating new Requests. Each Request Class has a fluent interface with chainable setters/getters that set specific properties for the request and an `exec()` method that executes the request. The `exec()` functions support both Promises and callbacks. In order to send requests each Request must be given an API-KEY (`appid`) , which can be set globally for the module.

Overview of each module:

* `openweather.js`: A module that wraps the other openweather modules together. This module exports all functions and classes from the other openweather modules.

        const openweather = require('openweather');
        openweather.defaultKey('<API-KEY>');

* `openweather-base.js`: A module containing a general interface for any OpenWeather API requests and request types, and a custom Error type that are used in the following modules. (NOTE: the interfaces are only described via JSDoc virtual comments)

* `openweather-uv.js`: A module for solely interacting with the OpenWeather UV Index data API.

        const uv = require('openweather-uv');
        uv.defaultKey('<API-KEY>');

        const req = uv.current()
                      .coords(101.133, 55.166);

        console.log(req.coords());  // returns { lat: 101.133, lon: 55.166 }
        console.log(req.url());     // string URL associated with the API request

        // execute the request using Promises
        req.exec()
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });

        // or use a callback
        req.exec(function () {
          if (err) {
            console.log(err);
            return;
          }
          console.log(data);
        });

UVRequest methods:

|   method   |   params    |  description  |
| ---------  |   ------    | ------------- |
| appid      | appid       | sets/gets the API-KEY of the request |
| type       | requestType | sets/gets the UVRequestType to specify the API endpoint |
| coords     | lat, lon    | sets/gets the geo. coords of the request |
| limit      | count       | sets/gets the number of days returned in the response * used only for forecast data  endpoint |
| timePeriod | start, end  | sets/gets the timeperiod * used only for historical data endpoint |
| exec       | callback    | executes the API request |
| url        | ----------- | generates the URL associated with this request |

* `openweather-air.js`: A module for solely interacting with the OpenWeather Air pollution API.

      const air = require('openweather-air');
      air.defaultKey('<API-KEY>');

      // a request to the Air pollution data API for the ozone endpoint
      const req = air.ozone()
                     .appid('<Another API-KEY>') // override default key
                     .coords(101.133, 55.166)
                     .datetime(new Date());

      console.log(req.coords()); // returns { lat: 101.133, lon: 55.166}
      console.log(req.url());    // string URL associated with the API request

      // sends the request
      req.exec()
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });

AirRequest methods:

|  method  |    params   | description  |
| -------- | ----------- |------------- |
| appid    | appid       | sets/gets the API-KEY of the request |
| coords   | lat, lon    | sets/gets the geo. coordinates of the request |
| type     | requestType | sets/gets the AirRequestType to specify the API endpoint |
| datetime | datetime    | sets/gets the assigned time for the request |
| exec     | callback    | executes the API request |
| url      | ----------- | generates the URL associated with this request |


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

|  method  |     params    | description  |
| -------- | ------------- |------------- |
| appid    | appid         | sets/gets the API-KEY of the request |
| city     | city, country | sets/gets the city (and/or country code) of the request |
| coords   | lat, lon      | sets/gets the geo. coordinates of the request |
| id       | id            | sets/gets the location of the request by specifying a city id |
| zip      | zip, country  | sets/gets the zip code (and/or country code) of the request |
| language | code          | sets/gets the language of the weather description |
| limit    | count         | sets/gets the limit on the number of cities in the API response |
| type     | requestType   | sets/gets the RequestType to specify the Weather API endpoint |
| units    | type          | sets/gets the units for temperature for the response |
| exec     | callback      | executes the API request |
| url      | --------      | generates the URL associated with this request  |


For a more complete overview of each of these modules, you can consult the JSDoc.

# TODOs
1. create an executable for a CLI that imports the openweather modules
4. add support for the following api's
   *  weatherMap layers
   *  historial data
5. create methods for units // .toStandad(), .toImperial(), .toMetric()
6. add support for `format` (HTML, XML, JSON), default json
7. Remove `openweather` wrapper module
