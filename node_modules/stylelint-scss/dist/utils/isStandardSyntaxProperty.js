"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _hasInterpolation = _interopRequireDefault(require("./hasInterpolation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Check whether a property is standard
 *
 * @param {string} property
 * @returns {boolean}
 */
function _default(property) {
  // SCSS var (e.g. $var: x), list (e.g. $list: (x)) or map (e.g. $map: (key:value))
  if (property.startsWith("$")) {
    return false;
  } // Less var (e.g. @var: x)


  if (property.startsWith("@")) {
    return false;
  } // Less append property value with space (e.g. transform+_: scale(2))


  if (property.endsWith("+") || property.endsWith("+_")) {
    return false;
  } // SCSS or Less interpolation


  if ((0, _hasInterpolation["default"])(property)) {
    return false;
  }

  return true;
}