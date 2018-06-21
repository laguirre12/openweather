# OpenWeather

[Install](#install)

[NPM Scripts](#npm-scripts)

[Overview](#overview)

[OpenWeather-UV](#openweather\-uv)
  * [UVRequest methods](#uvrequest-methods:)
  * [UVRequestType's](#uvrequesttype's:)
  * [Other Openweather-uv Functions](#other-openweather\-uv-functions:)

[OpenWeather-Air](#openweather\-air)
  * [AirRequest methods](#airrequest-methods:)
  * [AirRequestType's](#airrequesttype's:)
  * [Other Openweather-air Functions](#other-openweather\-air-functions:)

[OpenWeather-Weather](#openweather\-weather)
  * [WeatherRequest methods](#weatherrequest-methods:)
  * [WeatherRequestType's](#weatherrequesttype's:)
  * [Other Openweather-weather Functions](#other-openweather\-weather-functions:)

## Install

## NPM Scripts
* `doc`: creates the documentation pages found
* `lint`: runs ESLint on the source code
* `clean`: removes the node\_modules and docs directory
* `test`: runs the test suite

## Overview
This is a set of modules meant to interact with various OpenWeather APIs. Each module is meant to cover related Openweather API endpoints and consists of a Request Class, Enums for specific API endpoints (and possible units), and factory methods for creating new Requests. Each Request Class has a fluent interface with chainable setters/getters that set specific properties for the request and an `exec()` method that executes the request. The `exec()` functions support both Promises and callbacks. In order to send requests each Request must be given an API-KEY (`appid`) , which can be set globally for the module.

As of now, these modules only allow for the response format to be in JSON.

Overview of each module:

* `openweather-base.js`: A module containing a general interface for any OpenWeather API requests and request types, and a custom Error types that are used in the following modules. (NOTE: the interfaces are only described via JSDoc virtual comments)

* `openweather-uv.js`: A module for solely interacting with the [OpenWeather UV Index data API](https://openweathermap.org/api/uvi). The module consists of a `UVRequest` class, `UVRequestType`'s to specify which endpoint is called, and factory functions to create new `UVRequest`'s. For example:

* `openweather-air.js`: A module for solely interacting with the [OpenWeather Air pollution API](https://openweathermap.org/api/pollution/co). The module consists of an `AirRequest` class, `AirRequestType`'s to specify which endpoint is called, and factory functions to create new `AirRequest`'s.

* `openweather-weather.js`: A module for solely interacting with the Current Weather and Forecast OpenWeather APIs. The module consists of a `WeatherRequest` class, `WeatherRequestType`'s to specify which endpoint is called, and factory functions to create new `WeatherRequest`'s.

## OpenWeather-uv
    const uv = require('openweather-uv');
    uv.defaultKey('<API-KEY>');

    const req = uv.current()
                  .coords(101.133, 55.166);

    console.log(req.appid());   // prints `<API-KEY>`
    console.log(req.coords());  // prints `{ lat: 101.133, lon: 55.166 }`
    console.log(req.url());     // string URL associated with the API request

    // execute the request using a Promise
    req.exec()
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });

    // or with a callback
    req.exec(function (err, data) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
    });

### UVRequest methods:

|   method   |   params    |  description  |
| ---------  |   ------    | ------------- |
| appid      | appid       | sets/gets the API-KEY of the request |
| type       | requestType | sets/gets the UVRequestType to specify the API endpoint |
| coords     | lat, lon    | sets/gets the geo. coords of the request |
| limit      | count       | sets/gets the number of days returned in the response (used only for forecast data  endpoint) |
| timePeriod | start, end  | sets/gets the timeperiod (used only for historical data endpoint) |
| exec       | callback    | executes the API request |
| url        | ----------- | generates the URL associated with this request |

### UVRequestType's:

| UVRequestType | description |
| -------- | ----------- |
| CURRENT  | used to specify a UVRequest is for the current data endpoint |
| HISTORY  | used to specify a UVRequest is for the history data endpoint |
| FORECAST | used to specify a UVRequest is for the forecast data endpoint |

### Other Openweather-uv functions:

| function | params | description |
| -------- | ------ | ----------- |
| current  | ------ | creates a new UVRequest for the current data endpoint  |
| history  | ------ | creates a new UVRequest for the history data endpoint  |
| forecast | ------ | creates a new UVRequest for the forecast data endpoint |
| defaultKey | appid | sets a default API-KEY for all UVRequest's |




## Openweather-air
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

### AirRequest methods:

|  method  |    params   | description  |
| -------- | ----------- |------------- |
| appid    | appid       | sets/gets the API-KEY of the request |
| coords   | lat, lon    | sets/gets the geo. coordinates of the request |
| type     | requestType | sets/gets the AirRequestType to specify the API endpoint |
| datetime | datetime    | sets/gets the assigned time for the request |
| exec     | callback    | executes the API request |
| url      | ----------- | generates the URL associated with this request |

### AirRequestType's:

| AirRequestType | description |
| -------- | ----------- |
| 03  | used to specify a AirRequest is for the ozone data endpoint |
| CO2 | used to specify a AirRequest is for the carbon-dioxide data endpoint |
| SO2 | used to specify a AirRequest is for the sulfur-dioxide data endpoint |
| NO2 | used to specify a AirRequest is for the nitroge-dioxide data endpoint |

### Other Openweather-air functions:

| function        | params | description |
| --------------- | ------ | ----------- |
| ozone           | ------ | creates an AirRequest for the ozone endpoint |
| carbonMonoxide  | ------ | creates an AirRequest for the carbon-monoxide endpoint |
| sulfurDioxide   | ------ | creates an AirRequest for the sulfur-dioxide endpoint |
| nitrogenDioxide | ------ | creates an AirRequest for the nitrogen-dioxide endpoint |
| defaultKey      | appid  |sets a default API-KEY for all AirRequest's |




## Openweather-weather
    const weather = require('openweather-weather');
    weather.defaultKey('<API-KEY>');

    // a request to the free Weather Forecast with the default API key
    const req = weather.forecast()
                       .city('Austin')
                       .units(weather.TemperatureUnit.METRIC); // for celsius

    console.log(req.units());  // returns weather.TemperatureUnit.METRIC
    console.log(req.city());   // returns 'Austin'
    console.log(req.url());    // the string URL corresponding to the API request

    // sends the request
    req.exec()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });

### WeatherRequest methods:

|  method  |     params    | description  |
| -------- | ------------- |------------- |
| appid    | appid         | sets/gets the API-KEY of the request |
| city     | city, country | sets/gets the city (and/or country code) of the request |
| coords   | lat, lon      | sets/gets the geo. coordinates of the request |
| id       | id            | sets/gets the location of the request by specifying a city id |
| zip      | zip, country  | sets/gets the zip code (and/or country code) of the request |
| language | code          | sets/gets the language of the weather description |
| limit    | count         | sets/gets on the amount of data in the  API response |
| type     | requestType   | sets/gets the RequestType to specify the Weather API endpoint |
| units    | type          | sets/gets the units for temperature for the response |
| exec     | callback      | executes the API request |
| url      | --------      | generates the URL associated with this request  |

### WeatherRequestType's:

| WeatherRequestType | description |
| ------------------ | ----------- |
| CURRENT       | used to specify a WeatherRequest is for current weather data |
| FORECAST\_5   | used to specify a WeatherRequest is for a 3-hour interval 5 day forecast |
| FORECAST\_16  | used to specify a WeatherRequest is for a 16 day forecast |

### Other Openweather-weather functions:

| function   | params | description |
| -----------| ------ | ----------- |
| current    | ------ | creates a WeatherRequest for current weather data |
| forecast5  | ------ | creates a WeatherRequest for a 5-day/3-hour interval forecast |
| forecast16 | ------ | creates a WeatherRequest for 16-day forecast |
| defaultKey | appid  |sets a default API-KEY for all WeatherRequest's |


For a more complete overview of each of these modules, you can consult the JSDoc.

# TODOs
0. make repo public and write install script
1. create an executable for a CLI that imports the openweather modules
5. create methods for units // .toStandad(), .toImperial(), .toMetric()

2. Finish Testing:
  * `openweather-air` constructor
  * `openweather-air` coords
  * `openweather-air` datetime
  * `openweather-air` url
  * `openweather-air` exec
