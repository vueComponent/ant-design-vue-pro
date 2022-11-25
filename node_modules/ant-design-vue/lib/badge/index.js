'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Badge = require('./Badge');

var _Badge2 = _interopRequireDefault(_Badge);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* istanbul ignore next */
_Badge2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Badge2['default'].name, _Badge2['default']);
};

exports['default'] = _Badge2['default'];