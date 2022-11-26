'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueRef = require('vue-ref');

var _vueRef2 = _interopRequireDefault(_vueRef);

var _antInputDirective = require('./antInputDirective');

var _FormDecoratorDirective = require('./FormDecoratorDirective');

var _portalDirective = require('./portalDirective');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  install: function install(Vue) {
    Vue.use(_vueRef2['default'], { name: 'ant-ref' });
    (0, _antInputDirective.antInput)(Vue);
    (0, _FormDecoratorDirective.antDecorator)(Vue);
    (0, _portalDirective.antPortal)(Vue);
  }
};