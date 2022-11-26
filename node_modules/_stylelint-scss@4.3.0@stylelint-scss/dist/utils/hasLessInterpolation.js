"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

/**
 * Check whether a string has less interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has less interpolation
 */
function _default(string) {
  return /@{.+?}/.test(string);
}