'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _antDirective = require('../_util/antDirective');

var _antDirective2 = _interopRequireDefault(_antDirective);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var base = {};
var install = function install(Vue) {
  base.Vue = Vue;
  Vue.use(_antDirective2['default']);
};
base.install = install;

exports['default'] = base;