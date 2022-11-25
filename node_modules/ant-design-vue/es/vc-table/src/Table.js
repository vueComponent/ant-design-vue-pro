import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
/* eslint-disable camelcase */
import shallowequal from 'shallowequal';
import merge from 'lodash/merge';
import classes from 'component-classes';
import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import { debounce } from './utils';
import warning from '../../_util/warning';
import addEventListener from '../../vc-util/Dom/addEventListener';
import ColumnManager from './ColumnManager';
import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ExpandableTable from './ExpandableTable';
import { initDefaultProps, getOptionProps, getListeners } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import Vue from 'vue';

export default {
  name: 'Table',
  mixins: [BaseMixin],
  provide: function provide() {
    return { 'table-store': this.store, table: this };
  },

  props: initDefaultProps({
    data: PropTypes.array,
    useFixedHeader: PropTypes.bool,
    columns: PropTypes.array,
    prefixCls: PropTypes.string,
    bodyStyle: PropTypes.object,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    customRow: PropTypes.func,
    customHeaderRow: PropTypes.func,
    // onRowClick: PropTypes.func,
    // onRowDoubleClick: PropTypes.func,
    // onRowContextMenu: PropTypes.func,
    // onRowMouseEnter: PropTypes.func,
    // onRowMouseLeave: PropTypes.func,
    showHeader: PropTypes.bool,
    title: PropTypes.func,
    id: PropTypes.string,
    footer: PropTypes.func,
    emptyText: PropTypes.any,
    scroll: PropTypes.object,
    rowRef: PropTypes.func,
    getBodyWrapper: PropTypes.func,
    components: PropTypes.shape({
      table: PropTypes.any,
      header: PropTypes.shape({
        wrapper: PropTypes.any,
        row: PropTypes.any,
        cell: PropTypes.any
      }),
      body: PropTypes.shape({
        wrapper: PropTypes.any,
        row: PropTypes.any,
        cell: PropTypes.any
      })
    }),
    expandIconAsCell: PropTypes.bool,
    expandedRowKeys: PropTypes.array,
    expandedRowClassName: PropTypes.func,
    defaultExpandAllRows: PropTypes.bool,
    defaultExpandedRowKeys: PropTypes.array,
    expandIconColumnIndex: PropTypes.number,
    expandedRowRender: PropTypes.func,
    childrenColumnName: PropTypes.string,
    indentSize: PropTypes.number,
    expandRowByClick: PropTypes.bool,
    expandIcon: PropTypes.func,
    tableLayout: PropTypes.string,
    transformCellText: PropTypes.func
  }, {
    data: [],
    useFixedHeader: false,
    rowKey: 'key',
    rowClassName: function rowClassName() {
      return '';
    },
    prefixCls: 'rc-table',
    bodyStyle: {},
    showHeader: true,
    scroll: {},
    rowRef: function rowRef() {
      return null;
    },
    emptyText: function emptyText() {
      return 'No Data';
    },
    customHeaderRow: function customHeaderRow() {}
  }),
  data: function data() {
    this.preData = [].concat(_toConsumableArray(this.data));
    this.store = (this.$root.constructor.observable || Vue.observable)({
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: {},
      expandedRowsHeight: {},
      expandedRowKeys: []
    });
    return {
      columnManager: new ColumnManager(this.columns),
      sComponents: merge({
        table: 'table',
        header: {
          wrapper: 'thead',
          row: 'tr',
          cell: 'th'
        },
        body: {
          wrapper: 'tbody',
          row: 'tr',
          cell: 'td'
        }
      }, this.components)
    };
  },

  watch: {
    components: function components() {
      this._components = merge({
        table: 'table',
        header: {
          wrapper: 'thead',
          row: 'tr',
          cell: 'th'
        },
        body: {
          wrapper: 'tbody',
          row: 'tr',
          cell: 'td'
        }
      }, this.components);
    },
    columns: function columns(val) {
      if (val) {
        this.columnManager.reset(val);
      }
    },
    data: function data(val) {
      var _this = this;

      if (val.length === 0 && this.hasScrollX()) {
        this.$nextTick(function () {
          _this.resetScrollX();
        });
      }
    }
  },

  // static childContextTypes = {
  //   table: PropTypes.any,
  //   components: PropTypes.any,
  // },

  created: function created() {
    var _this2 = this;

    ['rowClick', 'rowDoubleclick', 'rowContextmenu', 'rowMouseenter', 'rowMouseleave'].forEach(function (name) {
      warning(getListeners(_this2)[name] === undefined, name + ' is deprecated, please use customRow instead.');
    });

    warning(this.getBodyWrapper === undefined, 'getBodyWrapper is deprecated, please use custom components instead.');

    this.setScrollPosition('left');

    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
  },
  mounted: function mounted() {
    var _this3 = this;

    this.$nextTick(function () {
      if (_this3.columnManager.isAnyColumnsFixed()) {
        _this3.handleWindowResize();
        _this3.resizeEvent = addEventListener(window, 'resize', _this3.debouncedWindowResize);
      }
      // https://github.com/ant-design/ant-design/issues/11635
      if (_this3.ref_headTable) {
        _this3.ref_headTable.scrollLeft = 0;
      }
      if (_this3.ref_bodyTable) {
        _this3.ref_bodyTable.scrollLeft = 0;
      }
    });
  },
  updated: function updated() {
    var _this4 = this;

    this.$nextTick(function () {
      if (_this4.columnManager.isAnyColumnsFixed()) {
        _this4.handleWindowResize();
        if (!_this4.resizeEvent) {
          _this4.resizeEvent = addEventListener(window, 'resize', _this4.debouncedWindowResize);
        }
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    if (this.debouncedWindowResize) {
      this.debouncedWindowResize.cancel();
    }
  },

  methods: {
    getRowKey: function getRowKey(record, index) {
      var rowKey = this.rowKey;
      var key = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
      warning(key !== undefined, 'Each record in table should have a unique `key` prop,' + 'or set `rowKey` to an unique primary key.');
      return key === undefined ? index : key;
    },
    setScrollPosition: function setScrollPosition(position) {
      this.scrollPosition = position;
      if (this.tableNode) {
        var prefixCls = this.prefixCls;

        if (position === 'both') {
          classes(this.tableNode).remove(new RegExp('^' + prefixCls + '-scroll-position-.+$')).add(prefixCls + '-scroll-position-left').add(prefixCls + '-scroll-position-right');
        } else {
          classes(this.tableNode).remove(new RegExp('^' + prefixCls + '-scroll-position-.+$')).add(prefixCls + '-scroll-position-' + position);
        }
      }
    },
    setScrollPositionClassName: function setScrollPositionClassName() {
      var node = this.ref_bodyTable;
      var scrollToLeft = node.scrollLeft === 0;
      var scrollToRight = node.scrollLeft + 1 >= node.children[0].getBoundingClientRect().width - node.getBoundingClientRect().width;
      if (scrollToLeft && scrollToRight) {
        this.setScrollPosition('both');
      } else if (scrollToLeft) {
        this.setScrollPosition('left');
      } else if (scrollToRight) {
        this.setScrollPosition('right');
      } else if (this.scrollPosition !== 'middle') {
        this.setScrollPosition('middle');
      }
    },
    isTableLayoutFixed: function isTableLayoutFixed() {
      var _$props = this.$props,
          tableLayout = _$props.tableLayout,
          _$props$columns = _$props.columns,
          columns = _$props$columns === undefined ? [] : _$props$columns,
          useFixedHeader = _$props.useFixedHeader,
          _$props$scroll = _$props.scroll,
          scroll = _$props$scroll === undefined ? {} : _$props$scroll;

      if (typeof tableLayout !== 'undefined') {
        return tableLayout === 'fixed';
      }
      // if one column is ellipsis, use fixed table layout to fix align issue
      if (columns.some(function (_ref) {
        var ellipsis = _ref.ellipsis;
        return !!ellipsis;
      })) {
        return true;
      }
      // if header fixed, use fixed table layout to fix align issue
      if (useFixedHeader || scroll.y) {
        return true;
      }
      // if scroll.x is number/px/% width value, we should fixed table layout
      // to avoid long word layout broken issue
      if (scroll.x && scroll.x !== true && scroll.x !== 'max-content') {
        return true;
      }
      return false;
    },
    handleWindowResize: function handleWindowResize() {
      this.syncFixedTableRowHeight();
      this.setScrollPositionClassName();
    },
    syncFixedTableRowHeight: function syncFixedTableRowHeight() {
      var tableRect = this.tableNode.getBoundingClientRect();
      // If tableNode's height less than 0, suppose it is hidden and don't recalculate rowHeight.
      // see: https://github.com/ant-design/ant-design/issues/4836
      if (tableRect.height !== undefined && tableRect.height <= 0) {
        return;
      }
      var prefixCls = this.prefixCls;

      var headRows = this.ref_headTable ? this.ref_headTable.querySelectorAll('thead') : this.ref_bodyTable.querySelectorAll('thead');
      var bodyRows = this.ref_bodyTable.querySelectorAll('.' + prefixCls + '-row') || [];
      var fixedColumnsHeadRowsHeight = [].map.call(headRows, function (row) {
        return row.getBoundingClientRect().height ? row.getBoundingClientRect().height - 0.5 : 'auto';
      });
      var state = this.store;
      var fixedColumnsBodyRowsHeight = [].reduce.call(bodyRows, function (acc, row) {
        var rowKey = row.getAttribute('data-row-key');
        var height = row.getBoundingClientRect().height || state.fixedColumnsBodyRowsHeight[rowKey] || 'auto';
        acc[rowKey] = height;
        return acc;
      }, {});
      if (shallowequal(state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) && shallowequal(state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)) {
        return;
      }
      this.store.fixedColumnsHeadRowsHeight = fixedColumnsHeadRowsHeight;
      this.store.fixedColumnsBodyRowsHeight = fixedColumnsBodyRowsHeight;
    },
    resetScrollX: function resetScrollX() {
      if (this.ref_headTable) {
        this.ref_headTable.scrollLeft = 0;
      }
      if (this.ref_bodyTable) {
        this.ref_bodyTable.scrollLeft = 0;
      }
    },
    hasScrollX: function hasScrollX() {
      var _scroll = this.scroll,
          scroll = _scroll === undefined ? {} : _scroll;

      return 'x' in scroll;
    },
    handleBodyScrollLeft: function handleBodyScrollLeft(e) {
      // Fix https://github.com/ant-design/ant-design/issues/7635
      if (e.currentTarget !== e.target) {
        return;
      }
      var target = e.target;
      var _scroll2 = this.scroll,
          scroll = _scroll2 === undefined ? {} : _scroll2;
      var ref_headTable = this.ref_headTable,
          ref_bodyTable = this.ref_bodyTable;

      if (target.scrollLeft !== this.lastScrollLeft && scroll.x) {
        if (target === ref_bodyTable && ref_headTable) {
          ref_headTable.scrollLeft = target.scrollLeft;
        } else if (target === ref_headTable && ref_bodyTable) {
          ref_bodyTable.scrollLeft = target.scrollLeft;
        }
        this.setScrollPositionClassName();
      }
      // Remember last scrollLeft for scroll direction detecting.
      this.lastScrollLeft = target.scrollLeft;
    },
    handleBodyScrollTop: function handleBodyScrollTop(e) {
      var target = e.target;
      // Fix https://github.com/ant-design/ant-design/issues/9033
      if (e.currentTarget !== target) {
        return;
      }
      var _scroll3 = this.scroll,
          scroll = _scroll3 === undefined ? {} : _scroll3;
      var ref_headTable = this.ref_headTable,
          ref_bodyTable = this.ref_bodyTable,
          ref_fixedColumnsBodyLeft = this.ref_fixedColumnsBodyLeft,
          ref_fixedColumnsBodyRight = this.ref_fixedColumnsBodyRight;

      if (target.scrollTop !== this.lastScrollTop && scroll.y && target !== ref_headTable) {
        var scrollTop = target.scrollTop;
        if (ref_fixedColumnsBodyLeft && target !== ref_fixedColumnsBodyLeft) {
          ref_fixedColumnsBodyLeft.scrollTop = scrollTop;
        }
        if (ref_fixedColumnsBodyRight && target !== ref_fixedColumnsBodyRight) {
          ref_fixedColumnsBodyRight.scrollTop = scrollTop;
        }
        if (ref_bodyTable && target !== ref_bodyTable) {
          ref_bodyTable.scrollTop = scrollTop;
        }
      }
      // Remember last scrollTop for scroll direction detecting.
      this.lastScrollTop = target.scrollTop;
    },
    handleBodyScroll: function handleBodyScroll(e) {
      this.handleBodyScrollLeft(e);
      this.handleBodyScrollTop(e);
    },
    handleWheel: function handleWheel(event) {
      var _$props$scroll2 = this.$props.scroll,
          scroll = _$props$scroll2 === undefined ? {} : _$props$scroll2;

      if (window.navigator.userAgent.match(/Trident\/7\./) && scroll.y) {
        event.preventDefault();
        var wd = event.deltaY;
        var target = event.target;
        var bodyTable = this.ref_bodyTable,
            fixedColumnsBodyLeft = this.ref_fixedColumnsBodyLeft,
            fixedColumnsBodyRight = this.ref_fixedColumnsBodyRight;

        var scrollTop = 0;

        if (this.lastScrollTop) {
          scrollTop = this.lastScrollTop + wd;
        } else {
          scrollTop = wd;
        }

        if (fixedColumnsBodyLeft && target !== fixedColumnsBodyLeft) {
          fixedColumnsBodyLeft.scrollTop = scrollTop;
        }
        if (fixedColumnsBodyRight && target !== fixedColumnsBodyRight) {
          fixedColumnsBodyRight.scrollTop = scrollTop;
        }
        if (bodyTable && target !== bodyTable) {
          bodyTable.scrollTop = scrollTop;
        }
      }
    },

    // saveChildrenRef(name, node) {
    //   this[`ref_${name}`] = node;
    // },
    saveRef: function saveRef(name) {
      var _this5 = this;

      return function (node) {
        _this5['ref_' + name] = node;
      };
    },
    saveTableNodeRef: function saveTableNodeRef(node) {
      this.tableNode = node;
    },
    renderMainTable: function renderMainTable() {
      var h = this.$createElement;
      var scroll = this.scroll,
          prefixCls = this.prefixCls;

      var isAnyColumnsFixed = this.columnManager.isAnyColumnsFixed();
      var scrollable = isAnyColumnsFixed || scroll.x || scroll.y;

      var table = [this.renderTable({
        columns: this.columnManager.groupedColumns(),
        isAnyColumnsFixed: isAnyColumnsFixed
      }), this.renderEmptyText(), this.renderFooter()];

      return scrollable ? h(
        'div',
        { 'class': prefixCls + '-scroll' },
        [table]
      ) : table;
    },
    renderLeftFixedTable: function renderLeftFixedTable() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls;


      return h(
        'div',
        { 'class': prefixCls + '-fixed-left' },
        [this.renderTable({
          columns: this.columnManager.leftColumns(),
          fixed: 'left'
        })]
      );
    },
    renderRightFixedTable: function renderRightFixedTable() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls;


      return h(
        'div',
        { 'class': prefixCls + '-fixed-right' },
        [this.renderTable({
          columns: this.columnManager.rightColumns(),
          fixed: 'right'
        })]
      );
    },
    renderTable: function renderTable(options) {
      var h = this.$createElement;
      var columns = options.columns,
          fixed = options.fixed,
          isAnyColumnsFixed = options.isAnyColumnsFixed;
      var prefixCls = this.prefixCls,
          _scroll4 = this.scroll,
          scroll = _scroll4 === undefined ? {} : _scroll4;

      var tableClassName = scroll.x || fixed ? prefixCls + '-fixed' : '';

      var headTable = h(HeadTable, {
        key: 'head',
        attrs: { columns: columns,
          fixed: fixed,
          tableClassName: tableClassName,
          handleBodyScrollLeft: this.handleBodyScrollLeft,
          expander: this.expander
        }
      });

      var bodyTable = h(BodyTable, {
        key: 'body',
        attrs: { columns: columns,
          fixed: fixed,
          tableClassName: tableClassName,
          getRowKey: this.getRowKey,
          handleWheel: this.handleWheel,
          handleBodyScroll: this.handleBodyScroll,
          expander: this.expander,
          isAnyColumnsFixed: isAnyColumnsFixed
        }
      });

      return [headTable, bodyTable];
    },
    renderTitle: function renderTitle() {
      var h = this.$createElement;
      var title = this.title,
          prefixCls = this.prefixCls,
          data = this.data;

      return title ? h(
        'div',
        { 'class': prefixCls + '-title', key: 'title' },
        [title(data)]
      ) : null;
    },
    renderFooter: function renderFooter() {
      var h = this.$createElement;
      var footer = this.footer,
          prefixCls = this.prefixCls,
          data = this.data;

      return footer ? h(
        'div',
        { 'class': prefixCls + '-footer', key: 'footer' },
        [footer(data)]
      ) : null;
    },
    renderEmptyText: function renderEmptyText() {
      var h = this.$createElement;
      var emptyText = this.emptyText,
          prefixCls = this.prefixCls,
          data = this.data;

      if (data.length) {
        return null;
      }
      var emptyClassName = prefixCls + '-placeholder';
      return h(
        'div',
        { 'class': emptyClassName, key: 'emptyText' },
        [typeof emptyText === 'function' ? emptyText() : emptyText]
      );
    }
  },

  render: function render() {
    var _classNames,
        _this6 = this;

    var h = arguments[0];

    var props = getOptionProps(this);
    var columnManager = this.columnManager,
        getRowKey = this.getRowKey;

    var prefixCls = props.prefixCls;

    var tableClassName = classNames(props.prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-fixed-header', props.useFixedHeader || props.scroll && props.scroll.y), _defineProperty(_classNames, prefixCls + '-scroll-position-left ' + prefixCls + '-scroll-position-right', this.scrollPosition === 'both'), _defineProperty(_classNames, prefixCls + '-scroll-position-' + this.scrollPosition, this.scrollPosition !== 'both'), _defineProperty(_classNames, prefixCls + '-layout-fixed', this.isTableLayoutFixed()), _classNames));

    var hasLeftFixed = columnManager.isAnyColumnsLeftFixed();
    var hasRightFixed = columnManager.isAnyColumnsRightFixed();

    var expandableTableProps = {
      props: _extends({}, props, {
        columnManager: columnManager,
        getRowKey: getRowKey
      }),
      on: getListeners(this),
      scopedSlots: {
        'default': function _default(expander) {
          _this6.expander = expander;
          return h(
            'div',
            _mergeJSXProps([{
              directives: [{
                name: 'ant-ref',
                value: _this6.saveTableNodeRef
              }]
            }, {
              'class': tableClassName
              // style={props.style}
              // id={props.id}
            }]),
            [_this6.renderTitle(), h(
              'div',
              { 'class': prefixCls + '-content' },
              [_this6.renderMainTable(), hasLeftFixed && _this6.renderLeftFixedTable(), hasRightFixed && _this6.renderRightFixedTable()]
            )]
          );
        }
      }
    };
    return h(ExpandableTable, expandableTableProps);
  }
};