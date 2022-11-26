"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateUnitNormal = void 0;

var calculateUnitNormal = function calculateUnitNormal(vector) {
  var _a = vector[0],
      a = _a === void 0 ? 0 : _a,
      _b = vector[1],
      b = _b === void 0 ? 0 : _b;
  var magnitud = Math.pow(a, 2) + Math.pow(b, 2);

  if (magnitud <= 0) {
    return [0, 0];
  }

  if (a === 0) {
    return [1, 0];
  }

  var tanTheta = b / a;
  var theta = Math.atan(tanTheta);
  var normalTheta = theta + Math.PI / 2;
  return [Math.cos(normalTheta), Math.sin(normalTheta)];
};

exports.calculateUnitNormal = calculateUnitNormal;