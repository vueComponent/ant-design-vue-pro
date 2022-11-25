const mat3 = require('@antv/gl-matrix/lib/gl-matrix/mat3');

mat3.translate = function(out, a, v) {
  const transMat = new Array(9);
  mat3.fromTranslation(transMat, v);
  return mat3.multiply(out, transMat, a);
};

mat3.rotate = function(out, a, rad) {
  const rotateMat = new Array(9);
  mat3.fromRotation(rotateMat, rad);
  return mat3.multiply(out, rotateMat, a);
};

mat3.scale = function(out, a, v) {
  const scaleMat = new Array(9);
  mat3.fromScaling(scaleMat, v);
  return mat3.multiply(out, scaleMat, a);
};

module.exports = mat3;
