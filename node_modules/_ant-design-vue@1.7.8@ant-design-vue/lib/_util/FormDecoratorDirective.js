'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.antDecorator = antDecorator;
function antDecorator(Vue) {
  return Vue.directive('decorator', {});
}

exports['default'] = {
  // just for tag
  install: function install(Vue) {
    antDecorator(Vue);
  }
};