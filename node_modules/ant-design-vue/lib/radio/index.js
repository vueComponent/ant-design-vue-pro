'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Group = exports.Button = undefined;

var _Radio = require('./Radio');

var _Radio2 = _interopRequireDefault(_Radio);

var _Group = require('./Group');

var _Group2 = _interopRequireDefault(_Group);

var _RadioButton = require('./RadioButton');

var _RadioButton2 = _interopRequireDefault(_RadioButton);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Radio2['default'].Group = _Group2['default'];
_Radio2['default'].Button = _RadioButton2['default'];

/* istanbul ignore next */
_Radio2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Radio2['default'].name, _Radio2['default']);
  Vue.component(_Radio2['default'].Group.name, _Radio2['default'].Group);
  Vue.component(_Radio2['default'].Button.name, _Radio2['default'].Button);
};

exports.Button = _RadioButton2['default'];
exports.Group = _Group2['default'];
exports['default'] = _Radio2['default'];