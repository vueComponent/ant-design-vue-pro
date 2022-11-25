"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.easeInOutCubic = easeInOutCubic;
function easeInOutCubic(t, b, c, d) {
  var cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return cc / 2 * t * t * t + b;
  }
  return cc / 2 * ((t -= 2) * t * t + 2) + b;
}