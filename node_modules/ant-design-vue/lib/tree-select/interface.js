'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeSelectProps = exports.TreeData = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _select = require('../select');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TreeData = exports.TreeData = _vueTypes2['default'].shape({
  key: _vueTypes2['default'].string,
  value: _vueTypes2['default'].string,
  label: _vueTypes2['default'].any,
  scopedSlots: _vueTypes2['default'].object,
  children: _vueTypes2['default'].array
}).loose;

var TreeSelectProps = exports.TreeSelectProps = function TreeSelectProps() {
  return (0, _extends3['default'])({}, (0, _select.AbstractSelectProps)(), {
    autoFocus: _vueTypes2['default'].bool,
    dropdownStyle: _vueTypes2['default'].object,
    filterTreeNode: _vueTypes2['default'].oneOfType([Function, Boolean]),
    getPopupContainer: _vueTypes2['default'].func,
    labelInValue: _vueTypes2['default'].bool,
    loadData: _vueTypes2['default'].func,
    maxTagCount: _vueTypes2['default'].number,
    maxTagPlaceholder: _vueTypes2['default'].any,
    value: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object, _vueTypes2['default'].array, _vueTypes2['default'].number]),
    defaultValue: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object, _vueTypes2['default'].array, _vueTypes2['default'].number]),
    multiple: _vueTypes2['default'].bool,
    notFoundContent: _vueTypes2['default'].any,
    // onSelect: (value: any) => void,
    // onChange: (value: any, label: any) => void,
    // onSearch: (value: any) => void,
    searchPlaceholder: _vueTypes2['default'].string,
    searchValue: _vueTypes2['default'].string,
    showCheckedStrategy: _vueTypes2['default'].oneOf(['SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD']),
    suffixIcon: _vueTypes2['default'].any,
    treeCheckable: _vueTypes2['default'].oneOfType([_vueTypes2['default'].any, _vueTypes2['default'].bool]),
    treeCheckStrictly: _vueTypes2['default'].bool,
    treeData: _vueTypes2['default'].arrayOf(Object),
    treeDataSimpleMode: _vueTypes2['default'].oneOfType([Boolean, Object]),

    dropdownClassName: _vueTypes2['default'].string,
    dropdownMatchSelectWidth: _vueTypes2['default'].bool,
    treeDefaultExpandAll: _vueTypes2['default'].bool,
    treeExpandedKeys: _vueTypes2['default'].array,
    treeIcon: _vueTypes2['default'].bool,
    treeDefaultExpandedKeys: _vueTypes2['default'].array,
    treeNodeFilterProp: _vueTypes2['default'].string,
    treeNodeLabelProp: _vueTypes2['default'].string,
    replaceFields: _vueTypes2['default'].object.def({})
  });
};