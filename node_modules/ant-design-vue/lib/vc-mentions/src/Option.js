'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptionProps = undefined;

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var OptionProps = exports.OptionProps = {
  value: _vueTypes2['default'].string,
  disabled: _vueTypes2['default'].boolean,
  children: _vueTypes2['default'].any
};

exports['default'] = {
  name: 'Option',
  props: OptionProps,
  render: function render() {
    return null;
  }
};