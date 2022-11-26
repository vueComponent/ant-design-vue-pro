"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _postcssSelectorParser = _interopRequireDefault(require("postcss-selector-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default(selector, result, node, cb) {
  try {
    return (0, _postcssSelectorParser["default"])(cb).processSync(selector);
  } catch (e) {
    result.warn("Cannot parse selector", {
      node: node
    });
  }
}