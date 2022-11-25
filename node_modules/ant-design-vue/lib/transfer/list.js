'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransferListProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _search = require('./search');

var _search2 = _interopRequireDefault(_search);

var _renderListBody = require('./renderListBody');

var _renderListBody2 = _interopRequireDefault(_renderListBody);

var _triggerEvent = require('../_util/triggerEvent');

var _triggerEvent2 = _interopRequireDefault(_triggerEvent);

var _addEventListener = require('../vc-util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var defaultRender = function defaultRender() {
  return null;
};

var TransferItem = {
  key: _vueTypes2['default'].string,
  title: _vueTypes2['default'].string,
  description: _vueTypes2['default'].string,
  disabled: _vueTypes2['default'].bool
};

function isRenderResultPlainObject(result) {
  return result && !(0, _propsUtil.isValidElement)(result) && Object.prototype.toString.call(result) === '[object Object]';
}

var TransferListProps = exports.TransferListProps = {
  prefixCls: _vueTypes2['default'].string,
  titleText: _vueTypes2['default'].string,
  dataSource: _vueTypes2['default'].arrayOf(_vueTypes2['default'].shape(TransferItem).loose),
  filter: _vueTypes2['default'].string,
  filterOption: _vueTypes2['default'].func,
  checkedKeys: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  handleFilter: _vueTypes2['default'].func,
  handleSelect: _vueTypes2['default'].func,
  handleSelectAll: _vueTypes2['default'].func,
  handleClear: _vueTypes2['default'].func,
  renderItem: _vueTypes2['default'].func,
  showSearch: _vueTypes2['default'].bool,
  searchPlaceholder: _vueTypes2['default'].string,
  notFoundContent: _vueTypes2['default'].any,
  itemUnit: _vueTypes2['default'].string,
  itemsUnit: _vueTypes2['default'].string,
  body: _vueTypes2['default'].any,
  renderList: _vueTypes2['default'].any,
  footer: _vueTypes2['default'].any,
  lazy: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].object]),
  disabled: _vueTypes2['default'].bool,
  direction: _vueTypes2['default'].string,
  showSelectAll: _vueTypes2['default'].bool
};

function renderListNode(h, renderList, props) {
  var bodyContent = renderList ? renderList(props) : null;
  var customize = !!bodyContent;
  if (!customize) {
    bodyContent = (0, _renderListBody2['default'])(h, props);
  }
  return {
    customize: customize,
    bodyContent: bodyContent
  };
}

exports['default'] = {
  name: 'TransferList',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(TransferListProps, {
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
        _this.scrollEvent = (0, _addEventListener2['default'])(listContentWrapperDom, 'scroll', _this.handleScroll);
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
        [h(_search2['default'], {
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
          props: (0, _extends3['default'])({}, this.$props, { filteredItems: filteredItems, filteredRenderItems: filteredRenderItems, selectedKeys: checkedKeys }),
          on: (0, _propsUtil.getListeners)(this)
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
            'class': (0, _classnames2['default'])(showSearch ? prefixCls + '-body ' + prefixCls + '-body-with-search' : prefixCls + '-body')
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
      var checkAllCheckbox = showSelectAll !== false && h(_checkbox2['default'], {
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
          (0, _triggerEvent2['default'])(listNode, 'scroll');
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

    var footerDom = footer && footer((0, _extends3['default'])({}, this.$props));
    var bodyDom = body && body((0, _extends3['default'])({}, this.$props));

    var listCls = (0, _classnames2['default'])(prefixCls, (0, _defineProperty3['default'])({}, prefixCls + '-with-footer', !!footerDom));

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