"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function get() {
    return _index.default;
  }
});
exports.Global = exports.registerShape = exports.registerAnimation = void 0;

var _isArray2 = _interopRequireDefault(require("lodash/isArray"));

var _isPlainObject2 = _interopRequireDefault(require("lodash/isPlainObject"));

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _CommonChart = _interopRequireDefault(require("./core/CommonChart"));

var CustomizeUtils = _interopRequireWildcard(require("./utils/CustomizeUtils"));

var _index = _interopRequireDefault(require("./plugins/index"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var G2 = require('@antv/g2');

var registerAnimation = CustomizeUtils.registerAnimation;
exports.registerAnimation = registerAnimation;
var registerShape = CustomizeUtils.registerShape;
exports.registerShape = registerShape;
var Global = G2.Global;
exports.Global = Global;

function hasDataCondition(config) {
  var hasData = false;

  if (!(0, _isEmpty2.default)(config.data)) {
    hasData = true;
  }

  if (!(0, _isNil2.default)(config.views)) {
    if ((0, _isPlainObject2.default)(config.views) && !(0, _isEmpty2.default)(config.views.data)) {
      hasData = true;
    }

    if ((0, _isArray2.default)(config.views)) {
      for (var _i = 0, _a = config.views; _i < _a.length; _i++) {
        var item = _a[_i];

        if (!(0, _isEmpty2.default)(item.data)) {
          hasData = true;
        }
      }
    }
  }

  return hasData;
}

function _default(config) {
  if ((0, _isNil2.default)(config) || (0, _isEmpty2.default)(config)) {
    return;
  }

  var hasData = hasDataCondition(config);

  if (!hasData) {
    return;
  }

  var commonChart = new _CommonChart.default(config);
  commonChart.render();
  return commonChart;
}