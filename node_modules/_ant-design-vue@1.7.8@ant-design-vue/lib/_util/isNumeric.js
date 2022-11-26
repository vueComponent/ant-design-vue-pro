"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isNumeric = function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
};
exports["default"] = isNumeric;