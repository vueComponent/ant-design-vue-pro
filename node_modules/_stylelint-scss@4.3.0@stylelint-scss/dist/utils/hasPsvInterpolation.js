"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

/**
 * Check whether a string has postcss-simple-vars interpolation
 *
 * @param {string} string
 */
function _default(string) {
  return /\$\(.+?\)/.test(string);
}