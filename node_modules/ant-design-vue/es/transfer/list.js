import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { isValidElement, initDefaultProps, getListeners } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import Checkbox from '../checkbox';
import Search from './search';
import defaultRenderList from './renderListBody';
import triggerEvent from '../_util/triggerEvent';
import addEventListener from '../vc-util/Dom/addEventListener';

var defaultRender = function defaultRender() {
  return null;
};

var TransferItem = {
  key: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  disabled: PropTypes.bool
};

function isRenderResultPlainObject(result) {
  return result && !isValidElement(result) && Object.prototype.toString.call(result) === '[object Object]';
}

export var TransferListProps = {
  prefixCls: PropTypes.string,
  titleText: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.shape(TransferItem).loose),
  filter: PropTypes.string,
  filterOption: PropTypes.func,
  checkedKeys: PropTypes.arrayOf(PropTypes.string),
  handleFilter: PropTypes.func,
  handleSelect: PropTypes.func,
  handleSelectAll: PropTypes.func,
  handleClear: PropTypes.func,
  renderItem: PropTypes.func,
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.any,
  itemUnit: PropTypes.string,
  itemsUnit: PropTypes.string,
  body: PropTypes.any,
  renderList: PropTypes.any,
  footer: PropTypes.any,
  lazy: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  disabled: PropTypes.bool,
  direction: PropTypes.string,
  showSelectAll: PropTypes.bool
};

function renderListNode(h, renderList, props) {
  var bodyContent = renderList ? renderList(props) : null;
  var customize = !!bodyContent;
  if (!customize) {
    bodyContent = defaultRenderList(h, props);
  }
  return {
    customize: customize,
    bodyContent: bodyContent
  };
}

export default {
  name: 'TransferList',
  mixins: [BaseMixin],
  props: initDefaultProps(TransferListProps, {
    dataSource: [],
    titleText: '',
    showSearch: false,
    lazy: {}
  }),
  data: function data() {
    this.timer = null;
    this.triggerScrollTimer = null;
    return {
      filterValue: ''
    };
  },

  // mounted() {
  //   this.timer = setTimeout(() => {
  //     this.setState({
  //       mounted: true,
  //     });
  //   }, 0);
  //   this.$nextTick(() => {
  //     if (this.$refs.listContentWrapper) {
  //       const listContentWrapperDom = this.$refs.listContentWrapper.$el;
  //       this.scrollEvent = addEventListener(listContentWrapperDom, 'scroll', this.handleScroll);
  //     }
  //   });
  // },
  beforeDestroy: function beforeDestroy() {
    clearTimeout(this.triggerScrollTimer);
    // if (this.scrollEvent) {
    //   this.scrollEvent.remove();
    // }
  },
  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.scrollEvent) {
        _this.scrollEvent.remove();
      }
      if (_this.$refs.listContentWrapper) {
        var listContentWrapperDom = _this.$refs.listContentWrapper.$el;
        _this.scrollEvent = addEventListener(listContentWrapperDom, 'scroll', _this.handleScroll);
      }
    });
  },

  methods: {
    handleScroll: function handleScroll(e) {
      this.$emit('scroll', e);
    },
    getCheckStatus: function getCheckStatus(filteredItems) {
      var checkedKeys = this.$props.checkedKeys;

      if (checkedKeys.length === 0) {
        return 'none';
      }
      if (filteredItems.every(function (item) {
        return checkedKeys.indexOf(item.key) >= 0 || !!item.disabled;
      })) {
        return 'all';
      }
      return 'part';
    },
    getFilteredItems: function getFilteredItems(dataSource, filterValue) {
      var _this2 = this;

      var filteredItems = [];
      var filteredRenderItems = [];

      dataSource.forEach(function (item) {
        var renderedItem = _this2.renderItemHtml(item);
        var renderedText = renderedItem.renderedText;

        // Filter skip

        if (filterValue && filterValue.trim() && !_this2.matchFilter(renderedText, item)) {
          return null;
        }

        filteredItems.push(item);
        filteredRenderItems.push(renderedItem);
      });

      return { filteredItems: filteredItems, filteredRenderItems: filteredRenderItems };
    },
    getListBody: function getListBody(prefixCls, searchPlaceholder, filterValue, filteredItems, notFoundContent, bodyDom, filteredRenderItems, checkedKeys, renderList, showSearch, disabled) {
      var h = this.$createElement;

      var search = showSearch ? h(
        'div',
        { 'class': prefixCls + '-body-search-wrapper' },
        [h(Search, {
          attrs: {
            prefixCls: prefixCls + '-search',

            handleClear: this._handleClear,
            placeholder: searchPlaceholder,
            value: filterValue,
            disabled: disabled
          },
          on: {
            'change': this._handleFilter
          }
        })]
      ) : null;

      var listBody = bodyDom;
      if (!listBody) {
        var bodyNode = void 0;

        var _renderListNode = renderListNode(this.$createElement, renderList, {
          props: _extends({}, this.$props, { filteredItems: filteredItems, filteredRenderItems: filteredRenderItems, selectedKeys: checkedKeys }),
          on: getListeners(this)
        }),
            bodyContent = _renderListNode.bodyContent,
            customize = _renderListNode.customize;

        // We should wrap customize list body in a classNamed div to use flex layout.


        if (customize) {
          bodyNode = h(
            'div',
            { 'class': prefixCls + '-body-customize-wrapper' },
            [bodyContent]
          );
        } else {
          bodyNode = filteredItems.length ? bodyContent : h(
            'div',
            { 'class': prefixCls + '-body-not-found' },
            [notFoundContent]
          );
        }

        listBody = h(
          'div',
          {
            'class': classNames(showSearch ? prefixCls + '-body ' + prefixCls + '-body-with-search' : prefixCls + '-body')
          },
          [search, bodyNode]
        );
      }
      return listBody;
    },
    getCheckBox: function getCheckBox(filteredItems, showSelectAll, disabled) {
      var _this3 = this;

      var h = this.$createElement;

      var checkStatus = this.getCheckStatus(filteredItems);
      var checkedAll = checkStatus === 'all';
      var checkAllCheckbox = showSelectAll !== false && h(Checkbox, {
        attrs: {
          disabled: disabled,
          checked: checkedAll,
          indeterminate: checkStatus === 'part'
        },
        on: {
          'change': function change() {
            // Only select enabled items
            _this3.$emit('itemSelectAll', filteredItems.filter(function (item) {
              return !item.disabled;
            }).map(function (_ref) {
              var key = _ref.key;
              return key;
            }), !checkedAll);
          }
        }
      });

      return checkAllCheckbox;
    },
    _handleSelect: function _handleSelect(selectedItem) {
      var checkedKeys = this.$props.checkedKeys;

      var result = checkedKeys.some(function (key) {
        return key === selectedItem.key;
      });
      this.handleSelect(selectedItem, !result);
    },
    _handleFilter: function _handleFilter(e) {
      var _this4 = this;

      var handleFilter = this.$props.handleFilter;
      var filterValue = e.target.value;

      this.setState({ filterValue: filterValue });
      handleFilter(e);
      if (!filterValue) {
        return;
      }
      // Manually trigger scroll event for lazy search bug
      // https://github.com/ant-design/ant-design/issues/5631
      this.triggerScrollTimer = setTimeout(function () {
        var transferNode = _this4.$el;
        var listNode = transferNode.querySelectorAll('.ant-transfer-list-content')[0];
        if (listNode) {
          triggerEvent(listNode, 'scroll');
        }
      }, 0);
    },
    _handleClear: function _handleClear(e) {
      this.setState({ filterValue: '' });
      this.handleClear(e);
    },
    matchFilter: function matchFilter(text, item) {
      var filterValue = this.$data.filterValue;
      var filterOption = this.$props.filterOption;

      if (filterOption) {
        return filterOption(filterValue, item);
      }
      return text.indexOf(filterValue) >= 0;
    },
    renderItemHtml: function renderItemHtml(item) {
      var _$props$renderItem = this.$props.renderItem,
          renderItem = _$props$renderItem === undefined ? defaultRender : _$props$renderItem;

      var renderResult = renderItem(item);
      var isRenderResultPlain = isRenderResultPlainObject(renderResult);
      return {
        renderedText: isRenderResultPlain ? renderResult.value : renderResult,
        renderedEl: isRenderResultPlain ? renderResult.label : renderResult,
        item: item
      };
    },
    filterNull: function filterNull(arr) {
      return arr.filter(function (item) {
        return item !== null;
      });
    }
  },

  render: function render() {
    var h = arguments[0];
    var filterValue = this.$data.filterValue;
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        dataSource = _$props.dataSource,
        titleText = _$props.titleText,
        checkedKeys = _$props.checkedKeys,
        disabled = _$props.disabled,
        body = _$props.body,
        footer = _$props.footer,
        showSearch = _$props.showSearch,
        searchPlaceholder = _$props.searchPlaceholder,
        notFoundContent = _$props.notFoundContent,
        itemUnit = _$props.itemUnit,
        itemsUnit = _$props.itemsUnit,
        renderList = _$props.renderList,
        showSelectAll = _$props.showSelectAll;

    // Custom Layout

    var footerDom = footer && footer(_extends({}, this.$props));
    var bodyDom = body && body(_extends({}, this.$props));

    var listCls = classNames(prefixCls, _defineProperty({}, prefixCls + '-with-footer', !!footerDom));

    // ====================== Get filtered, checked item list ======================

    var _getFilteredItems = this.getFilteredItems(dataSource, filterValue),
        filteredItems = _getFilteredItems.filteredItems,
        filteredRenderItems = _getFilteredItems.filteredRenderItems;

    // ================================= List Body =================================

    var unit = dataSource.length > 1 ? itemsUnit : itemUnit;

    var listBody = this.getListBody(prefixCls, searchPlaceholder, filterValue, filteredItems, notFoundContent, bodyDom, filteredRenderItems, checkedKeys, renderList, showSearch, disabled);

    var listFooter = footerDom ? h(
      'div',
      { 'class': prefixCls + '-footer' },
      [footerDom]
    ) : null;

    var checkAllCheckbox = this.getCheckBox(filteredItems, showSelectAll, disabled);

    return h(
      'div',
      { 'class': listCls },
      [h(
        'div',
        { 'class': prefixCls + '-header' },
        [checkAllCheckbox, h(
          'span',
          { 'class': prefixCls + '-header-selected' },
          [h('span', [(checkedKeys.length > 0 ? checkedKeys.length + '/' : '') + filteredItems.length, ' ', unit]), h(
            'span',
            { 'class': prefixCls + '-header-title' },
            [titleText]
          )]
        )]
      ), listBody, listFooter]
    );
  }
};