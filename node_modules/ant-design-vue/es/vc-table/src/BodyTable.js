import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';

export default {
  name: 'BodyTable',
  props: {
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    handleBodyScroll: PropTypes.func.isRequired,
    handleWheel: PropTypes.func.isRequired,
    getRowKey: PropTypes.func.isRequired,
    expander: PropTypes.object.isRequired,
    isAnyColumnsFixed: PropTypes.bool
  },
  inject: {
    table: { 'default': function _default() {
        return {};
      } }
  },
  render: function render() {
    var h = arguments[0];
    var _table = this.table,
        prefixCls = _table.prefixCls,
        scroll = _table.scroll;
    var columns = this.columns,
        fixed = this.fixed,
        tableClassName = this.tableClassName,
        getRowKey = this.getRowKey,
        handleBodyScroll = this.handleBodyScroll,
        handleWheel = this.handleWheel,
        expander = this.expander,
        isAnyColumnsFixed = this.isAnyColumnsFixed;
    var _table2 = this.table,
        useFixedHeader = _table2.useFixedHeader,
        saveRef = _table2.saveRef;

    var bodyStyle = _extends({}, this.table.bodyStyle);
    var innerBodyStyle = {};

    if (scroll.x || fixed) {
      bodyStyle.overflowX = bodyStyle.overflowX || 'scroll';
      // Fix weired webkit render bug
      // https://github.com/ant-design/ant-design/issues/7783
      bodyStyle.WebkitTransform = 'translate3d (0, 0, 0)';
    }

    if (scroll.y) {
      // maxHeight will make fixed-Table scrolling not working
      // so we only set maxHeight to body-Table here
      var maxHeight = bodyStyle.maxHeight || scroll.y;
      maxHeight = typeof maxHeight === 'number' ? maxHeight + 'px' : maxHeight;
      if (fixed) {
        innerBodyStyle.maxHeight = maxHeight;
        innerBodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
      } else {
        bodyStyle.maxHeight = maxHeight;
      }
      bodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
      useFixedHeader = true;

      // Add negative margin bottom for scroll bar overflow bug
      var scrollbarWidth = measureScrollbar({ direction: 'vertical' });
      if (scrollbarWidth > 0 && fixed) {
        bodyStyle.marginBottom = '-' + scrollbarWidth + 'px';
        bodyStyle.paddingBottom = '0px';
      }
    }

    var baseTable = h(BaseTable, {
      attrs: {
        tableClassName: tableClassName,
        hasHead: !useFixedHeader,
        hasBody: true,
        fixed: fixed,
        columns: columns,
        expander: expander,
        getRowKey: getRowKey,
        isAnyColumnsFixed: isAnyColumnsFixed
      }
    });

    if (fixed && columns.length) {
      var refName = void 0;
      if (columns[0].fixed === 'left' || columns[0].fixed === true) {
        refName = 'fixedColumnsBodyLeft';
      } else if (columns[0].fixed === 'right') {
        refName = 'fixedColumnsBodyRight';
      }
      delete bodyStyle.overflowX;
      delete bodyStyle.overflowY;
      return h(
        'div',
        { key: 'bodyTable', 'class': prefixCls + '-body-outer', style: _extends({}, bodyStyle) },
        [h(
          'div',
          _mergeJSXProps([{
            'class': prefixCls + '-body-inner',
            style: innerBodyStyle
          }, {
            directives: [{
              name: 'ant-ref',
              value: saveRef(refName)
            }]
          }, {
            on: {
              'wheel': handleWheel,
              'scroll': handleBodyScroll
            }
          }]),
          [baseTable]
        )]
      );
    }
    // Should provides `tabIndex` if use scroll to enable keyboard scroll
    var useTabIndex = scroll && (scroll.x || scroll.y);

    return h(
      'div',
      _mergeJSXProps([{
        attrs: {
          tabIndex: useTabIndex ? -1 : undefined
        },
        key: 'bodyTable',
        'class': prefixCls + '-body',
        style: bodyStyle
      }, {
        directives: [{
          name: 'ant-ref',
          value: saveRef('bodyTable')
        }]
      }, {
        on: {
          'wheel': handleWheel,
          'scroll': handleBodyScroll
        }
      }]),
      [baseTable]
    );
  }
};