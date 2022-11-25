"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("@antv/g2");

var Slider = require('@antv/g2-plugin-slider');

var _default = function _default(config) {
  var container = document.getElementById(config.container);

  if (!container) {
    console.error('plugin slider container not defined');
    return;
  }

  container.innerHTML = '';
  var sliderInstance = new Slider(config);
  sliderInstance.render();
  return sliderInstance;
};

exports.default = _default;