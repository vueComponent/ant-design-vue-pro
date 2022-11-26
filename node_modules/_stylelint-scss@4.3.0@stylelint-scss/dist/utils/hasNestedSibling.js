"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

/**
 * Determines whether a given node has nested sibling.
 *
 * @param  {import('postcss').Node} node
 * @return {boolean}
 */
function _default(node) {
  return node && node.parent.nodes.some(function (n) {
    return n !== node && n.type === "nesting";
  });
}