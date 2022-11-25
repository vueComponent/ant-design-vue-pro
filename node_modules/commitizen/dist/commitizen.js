"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = exports.adapter = void 0;
Object.defineProperty(exports, "commit", {
  enumerable: true,
  get: function () {
    return _commit.default;
  }
});
exports.configLoader = void 0;
Object.defineProperty(exports, "init", {
  enumerable: true,
  get: function () {
    return _init.default;
  }
});
exports.staging = void 0;

var adapter = _interopRequireWildcard(require("./commitizen/adapter"));

exports.adapter = adapter;

var cache = _interopRequireWildcard(require("./commitizen/cache"));

exports.cache = cache;

var _commit = _interopRequireDefault(require("./commitizen/commit"));

var configLoader = _interopRequireWildcard(require("./commitizen/configLoader"));

exports.configLoader = configLoader;

var _init = _interopRequireDefault(require("./commitizen/init"));

var staging = _interopRequireWildcard(require("./commitizen/staging"));

exports.staging = staging;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }