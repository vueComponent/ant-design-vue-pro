'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _utils = require('./utils');

var _BaseTable = require('./BaseTable');

var _BaseTable2 = _interopRequireDefault(_BaseTable);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'HeadTable',
  props: {
    fixed: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].bool]),
    columns: _vueTypes2['default'].array.isRequired,
    tableClassName: _vueTypes2['default'].string.isRequired,
    handleBodyScrollLeft: _vueTypes2['default'].func.isRequired,
    expander: _vueTypes2['default'].object.isRequired
  },
  inject: {
    table: { 'default': function _default() {
        return {};
      } }
  },
  render: function render() {
    var h = arguments[0];
    var columns = this.columns,
        fixed = this.fixed,
        tableClassName = this.tableClassName,
        handleBodyScrollLeft = this.handleBodyScrollLeft,
        expander = this.expander,
        table = this.table;
    var prefixCls = table.prefixCls,
        scroll = table.scroll,
        showHeader = table.showHeader,
        saveRef = table.saveRef;
    var useFixedHeader = table.useFixedHeader;

    var headStyle = {};

    var scrollbarWidth = (0, _utils.measureScrollbar)({ direction: 'vertical' });

    if (scroll.y) {
      useFixedHeader = true;
      // https://github.com/ant-design/ant-design/issues/17051
      var scrollbarWidthOfHeader = (0, _utils.measureScrollbar)({ direction: 'horizontal', prefixCls: prefixCls });
      // Add negative margin bottom for scroll bar overflow bug
      if (scrollbarWidthOfHeader > 0 && !fixed) {
        headStyle.marginBottom = '-' + scrollbarWidthOfHeader + 'px';
        headStyle.paddingBottom = '0px';
        // https://github.com/ant-design/ant-design/pull/19986
        headStyle.minWidth = scrollbarWidth + 'px';
        // https://github.com/ant-design/ant-design/issues/17051
        headStyle.overflowX = 'scroll';
        headStyle.overflowY = scrollbarWidth === 0 ? 'hidden' : 'scroll';
      }
    }

    if (!useFixedHeader || !showHeader) {
      return null;
    }
    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([{
        key: 'headTable'
      }, {
        directives: [{
          name: 'ant-ref',
          value: fixed ? function () {} : saveRef('headTable')
        }]
      }, {
        'class': (0, _classnames2['default'])(prefixCls + '-header', (0, _defineProperty3['default'])({}, prefixCls + '-hide-scrollbar', scrollbarWidth > 0)),
        style: headStyle,
        on: {
          'scroll': handleBodyScrollLeft
        }
      }]),
      [h(_BaseTable2['default'], {
        attrs: {
          tableClassName: tableClassName,
          hasHead: true,
          hasBody: false,
          fixed: fixed,
          columns: columns,
          expander: expander
        }
      })]
    );
  }
};