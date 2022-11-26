const vec2 = require('@antv/gl-matrix/lib/gl-matrix/vec2');
const clamp = require('../math/clamp');

vec2.angle = function(v1, v2) {
  const theta = vec2.dot(v1, v2) / (vec2.length(v1) * vec2.length(v2));
  return Math.acos(clamp(theta, -1, 1));
};
/**
 * 向量 v1 到 向量 v2 夹角的方向
 * @param  {Array} v1 向量
 * @param  {Array} v2 向量
 * @return {Boolean} >= 0 顺时针 < 0 逆时针
 */
vec2.direction = function(v1, v2) {
  return v1[0] * v2[1] - v2[0] * v1[1];
};
vec2.angleTo = function(v1, v2, direct) {
  const angle = vec2.angle(v1, v2);
  const angleLargeThanPI = vec2.direction(v1, v2) >= 0;
  if (direct) {
    if (angleLargeThanPI) {
      return Math.PI * 2 - angle;
    }

    return angle;
  }

  if (angleLargeThanPI) {
    return angle;
  }
  return Math.PI * 2 - angle;
};
vec2.vertical = function(out, v, flag) {
  if (flag) {
    out[0] = v[1];
    out[1] = -1 * v[0];
  } else {
    out[0] = -1 * v[1];
    out[1] = v[0];
  }

  return out;
};

module.exports = vec2;
