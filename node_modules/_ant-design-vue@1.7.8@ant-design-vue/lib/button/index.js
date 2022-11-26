'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

var _buttonGroup = require('./button-group');

var _buttonGroup2 = _interopRequireDefault(_buttonGroup);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_button2['default'].Group = _buttonGroup2['default'];

/* istanbul ignore next */
_button2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_button2['default'].name, _button2['default']);
  Vue.component(_buttonGroup2['default'].name, _buttonGroup2['default']);
};

exports['default'] = _button2['default'];