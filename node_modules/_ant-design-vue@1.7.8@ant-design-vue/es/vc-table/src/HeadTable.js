import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../../_util/vue-types';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';
import classNames from 'classnames';

export default {
  name: 'HeadTable',
  props: {
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    handleBodyScrollLeft: PropTypes.func.isRequired,
    expander: PropTypes.object.isRequired
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

    var scrollbarWidth = measureScrollbar({ direction: 'vertical' });

    if (scroll.y) {
      useFixedHeader = true;
      // https://github.com/ant-design/ant-design/issues/17051
      var scrollbarWidthOfHeader = measureScrollbar({ direction: 'horizontal', prefixCls: prefixCls });
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
      _mergeJSXProps([{
        key: 'headTable'
      }, {
        directives: [{
          name: 'ant-ref',
          value: fixed ? function () {} : saveRef('headTable')
        }]
      }, {
        'class': classNames(prefixCls + '-header', _defineProperty({}, prefixCls + '-hide-scrollbar', scrollbarWidth > 0)),
        style: headStyle,
        on: {
          'scroll': handleBodyScrollLeft
        }
      }]),
      [h(BaseTable, {
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