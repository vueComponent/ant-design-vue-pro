"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
var tuple = exports.tuple = function tuple() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args;
};

var tupleNum = exports.tupleNum = function tupleNum() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return args;
};