'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  prefixCls: _vueTypes2['default'].string,
  inputPrefixCls: _vueTypes2['default'].string,
  defaultValue: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  value: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  placeholder: [String, Number],
  type: {
    'default': 'text',
    type: String
  },
  name: String,
  size: _vueTypes2['default'].oneOf(['small', 'large', 'default']),
  disabled: _vueTypes2['default'].bool,
  readOnly: _vueTypes2['default'].bool,
  addonBefore: _vueTypes2['default'].any,
  addonAfter: _vueTypes2['default'].any,
  // onPressEnter?: React.FormEventHandler<any>;
  // onKeyDown?: React.FormEventHandler<any>;
  // onChange?: React.ChangeEventHandler<HTMLInputElement>;
  // onClick?: React.FormEventHandler<any>;
  // onFocus?: React.FormEventHandler<any>;
  // onBlur?: React.FormEventHandler<any>;
  prefix: _vueTypes2['default'].any,
  suffix: _vueTypes2['default'].any,
  // spellCheck: Boolean,
  autoFocus: Boolean,
  allowClear: Boolean,
  lazy: {
    'default': true,
    type: Boolean
  },
  maxLength: _vueTypes2['default'].number,
  loading: _vueTypes2['default'].bool,
  className: _vueTypes2['default'].string
};