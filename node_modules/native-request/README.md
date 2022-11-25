# Native Request
[![npm version](https://badge.fury.io/js/native-request.svg)](https://badge.fury.io/js/native-request) ![npm](https://img.shields.io/npm/dm/native-request)

### v1.1 has been released


Native Request is a simple module that makes you create native node.js requests supports https.

  - supports HTTPS
  - 0 dependencies
  - use callbacks




## Table of Contents  
[Installation](#installation)  
[Usage](#usage)
[Planned features](#planned_features)



## Planned features

 - 1.2.0: Proxy management
 

## Installation

Install the dependencies and devDependencies and start the server.

```bash
npm install native-request
```

## Usage

### JSON request (recommended)
 - request.request(options, callback)

Easy

```js
let request = require('native-request');

request.request({
        url: "http://github.com/",
        method: 'POST',
    }, function(err, data, status, headers) {
        console.log(status); //200
        console.log(data); // page content
        console.log(headers); // response headers
});

```

Full
```js
let request = require('native-request');

request.request({
        url: "http://github.com/",
        method: 'POST',
        Cookies: { john: "doe", human: true },
        headers: {
            authorization: "Token121"
        },
        requestOptions: {
            followRedirect: false,
            maxRedirect: 1,
            trustRedirect: false
        }

    }, function(err, data, status, headers) {
        console.log(status); //200
        console.log(data); // page content
        console.log(headers); // response headers
});

```

#### Parameters
| Options | Required  | Type  | Parameters |  Default 
|:--|:--:|:--: |-- |:--: |
| url | ✓ | String |Target url | |
| method| ✓ | String|HTTP method to use. More info [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) | |
| Headers | | JSON Object | Pass headers to the request with a JSON format.  | `{"content-type": "application/json"}` |
| Cookies| | JSON Object | Pass cookies to the request with a JSON format  | |
| requestOptions|  | See below |


#### RequestOptions
The parameters below are here for client configuration. None of these parameters will be sent.
These parameters must be put in the object '**requestOptions**'

 | Options | Required | Type | Parameters |  Default
|:--|:--:|:--: | -- | :--: |
| followRedirect |  | boolean | Decide if we should follow the redirects | true
| maxRedirect|  | int| Decide the maximum number of redirects allowed | 3
| trustRedirect|  | boolean | If **false**, headers will not be sent when a redirect happen  | true








### GET request
 -  request.get(path, headers, callback)
 -  request.get(path, callback)



```js
let request = require('native-request');
request.get('https://github.com', function(err, data, status, headers) {
    if (err) {
        throw err;
    }
    console.log(status); //200
    console.log(data); // page content
    console.log(headers); // response headers
});
```
To add custom **headers** just do like this:
```js
let request = require('native-request');

let headers = {
    "content-type": "plain/text"
}
request.get('https://github.com', headers, function(err, data, status, headers) {
    if (err) {
        throw err;
    }
    console.log(status); //200
    console.log(data); // page content
    console.log(headers); // response headers
});
```
### POST request
 -  request.post(path, callback)
 -  request.post(path, data, callback)
 -  request.post(path, data, headers, callback)

 
To send an empty **post**:
```js
let request = require('native-request');
request.post('https://github.com', function(err, data, status, headers) {
    if (err) {
        throw err;
    }
    console.log(status); //200
    console.log(data); // page content
    console.log(headers); // response headers
});
```

With headers and data:

```js
let request = require('native-request');

let data = {
    "example": true,
}
let headers = {
    "content-type": "plain/text"
}
request.post('https://github.com', data, headers, function(err, data, status, headers) {
    if (err) {
        throw err;
    }
    console.log(status); //200
    console.log(data); // page content
    console.log(headers); // response headers
});
```


### License
MIT. Copyright (c) Samuel Marchese.
