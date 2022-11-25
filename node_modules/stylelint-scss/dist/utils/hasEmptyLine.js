"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

/**
 * Check if a string contains at least one empty line
 *
 * @param {string} string
 * @return {boolean}
 */
function _default(string) {
  return string && (string.includes("\n\n") || string.includes("\n\r\n"));
}