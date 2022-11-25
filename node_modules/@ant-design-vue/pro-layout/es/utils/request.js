function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import request, { extend } from 'umi-request';
import { notification } from 'ant-design-vue';
var codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

var errorHandler = function errorHandler(error) {
  var _error$response = error.response,
      response = _error$response === void 0 ? {} : _error$response;
  var errortext = codeMessage[response.status] || response.statusText;
  var status = response.status,
      url = response.url;
  notification.error({
    message: "\u8BF7\u6C42\u9519\u8BEF ".concat(status, ": ").concat(url),
    description: errortext
  });
};

export var BASE_URL = process.env.VUE_APP_API_URL || '/api/v1';
var customRequest = extend({
  prefix: BASE_URL,
  timeout: 1000,
  errorHandler: errorHandler
}); // request 拦截器

customRequest.interceptors.request.use(function (url, options) {
  return {
    url: "".concat(url, "&interceptors=yes"),
    options: _objectSpread({}, options, {
      interceptors: true
    })
  };
}); // response 拦截器

customRequest.interceptors.response.use(function (response, options) {
  response.headers.append('interceptors', 'yes yo');
  return response;
});
export { request, extend };
export default customRequest;