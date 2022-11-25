"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vec4 = exports.vec3 = exports.vec2 = exports.quat2 = exports.quat = exports.mat4 = exports.mat3 = exports.mat2d = exports.mat2 = exports.glMatrix = undefined;

var _common = require("./gl-matrix/common.js");

var glMatrix = _interopRequireWildcard(_common);

var _mat = require("./gl-matrix/mat2.js");

var mat2 = _interopRequireWildcard(_mat);

var _mat2d = require("./gl-matrix/mat2d.js");

var mat2d = _interopRequireWildcard(_mat2d);

var _mat2 = require("./gl-matrix/mat3.js");

var mat3 = _interopRequireWildcard(_mat2);

var _mat3 = require("./gl-matrix/mat4.js");

var mat4 = _interopRequireWildcard(_mat3);

var _quat = require("./gl-matrix/quat.js");

var quat = _interopRequireWildcard(_quat);

var _quat2 = require("./gl-matrix/quat2.js");

var quat2 = _interopRequireWildcard(_quat2);

var _vec = require("./gl-matrix/vec2.js");

var vec2 = _interopRequireWildcard(_vec);

var _vec2 = require("./gl-matrix/vec3.js");

var vec3 = _interopRequireWildcard(_vec2);

var _vec3 = require("./gl-matrix/vec4.js");

var vec4 = _interopRequireWildcard(_vec3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.glMatrix = glMatrix;
exports.mat2 = mat2;
exports.mat2d = mat2d;
exports.mat3 = mat3;
exports.mat4 = mat4;
exports.quat = quat;
exports.quat2 = quat2;
exports.vec2 = vec2;
exports.vec3 = vec3;
exports.vec4 = vec4;