'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Tooltip = require('./Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* istanbul ignore next */
_Tooltip2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Tooltip2['default'].name, _Tooltip2['default']);
};

exports['default'] = _Tooltip2['default'];