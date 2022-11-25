'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'Column',
  props: {
    rowSpan: _vueTypes2['default'].number,
    colSpan: _vueTypes2['default'].number,
    title: _vueTypes2['default'].any,
    dataIndex: _vueTypes2['default'].string,
    width: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]),
    ellipsis: _vueTypes2['default'].bool,
    fixed: _vueTypes2['default'].oneOf([true, 'left', 'right']),
    align: _vueTypes2['default'].oneOf(['left', 'center', 'right']),
    customRender: _vueTypes2['default'].func,
    className: _vueTypes2['default'].string,
    // onCellClick: PropTypes.func,
    customCell: _vueTypes2['default'].func,
    customHeaderCell: _vueTypes2['default'].func
  }
};