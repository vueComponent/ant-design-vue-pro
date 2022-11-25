"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

/**
 * Check whether a string has JS template literal interpolation or HTML-like template
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has template literal interpolation
 */
function _default(string) {
  return /{.+?}/.test(string);
}