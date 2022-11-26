'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports['default'] = createBodyRow;

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var BodyRowProps = {
  store: _vueTypes2['default'].any,
  rowKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  prefixCls: _vueTypes2['default'].string
};

function createBodyRow() {
  var Component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'tr';

  var BodyRow = {
    name: 'BodyRow',
    props: BodyRowProps,
    computed: {
      selected: function selected() {
        return this.$props.store.selectedRowKeys.indexOf(this.$props.rowKey) >= 0;
      }
    },
    render: function render() {
      var h = arguments[0];

      var className = (0, _defineProperty3['default'])({}, this.prefixCls + '-row-selected', this.selected);

      return h(
        Component,
        (0, _babelHelperVueJsxMergeProps2['default'])([{ 'class': className }, { on: (0, _propsUtil.getListeners)(this) }]),
        [this.$slots['default']]
      );
    }
  };

  return BodyRow;
}