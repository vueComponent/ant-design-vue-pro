"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

/**
 * Determine whether the given node is of the given type.
 *
 * @param  {import('postcss').Node} node
 * @param  {string} type
 * @return {boolean}
 */
function _default(node, type) {
  return node && node.type === type;
}