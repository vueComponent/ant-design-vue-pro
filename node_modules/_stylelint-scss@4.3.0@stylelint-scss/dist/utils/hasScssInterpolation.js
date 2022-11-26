"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

/**
 * Check whether a string has scss interpolation
 *
 * @param {string} string
 */
function _default(string) {
  return /#{.+?}/.test(string);
}