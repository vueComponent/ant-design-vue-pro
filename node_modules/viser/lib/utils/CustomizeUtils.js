"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAnimation = exports.registerShape = void 0;

var G2 = require('@antv/g2');

var registerShape = function registerShape(geoName, shapeName, shapeFun) {
  G2.Shape.registerShape(geoName, shapeName, shapeFun);
};

exports.registerShape = registerShape;

var registerAnimation = function registerAnimation(animationType, animationName, animationFun) {
  G2.Animate.registerAnimation(animationType, animationName, animationFun);
};

exports.registerAnimation = registerAnimation;