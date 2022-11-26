import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import omit from 'omit.js';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

import Spin from '../spin';
import Pagination, { PaginationConfig } from '../pagination';
import { Row } from '../grid';

import Item from './Item';
import { initDefaultProps, getComponentFromProp, filterEmpty, getListeners } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import Base from '../base';

export { ListItemProps, ListItemMetaProps } from './Item';

export var ColumnCount = ['', 1, 2, 3, 4, 6, 8, 12, 24];

export var ColumnType = ['gutter', 'column', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

export var ListGridType = {
  gutter: PropTypes.number,
  column: PropTypes.oneOf(ColumnCount),
  xs: PropTypes.oneOf(ColumnCount),
  sm: PropTypes.oneOf(ColumnCount),
  md: PropTypes.oneOf(ColumnCount),
  lg: PropTypes.oneOf(ColumnCount),
  xl: PropTypes.oneOf(ColumnCount),
  xxl: PropTypes.oneOf(ColumnCount)
};

export var ListSize = ['small', 'default', 'large'];

export var ListProps = function ListProps() {
  return {
    bordered: PropTypes.bool,
    dataSource: PropTypes.array,
    extra: PropTypes.any,
    grid: PropTypes.shape(ListGridType).loose,
    itemLayout: PropTypes.string,
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    loadMore: PropTypes.any,
    pagination: PropTypes.oneOfType([PropTypes.shape(PaginationConfig()).loose, PropTypes.bool]),
    prefixCls: PropTypes.string,
    rowKey: PropTypes.any,
    renderItem: PropTypes.any,
    size: PropTypes.oneOf(ListSize),
    split: PropTypes.bool,
    header: PropTypes.any,
    footer: PropTypes.any,
    locale: PropTypes.object
  };
};

var List = {
  Item: Item,
  name: 'AList',
  props: initDefaultProps(ListProps(), {
    dataSource: [],
    bordered: false,
    split: true,
    loading: false,
    pagination: false
  }),
  provide: function provide() {
    return {
      listContext: this
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    var _this = this;

    this.keys = [];
    this.defaultPaginationProps = {
      current: 1,
      pageSize: 10,
      onChange: function onChange(page, pageSize) {
        var pagination = _this.pagination;

        _this.paginationCurrent = page;
        if (pagination && pagination.onChange) {
          pagination.onChange(page, pageSize);
        }
      },
      total: 0
    };
    this.onPaginationChange = this.triggerPaginationEvent('onChange');
    this.onPaginationShowSizeChange = this.triggerPaginationEvent('onShowSizeChange');
    var pagination = this.$props.pagination;

    var paginationObj = pagination && (typeof pagination === 'undefined' ? 'undefined' : _typeof(pagination)) === 'object' ? pagination : {};
    return {
      paginationCurrent: paginationObj.defaultCurrent || 1,
      paginationSize: paginationObj.defaultPageSize || 10
    };
  },

  methods: {
    triggerPaginationEvent: function triggerPaginationEvent(eventName) {
      var _this2 = this;

      return function (page, pageSize) {
        var pagination = _this2.$props.pagination;

        _this2.paginationCurrent = page;
        _this2.paginationSize = pageSize;
        if (pagination && pagination[eventName]) {
          pagination[eventName](page, pageSize);
        }
      };
    },
    renderItem2: function renderItem2(item, index) {
      var $scopedSlots = this.$scopedSlots,
          rowKey = this.rowKey;

      var renderItem = this.renderItem || $scopedSlots.renderItem;
      if (!renderItem) return null;
      var key = void 0;
      if (typeof rowKey === 'function') {
        key = rowKey(item);
      } else if (typeof rowKey === 'string') {
        key = item[rowKey];
      } else {
        key = item.key;
      }

      if (!key) {
        key = 'list-item-' + index;
      }

      this.keys[index] = key;

      return renderItem(item, index);
    },
    isSomethingAfterLastItem: function isSomethingAfterLastItem() {
      var pagination = this.pagination;

      var loadMore = getComponentFromProp(this, 'loadMore');
      var footer = getComponentFromProp(this, 'footer');
      return !!(loadMore || pagination || footer);
    },
    renderEmpty: function renderEmpty(prefixCls, _renderEmpty) {
      var h = this.$createElement;
      var locale = this.locale;

      return h(
        'div',
        { 'class': prefixCls + '-empty-text' },
        [locale && locale.emptyText || _renderEmpty(h, 'List')]
      );
    }
  },

  render: function render() {
    var _classNames,
        _this3 = this;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        bordered = this.bordered,
        split = this.split,
        itemLayout = this.itemLayout,
        pagination = this.pagination,
        grid = this.grid,
        _dataSource = this.dataSource,
        dataSource = _dataSource === undefined ? [] : _dataSource,
        size = this.size,
        loading = this.loading,
        $slots = this.$slots,
        paginationCurrent = this.paginationCurrent,
        paginationSize = this.paginationSize;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('list', customizePrefixCls);

    var loadMore = getComponentFromProp(this, 'loadMore');
    var footer = getComponentFromProp(this, 'footer');
    var header = getComponentFromProp(this, 'header');
    var children = filterEmpty($slots['default'] || []);
    var loadingProp = loading;
    if (typeof loadingProp === 'boolean') {
      loadingProp = {
        spinning: loadingProp
      };
    }
    var isLoading = loadingProp && loadingProp.spinning;

    // large => lg
    // small => sm
    var sizeCls = '';
    switch (size) {
      case 'large':
        sizeCls = 'lg';
        break;
      case 'small':
        sizeCls = 'sm';
        break;
      default:
        break;
    }
    var classString = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-vertical', itemLayout === 'vertical'), _defineProperty(_classNames, prefixCls + '-' + sizeCls, sizeCls), _defineProperty(_classNames, prefixCls + '-split', split), _defineProperty(_classNames, prefixCls + '-bordered', bordered), _defineProperty(_classNames, prefixCls + '-loading', isLoading), _defineProperty(_classNames, prefixCls + '-grid', grid), _defineProperty(_classNames, prefixCls + '-something-after-last-item', this.isSomethingAfterLastItem()), _classNames));
    var paginationProps = _extends({}, this.defaultPaginationProps, {
      total: dataSource.length,
      current: paginationCurrent,
      pageSize: paginationSize
    }, pagination || {});
    var largestPage = Math.ceil(paginationProps.total / paginationProps.pageSize);
    if (paginationProps.current > largestPage) {
      paginationProps.current = largestPage;
    }

    var cls = paginationProps['class'],
        style = paginationProps.style,
        restProps = _objectWithoutProperties(paginationProps, ['class', 'style']);

    var paginationContent = pagination ? h(
      'div',
      { 'class': prefixCls + '-pagination' },
      [h(Pagination, {
        props: omit(restProps, ['onChange']),
        'class': cls,
        style: style,
        on: {
          change: this.onPaginationChange,
          showSizeChange: this.onPaginationShowSizeChange
        }
      })]
    ) : null;

    var splitDataSource = [].concat(_toConsumableArray(dataSource));
    if (pagination) {
      if (dataSource.length > (paginationProps.current - 1) * paginationProps.pageSize) {
        splitDataSource = [].concat(_toConsumableArray(dataSource)).splice((paginationProps.current - 1) * paginationProps.pageSize, paginationProps.pageSize);
      }
    }

    var childrenContent = void 0;
    childrenContent = isLoading && h('div', { style: { minHeight: 53 } });
    if (splitDataSource.length > 0) {
      var items = splitDataSource.map(function (item, index) {
        return _this3.renderItem2(item, index);
      });
      var childrenList = items.map(function (child, index) {
        return cloneElement(child, {
          key: _this3.keys[index]
        });
      });

      childrenContent = grid ? h(
        Row,
        {
          attrs: { gutter: grid.gutter }
        },
        [childrenList]
      ) : h(
        'ul',
        { 'class': prefixCls + '-items' },
        [childrenList]
      );
    } else if (!children.length && !isLoading) {
      var renderEmpty = this.configProvider.renderEmpty;
      childrenContent = this.renderEmpty(prefixCls, renderEmpty);
    }
    var paginationPosition = paginationProps.position || 'bottom';

    return h(
      'div',
      _mergeJSXProps([{ 'class': classString }, { on: getListeners(this) }]),
      [(paginationPosition === 'top' || paginationPosition === 'both') && paginationContent, header && h(
        'div',
        { 'class': prefixCls + '-header' },
        [header]
      ), h(
        Spin,
        { props: loadingProp },
        [childrenContent, children]
      ), footer && h(
        'div',
        { 'class': prefixCls + '-footer' },
        [footer]
      ), loadMore || (paginationPosition === 'bottom' || paginationPosition === 'both') && paginationContent]
    );
  }
};

/* istanbul ignore next */
List.install = function (Vue) {
  Vue.use(Base);
  Vue.component(List.name, List);
  Vue.component(List.Item.name, List.Item);
  Vue.component(List.Item.Meta.name, List.Item.Meta);
};

export default List;