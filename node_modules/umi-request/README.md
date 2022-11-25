English | [简体中文](./README_zh-CN.md)

# umi-request

The network request library, based on fetch encapsulation, combines the features of fetch and axios to provide developers with a unified api call method, simplifying usage, and providing common functions such as caching, timeout, character encoding processing, and error handling.

[![NPM version](https://img.shields.io/npm/v/umi-request.svg?style=flat)](https://npmjs.org/package/umi-request)
[![Build Status](https://img.shields.io/travis/umijs/umi-request.svg?style=flat)](https://travis-ci.org/umijs/umi-request)
[![NPM downloads](http://img.shields.io/npm/dm/umi-request.svg?style=flat)](https://npmjs.org/package/umi-request)

---

## Supported features

- url parameter is automatically serialized
- post data submission method is simplified
- response return processing simplification
- api timeout support
- api request cache support
- support for processing gbk
- request and response interceptor support like axios
- unified error handling
- middleware support
- cancel request support like axios
- make http request from node.js

## umi-request vs fetch vs axios

| Features             | umi-request            | fetch                  | axios          |
| :------------------- | :--------------------- | :--------------------- | :------------- |
| implementation       | Browser native support | Browser native support | XMLHttpRequest |
| size                 | 9k                     | 4k (polyfill)          | 14k            |
| query simplification | ✅                      | ❌                      | ✅              |
| post simplification  | ✅                      | ❌                      | ❌              |
| timeout              | ✅                      | ❌                      | ✅              |
| cache                | ✅                      | ❌                      | ❌              |
| error Check          | ✅                      | ❌                      | ❌              |
| error Handling       | ✅                      | ❌                      | ✅              |
| interceptor          | ✅                      | ❌                      | ✅              |
| prefix               | ✅                      | ❌                      | ❌              |
| suffix               | ✅                      | ❌                      | ❌              |
| processing gbk       | ✅                      | ❌                      | ❌              |
| middleware           | ✅                      | ❌                      | ❌              |
| cancel request       | ✅                      | ❌                      | ✅              |

For more discussion, refer to [Traditional Ajax is dead, Fetch eternal life](https://github.com/camsong/blog/issues/2) If you have good suggestions and needs, please mention [issue](https://github.com/umijs/umi/issues)

## TODO Welcome pr

- [x] Test case coverage 85%+
- [x] write a document
- [x] CI integration
- [x] release configuration
- [x] typescript

## Installation

```
npm install --save umi-request
```

## Example

Performing a `GET` request

```javascript
import request from 'umi-request';

request
  .get('/api/v1/xxx?id=1')
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });

// use options.params
request
  .get('/api/v1/xxx', {
    params: {
      id: 1,
    },
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
```

Performing a `POST` request

```javascript
request
  .post('/api/v1/user', {
    data: {
      name: 'Mike',
    },
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
```

## umi-request API

Requests can be made by passing relevant options to `umi-request`

**umi-request(url[, options])**

```javascript
import request from 'umi-request';

request('/api/v1/xxx', {
  method: 'get',
  params: { id: 1 },
})
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });

request('/api/v1/user', {
  method: 'post',
  data: {
    name: 'Mike',
  },
})
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
```

## Request method aliases

For convenience umi-request have been provided for all supported methods.

**request.get(url[, options])**

**request.post(url[, options])**

**request.delete(url[, options])**

**request.put(url[, options])**

**request.patch(url[, options])**

**request.head(url[, options])**

**request.options(url[, options])**

## Creating an instance

You can use `extend({[options]})` to create a new instance of umi-request.

**extend([options])**

```javascript
import { extend } from 'umi-request';

const request = extend({
  prefix: '/api/v1',
  timeout: 1000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

request
  .get('/user')
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
```

Create an instance of umi-request in NodeJS enviroment

```javascript
const umi = require('umi-request');
const extendRequest = umi.extend({ timeout: 10000 });

extendRequest('/api/user')
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

The available instance methods are list below. The specified options will be merge with the instance options.

**request.get(url[, options])**

**request.post(url[, options])**

**request.delete(url[, options])**

**request.put(url[, options])**

**request.patch(url[, options])**

**request.head(url[, options])**

**request.options(url[, options])**

More umi-request cases can see [antd-pro](https://github.com/umijs/ant-design-pro/blob/master/src/utils/request.js)

## request options

| Parameter           | Description                                                      | Type                      | Optional Value                    | Default                    |
| :------------------ | :--------------------------------------------------------------- | :------------------------ | :-------------------------------- | :------------------------- |
| method              | request method                                                   | string                    | get , post , put ...              | get                        |
| params              | url request parameters                                           | object or URLSearchParams | --                                | --                         |
| data                | Submitted data                                                   | any                       | --                                | --                         |
| headers             | fetch original parameters                                        | object                    | --                                | {}                         |
| timeout             | timeout, default millisecond, write with caution                 | number                    | --                                |
| timeoutMessage      | customize timeout error message, please config `timeout` first   | string                    | --                                | --                         |
| prefix              | prefix, generally used to override the uniform settings prefix   | string                    | --                                | --                         |
| suffix              | suffix, such as some scenes api need to be unified .json         | string                    | --                                |
| credentials         | fetch request with cookies                                       | string                    | --                                | credentials: 'same-origin' |
| useCache            | Whether to use caching (only support browser environment)        | boolean                   | --                                | false                      |
| validateCache       | cache strategy function                                          | (url, options) => boolean | --                                | only get request to cache  |
| ttl                 | Cache duration, 0 is not expired                                 | number                    | --                                | 60000                      |
| maxCache            | Maximum number of caches                                         | number                    | --                                | 0(Infinity)                |
| requestType         | post request data type                                           | string                    | json , form                       | json                       |
| parseResponse       | response processing simplification                               | boolean                   | --                                | true                       |
| charset             | character set                                                    | string                    | utf8 , gbk                        | utf8                       |
| responseType        | How to parse the returned data                                   | string                    | json , text , blob , formData ... | json , text                |
| throwErrIfParseFail | throw error when JSON parse fail and responseType is 'json'      | boolean                   | --                                | false                      |
| getResponse         | Whether to get the source response, the result will wrap a layer | boolean                   | --                                | fasle                      |
| errorHandler        | exception handling, or override unified exception handling       | function(error)           | --                                |
| cancelToken         | Token to cancel request                                          | CancelToken.token         | --                                | --                         |

The other parameters of fetch are valid. See [fetch documentation](https://github.github.io/fetch/)

## extend options Initialize default parameters, support all of the above

| Parameter | Description            | Type   | Optional Value       | Default |
| :-------- | :--------------------- | :----- | :------------------- | :------ |
| method    | request method         | string | get , post , put ... | get     |
| params    | url request parameters | object | --                   | --      |
| data      | Submitted data         | any    | --                   | --      |
| ...       |

```javascript
{
  // 'method' is the request method to be used when making the request
  method: 'get', // default

  // 'params' are the URL parameters to be sent with request
  // Must be a plain object or a URLSearchParams object
  params: { id: 1 },

  // 'paramSerializer' is a function in charge of serializing 'params'. ( be aware of 'params' was merged by extends's 'params' and request's 'params' and URLSearchParams will be transform to plain object. )
  paramsSerializer: function (params) {
    return Qs.stringify(params, { arrayFormat: 'brackets' })
  },

  // 'data' 作为请求主体被发送的数据
  // 适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
  // 必须是以下类型之一：
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属：FormData, File, Blob
  // - Node 专属： Stream

  // 'data' is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // Must be of one of the following types:
  // 1. string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // 2. Browser only: FormData, File, Blob
  // 3. Node only: Stream
  data: { name: 'Mike' },

  // 'headers' are custom headers to be sent
  headers: { 'Content-Type': 'multipart/form-data' },

  // 'timeout' specifies the number of milliseconds before the request times out.
  // If the request takes longer than 'timeout', request will be aborted and throw RequestError.
  timeout: 1000,

  // ’prefix‘ used to set URL's prefix
  // ( e.g. request('/user/save', { prefix: '/api/v1' }) => request('/api/v1/user/save') )
  prefix: '',

  // ’suffix‘ used to set URL's suffix
  // ( e.g. request('/api/v1/user/save', { suffix: '.json'}) => request('/api/v1/user/save.json') )
  suffix: '',

  // 'credentials' indicates whether the user agent should send cookies from the other domain in the case of cross-origin requests.
  // omit: Never send or receive cookies.
  // same-origin: Send user credentials (cookies, basic http auth, etc..) if the URL is on the same origin as the calling script. This is the default value.
  // include: Always send user credentials (cookies, basic http auth, etc..), even for cross-origin calls.
  credentials: 'same-origin', // default

  // ’useCache‘ The GET request would be cache in ttl milliseconds when 'useCache' is true.
  // The cache key would be 'url + params + method'.
  useCache: false, // default

  // 'ttl' cache duration（milliseconds），0 is infinity
  ttl: 60000,

  // 'maxCache' are the max number of requests to be cached, 0 means infinity.
  maxCache: 0,

  // According to http protocal, request of GET used to get data from server, it's necessary to cache response data when server data update not frequently. We provide 'validateCache'
  // for some cases that need to cache data with other method reqeust.
  validateCache: (url, options) => { return options.method.toLowerCase() === 'get' },


  // 'requestType' umi-request will add headers and body according to the 'requestType' when the type of data is object or array.
  // 1. requestType === 'json' :(default )
  // options.headers = {
  //   Accept: 'application/json',
  //   'Content-Type': 'application/json;charset=UTF-8',
  //   ...options.headers,
  // }
  // options.body = JSON.stringify(data)
  //
  // 2. requestType === 'form':
  // options.headers = {
  //   Accept: 'application/json',
  //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  //   ...options.headers,
  // };
  // options.body = query-string.stringify(data);
  //
  // 3. other requestType
  // options.headers = {
  //   Accept: 'application/json',
  //   ...options.headers,
  // };
  // options.body = data;
  requestType: 'json', // default

  // 'parseResponse' whether processing response
  parseResponse: true, // default

  // 'charset' This parameter can be used when the server returns gbk to avoid garbled characters.(parseResponse should set to true)
  charset: 'gbk',

  // 'responseType': how to processing response.(parseResponse should be true)
  // The default value is 'json', would processing response by Response.text().then( d => JSON.parse(d) )
  // Other responseType (text, blob, arrayBuffer, formData), would processing response by Response[responseType]()
  responseType: 'json', // default

  // 'throwErrIfParseFail': whether throw error or not when JSON parse data fail and responseType is 'json'.
  throwErrIfParseFail: false, // default

  // 'getResponse': if you need the origin Response, set true and will return { data, response }.
  getResponse: false,// default

  // 'errorHandler' error handle entry.
  errorHandler: function(error) { /* 异常处理 */ },

  // 'cancelToken' the token of cancel request.
  cancelToken: null,
}
```

### Extend Options

Sometimes we need to update options after **extend** a request instance, umi-request provide **extendOptions** for users to update options:

```javascript
const request = extend({ timeout: 1000, params: { a: '1' } });
// default options is: { timeout: 1000, params: { a: '1' }}

request.extendOptions({ timeout: 3000, params: { b: '2' } });
// after extendOptions: { timeout: 3000, params: { a: '1', b: '2' }}
```

## Response Schema

The response for a request contains the following information.

```javascript
{
  // 'data' is the response that was provided by the server
  data: {},

  // 'status' is the HTTP status code from the server response
  status: 200,

  // 'statusText' is the HTTP status message from the server response
  statusText: 'OK',

  // 'headers' the headers that the server responded with
  // All header names are lower cased
  headers: {},
}
```

When options.getResponse === false, the response schema would be 'data'

```javascript
request.get('/api/v1/xxx', { getResponse: false }).then(function(data) {
  console.log(data);
});
```

When options.getResponse === true ，the response schema would be { data, response }

```javascript
request.get('/api/v1/xxx', { getResponse: true }).then(function({ data, response }) {
  console.log(data);
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.headers);
});
```

You can get Response from `error` object in errorHandler or request.catch.

## Error handling

```javascript
import request, { extend } from 'umi-request';

const errorHandler = function(error) {
  const codeMap = {
    '021': 'An error has occurred',
    '022': 'It’s a big mistake,',
    // ....
  };
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.status);
    console.log(error.response.headers);
    console.log(error.data);
    console.log(error.request);
    console.log(codeMap[error.data.status]);
  } else {
    // The request was made but no response was received or error occurs when setting up the request.
    console.log(error.message);
  }

  throw error; // If throw. The error will continue to be thrown.

  // return {some: 'data'}; If return, return the value as a return. If you don't write it is equivalent to return undefined, you can judge whether the response has a value when processing the result.
  // return {some: 'data'};
};

// 1. Unified processing
const extendRequest = extend({ errorHandler });

// 2. Separate special treatment
// If unified processing is configured, but an api needs special handling. When requested, the errorHandler is passed as a parameter.
request('/api/v1/xxx', { errorHandler });

// 3. not configure errorHandler, the response will be directly treated as promise, and it will be caught.
request('/api/v1/xxx')
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    return errorHandler(error);
  });
```

## Middleware

Expressive HTTP middleware framework for node.js. For development to enhance before and after request. Support create instance, global, core middlewares.

**Instance Middleware (default)** request.use(fn) Different instances's instance middleware are independence.
**Global Middleware** request.use(fn, { global: true }) Different instances share global middlewares.
**Core Middleware** request.use(fn, { core: true }) Used to expand request core.

request.use(fn[, options])

### params

fn params

- ctx(Object)：context, content request and response
- next(Function)：function to call the next middleware

options params

- global(boolean): whether global， higher priority than core
- core(boolean): whether core

### example

1. same type of middlewares

```javascript
import request, { extend } from 'umi-request';
request.use(async (ctx, next) => {
  console.log('a1');
  await next();
  console.log('a2');
});
request.use(async (ctx, next) => {
  console.log('b1');
  await next();
  console.log('b2');
});

const data = await request('/api/v1/a');
```

order of middlewares be called:

```shell
a1 -> b1 -> response -> b2 -> a2
```

2. Different type of middlewares

```javascript
request.use(async (ctx, next) => {
  console.log('instanceA1');
  await next();
  console.log('instanceA2');
});
request.use(async (ctx, next) => {
  console.log('instanceB1');
  await next();
  console.log('instanceB2');
});
request.use(
  async (ctx, next) => {
    console.log('globalA1');
    await next();
    console.log('globalA2');
  },
  { global: true }
);
request.use(
  async (ctx, next) => {
    console.log('coreA1');
    await next();
    console.log('coreA2');
  },
  { core: true }
);
```

order of middlewares be called:

```shell
instanceA1 -> instanceB1 -> globalA1 -> coreA1 -> coreA2 -> globalA2 -> instanceB2 -> instanceA2
```

3. Enhance request

```javascript
request.use(async (ctx, next) => {
  const { req } = ctx;
  const { url, options } = req;

  if (url.indexOf('/api') !== 0) {
    ctx.req.url = `/api/v1/${url}`;
  }
  ctx.req.options = {
    ...options,
    foo: 'foo',
  };

  await next();

  const { res } = ctx;
  const { success = false } = res;
  if (!success) {
    // ...
  }
});
```

4. Use core middleware to expand request core.

```javascript
request.use(
  async (ctx, next) => {
    const { req } = ctx;
    const { url, options } = req;
    const { __umiRequestCoreType__ = 'normal' } = options;

    // __umiRequestCoreType__ use to identificat request core
    // when value is 'normal' , use umi-request 's fetch request core
    if (__umiRequestCoreType__ === 'normal') {
      await next();
      return;
    }

    // when value is not normal, use your request func.
    const response = getResponseByOtherWay();

    ctx.res = response;

    await next();
    return;
  },
  { core: true }
);

request('/api/v1/rpc', {
  __umiRequestCoreType__: 'rpc',
  parseResponse: false,
})
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
```

## Interceptor

You can intercept requests or responses before they are handled by then or catch.

1. global Interceptor

```javascript
// request interceptor, change url or options.
request.interceptors.request.use((url, options) => {
  return {
    url: `${url}&interceptors=yes`,
    options: { ...options, interceptors: true },
  };
});

// Same as the last one
request.interceptors.request.use(
  (url, options) => {
    return {
      url: `${url}&interceptors=yes`,
      options: { ...options, interceptors: true },
    };
  },
  { global: true }
);

// response interceptor, chagne response
request.interceptors.response.use((response, options) => {
  response.headers.append('interceptors', 'yes yo');
  return response;
});

// handling error in response interceptor
request.interceptors.response.use(response => {
  const codeMaps = {
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
  };
  message.error(codeMaps[response.status]);
  return response;
});

// clone response in response interceptor
request.interceptors.response.use(async response => {
  const data = await response.clone().json();
  if (data && data.NOT_LOGIN) {
    location.href = '登录url';
  }
  return response;
});
```

1. instance Interceptor

```javascript
// Global interceptors are used `request` instance method directly
request.interceptors.request.use(
  (url, options) => {
    return {
      url: `${url}&interceptors=yes`,
      options: { ...options, interceptors: true },
    };
  },
  { global: false }
); // second paramet defaults { global: true }

function createClient(baseUrl) {
  const request = extend({
    prefix: baseUrl,
  });
  return request;
}

const clientA = createClient('/api');
const clientB = createClient('/api');
// Independent instance Interceptor
clientA.interceptors.request.use(
  (url, options) => {
    return {
      url: `${url}&interceptors=clientA`,
      options,
    };
  },
  { global: false }
);

clientB.interceptors.request.use(
  (url, options) => {
    return {
      url: `${url}&interceptors=clientB`,
      options,
    };
  },
  { global: false }
);
```

## Cancel request

### Use AbortController

Base on [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) that allows you to abort one or more Web requests as and when desired.

```javascript
// polyfill abort controller if needed
import 'yet-another-abortcontroller-polyfill'
import Request from 'umi-request';

const controller = new AbortController(); // create a controller
const { signal } = controller; // grab a reference to its associated AbortSignal object using the AbortController.signal property

signal.addEventListener('abort', () => {
  console.log('aborted!');
});

Request('/api/response_after_1_sec', {
  signal, // pass in the AbortSignal as an option inside the request's options object (see {signal}, below). This associates the signal and controller with the fetch request and allows us to abort it by calling AbortController.abort(),
});

// 取消请求
setTimeout(() => {
  controller.abort(); // Aborts a DOM request before it has completed. This is able to abort fetch requests, consumption of any response Body, and streams.
}, 100);
```

### Use Cancel Token

> Cancel Token still work, but we don’t recommend using them in the new code.

1. You can cancel a request using a cancel token.

```javascript
import Request from 'umi-request';

const CancelToken = Request.CancelToken;
const { token, cancel } = CancelToken.source();

Request.get('/api/cancel', {
  cancelToken: token,
}).catch(function(thrown) {
  if (Request.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});

Request.post(
  '/api/cancel',
  {
    name: 'hello world',
  },
  {
    cancelToken: token,
  }
);

// cancel request (the message parameter is optional)
cancel('Operation canceled by the user.');
```

2. You can also create a cancel token by passing an executor function to the CancelToken constructor:

```javascript
import Request from 'umi-request';

const CancelToken = Request.CancelToken;
let cancel;

Request.get('/api/cancel', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
  }),
});

// cancel request
cancel();
```

## Cases

### How to get Response Headers

Use **Headers.get()** (more detail see [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers/get))

```javascript
request('/api/v1/some/api', { getResponse: true }).then(({ data, response }) => {
  response.headers.get('Content-Type');
});
```

If want to get a custem header, you need to set [Access-Control-Expose-Headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) on server.

### File upload

Use FormData() contructor，the browser will add request header `"Content-Type: multipart/form-data"` automatically, developer don't need to add request header **Content-Type**

```javascript
const formData = new FormData();
formData.append('file', file);
request('/api/v1/some/api', { method: 'post', data: formData });
```

The Access-Control-Expose-Headers response header indicates which headers can be exposed as part of the response by listing their names.[Access-Control-Expose-Headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)

## Development and debugging

- npm install
- npm run dev
- npm link
- Then go to the project you are testing to execute npm link umi-request
- Introduced and used

## Questions & Suggestions

Please open an issue [here](https://github.com/umijs/umi/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).

## Code Contributors

- @clock157
- @yesmeck
- @yutingzhao1991

## LICENSE

MIT
