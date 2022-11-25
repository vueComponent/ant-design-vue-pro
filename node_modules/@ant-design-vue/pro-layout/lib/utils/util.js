"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contentWidthCheck = void 0;
exports.genStringToTheme = genStringToTheme;
exports.genThemeToString = genThemeToString;
exports.getComponentFromProp = void 0;
Object.defineProperty(exports, "inBrowser", {
  enumerable: true,
  get: function get() {
    return _env.inBrowser;
  }
});
exports.layoutContentWidth = exports.isFun = void 0;
Object.defineProperty(exports, "triggerEvent", {
  enumerable: true,
  get: function get() {
    return _triggerEvent["default"];
  }
});

var _triggerEvent = _interopRequireDefault(require("ant-design-vue/es/_util/triggerEvent"));

var _env = require("ant-design-vue/es/_util/env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getComponentFromProp = function getComponentFromProp(instance, prop) {
  var slots = instance.slots && instance.slots();
  return slots[prop] || instance.props[prop];
};

exports.getComponentFromProp = getComponentFromProp;

var isFun = function isFun(func) {
  return typeof func === 'function';
}; // 兼容 0.3.4~0.3.8


exports.isFun = isFun;

var contentWidthCheck = function contentWidthCheck(contentWidth) {
  return Object.prototype.toString.call(contentWidth) === '[object Boolean]' ? contentWidth === true && 'Fixed' || 'Fluid' : contentWidth;
};

exports.contentWidthCheck = contentWidthCheck;

var layoutContentWidth = function layoutContentWidth(contentType) {
  return contentType !== 'Fluid';
};

exports.layoutContentWidth = layoutContentWidth;
var themeConfig = {
  daybreak: 'daybreak',
  '#1890FF': 'daybreak',
  '#F5222D': 'dust',
  '#FA541C': 'volcano',
  '#FAAD14': 'sunset',
  '#13C2C2': 'cyan',
  '#52C41A': 'green',
  '#2F54EB': 'geekblue',
  '#722ED1': 'purple'
};

var invertKeyValues = function invertKeyValues(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    acc[obj[key]] = key;
    return acc;
  }, {});
};
/**
 * #1890ff -> daybreak
 * @param val
 */


function genThemeToString(val) {
  return val && themeConfig[val] ? themeConfig[val] : val;
}
/**
 * daybreak-> #1890ff
 * @param val
 */


function genStringToTheme(val) {
  var stringConfig = invertKeyValues(themeConfig);
  return val && stringConfig[val] ? stringConfig[val] : val;
}