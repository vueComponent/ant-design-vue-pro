"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportD3Formatter = void 0;

var _isString2 = _interopRequireDefault(require("lodash/isString"));

var _get2 = _interopRequireDefault(require("lodash/get"));

var d3 = _interopRequireWildcard(require("d3-format"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var supportD3Formatter = function supportD3Formatter(obj) {
  var objFormatter = (0, _get2.default)(obj, 'formatter');

  if ((0, _isString2.default)(objFormatter)) {
    obj.formatter = function (val) {
      return d3.format(objFormatter)(val);
    };

    return obj;
  }

  var _loop_1 = function _loop_1(item) {
    if (obj.hasOwnProperty(item)) {
      var formatter_1 = (0, _get2.default)(obj[item], 'formatter');

      if ((0, _isString2.default)(formatter_1)) {
        obj[item].formatter = function (val) {
          return d3.format(formatter_1)(val);
        };
      }
    }
  };

  for (var item in obj) {
    _loop_1(item);
  }

  return obj;
};

exports.supportD3Formatter = supportD3Formatter;