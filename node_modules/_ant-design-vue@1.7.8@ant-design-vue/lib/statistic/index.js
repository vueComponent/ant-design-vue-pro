'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Statistic = require('./Statistic');

var _Statistic2 = _interopRequireDefault(_Statistic);

var _Countdown = require('./Countdown');

var _Countdown2 = _interopRequireDefault(_Countdown);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Statistic2['default'].Countdown = _Countdown2['default'];
/* istanbul ignore next */
_Statistic2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Statistic2['default'].name, _Statistic2['default']);
  Vue.component(_Statistic2['default'].Countdown.name, _Statistic2['default'].Countdown);
};

exports['default'] = _Statistic2['default'];