'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ATableColumnGroup',
  props: {
    fixed: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].oneOf(['left', 'right'])]),
    title: _vueTypes2['default'].any
  },
  __ANT_TABLE_COLUMN_GROUP: true
};