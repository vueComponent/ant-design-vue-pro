"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polarToCartesian = exports.radianToDegree = exports.degreeToRadian = void 0;

var degreeToRadian = function degreeToRadian(angle) {
  return angle * Math.PI / 180;
};

exports.degreeToRadian = degreeToRadian;

var radianToDegree = function radianToDegree(angleInRadian) {
  return angleInRadian * 180 / Math.PI;
};

exports.radianToDegree = radianToDegree;

var polarToCartesian = function polarToCartesian(cx, cy, radius, angle) {
  var radian = degreeToRadian(angle);
  return {
    x: cx + Math.cos(radian) * radius,
    y: cy + Math.sin(radian) * radius
  };
};

exports.polarToCartesian = polarToCartesian;