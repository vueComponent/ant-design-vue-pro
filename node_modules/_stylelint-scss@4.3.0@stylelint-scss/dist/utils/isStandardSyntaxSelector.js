"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _hasInterpolation = _interopRequireDefault(require("./hasInterpolation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Check whether a selector is standard
 *
 * @param {string} selector
 * @returns {boolean}
 */
function _default(selector) {
  // SCSS or Less interpolation
  if ((0, _hasInterpolation["default"])(selector)) {
    return false;
  } // SCSS placeholder selectors


  if (selector.startsWith("%")) {
    return false;
  } // Less :extend()


  if (/:extend(\(.*?\))?/.test(selector)) {
    return false;
  } // Less mixin with resolved nested selectors (e.g. .foo().bar or .foo(@a, @b)[bar])


  if (/\.[\w-]+\(.*\).+/.test(selector)) {
    return false;
  } // ERB template tags


  if (selector.includes("<%") || selector.includes("%>")) {
    return false;
  }

  return true;
}