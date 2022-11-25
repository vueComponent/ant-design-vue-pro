'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownButtonProps = exports.DropdownProps = undefined;

var _dropdown = require('./dropdown');

Object.defineProperty(exports, 'DropdownProps', {
  enumerable: true,
  get: function get() {
    return _dropdown.DropdownProps;
  }
});

var _dropdownButton = require('./dropdown-button');

Object.defineProperty(exports, 'DropdownButtonProps', {
  enumerable: true,
  get: function get() {
    return _dropdownButton.DropdownButtonProps;
  }
});

var _dropdown2 = _interopRequireDefault(_dropdown);

var _dropdownButton2 = _interopRequireDefault(_dropdownButton);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_dropdown2['default'].Button = _dropdownButton2['default'];

/* istanbul ignore next */
_dropdown2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_dropdown2['default'].name, _dropdown2['default']);
  Vue.component(_dropdownButton2['default'].name, _dropdownButton2['default']);
};

exports['default'] = _dropdown2['default'];