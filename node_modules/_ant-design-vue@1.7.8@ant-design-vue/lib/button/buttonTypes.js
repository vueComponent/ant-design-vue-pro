'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = function () {
  return {
    prefixCls: _vueTypes2['default'].string,
    type: _vueTypes2['default'].string,
    htmlType: _vueTypes2['default'].oneOf(['button', 'submit', 'reset']).def('button'),
    icon: _vueTypes2['default'].any,
    shape: _vueTypes2['default'].oneOf(['circle', 'circle-outline', 'round']),
    size: _vueTypes2['default'].oneOf(['small', 'large', 'default']).def('default'),
    loading: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].object]),
    disabled: _vueTypes2['default'].bool,
    ghost: _vueTypes2['default'].bool,
    block: _vueTypes2['default'].bool
  };
};