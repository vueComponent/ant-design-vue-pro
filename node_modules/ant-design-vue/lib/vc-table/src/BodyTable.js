'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _utils = require('./utils');

var _BaseTable = require('./BaseTable');

var _BaseTable2 = _interopRequireDefault(_BaseTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'BodyTable',
  props: {
    fixed: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].bool]),
    columns: _vueTypes2['default'].array.isRequired,
    tableClassName: _vueTypes2['default'].string.isRequired,
    handleBodyScroll: _vueTypes2['default'].func.isRequired,
    handleWheel: _vueTypes2['default'].func.isRequired,
    getRowKey: _vueTypes2['default'].func.isRequired,
    expander: _vueTypes2['default'].object.isRequired,
    isAnyColumnsFixed: _vueTypes2['default'].bool
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

    var bodyStyle = (0, _extends3['default'])({}, this.table.bodyStyle);
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
      var scrollbarWidth = (0, _utils.measureScrollbar)({ direction: 'vertical' });
      if (scrollbarWidth > 0 && fixed) {
        bodyStyle.marginBottom = '-' + scrollbarWidth + 'px';
        bodyStyle.paddingBottom = '0px';
      }
    }

    var baseTable = h(_BaseTable2['default'], {
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
        { key: 'bodyTable', 'class': prefixCls + '-body-outer', style: (0, _extends3['default'])({}, bodyStyle) },
        [h(
          'div',
          (0, _babelHelperVueJsxMergeProps2['default'])([{
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
      (0, _babelHelperVueJsxMergeProps2['default'])([{
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