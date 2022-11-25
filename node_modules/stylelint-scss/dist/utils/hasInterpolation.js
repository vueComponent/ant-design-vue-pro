"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _hasLessInterpolation = _interopRequireDefault(require("./hasLessInterpolation"));

var _hasPsvInterpolation = _interopRequireDefault(require("./hasPsvInterpolation"));

var _hasScssInterpolation = _interopRequireDefault(require("./hasScssInterpolation"));

var _hasTplInterpolation = _interopRequireDefault(require("./hasTplInterpolation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Check whether a string has interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has interpolation
 */
function _default(string) {
  // SCSS or Less interpolation
  return !!((0, _hasLessInterpolation["default"])(string) || (0, _hasScssInterpolation["default"])(string) || (0, _hasTplInterpolation["default"])(string) || (0, _hasPsvInterpolation["default"])(string));
}