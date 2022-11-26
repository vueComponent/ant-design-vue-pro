import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import { getComponentFromProp, isStringElement, getListeners, isEmptyElement } from '../_util/props-util';
import { Col } from '../grid';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { ListGridType } from './index';
import { cloneElement } from '../_util/vnode';

export var ListItemProps = {
  prefixCls: PropTypes.string,
  extra: PropTypes.any,
  actions: PropTypes.arrayOf(PropTypes.any),
  grid: ListGridType
};

export var ListItemMetaProps = {
  avatar: PropTypes.any,
  description: PropTypes.any,
  prefixCls: PropTypes.string,
  title: PropTypes.any
};

export var Meta = {
  functional: true,
  name: 'AListItemMeta',
  __ANT_LIST_ITEM_META: true,
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  render: function render(h, context) {
    var props = context.props,
        slots = context.slots,
        listeners = context.listeners,
        injections = context.injections;

    var slotsMap = slots();
    var getPrefixCls = injections.configProvider.getPrefixCls;
    var customizePrefixCls = props.prefixCls;

    var prefixCls = getPrefixCls('list', customizePrefixCls);

    var avatar = props.avatar || slotsMap.avatar;
    var title = props.title || slotsMap.title;
    var description = props.description || slotsMap.description;
    var content = h(
      'div',
      { 'class': prefixCls + '-item-meta-content' },
      [title && h(
        'h4',
        { 'class': prefixCls + '-item-meta-title' },
        [title]
      ), description && h(
        'div',
        { 'class': prefixCls + '-item-meta-description' },
        [description]
      )]
    );
    return h(
      'div',
      _mergeJSXProps([{ on: listeners }, { 'class': prefixCls + '-item-meta' }]),
      [avatar && h(
        'div',
        { 'class': prefixCls + '-item-meta-avatar' },
        [avatar]
      ), (title || description) && content]
    );
  }
};

function getGrid(grid, t) {
  return grid[t] && Math.floor(24 / grid[t]);
}

export default {
  name: 'AListItem',
  Meta: Meta,
  props: ListItemProps,
  inject: {
    listContext: { 'default': function _default() {
        return {};
      } },
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    isItemContainsTextNodeAndNotSingular: function isItemContainsTextNodeAndNotSingular() {
      var $slots = this.$slots;

      var result = void 0;
      var children = $slots['default'] || [];
      children.forEach(function (element) {
        if (isStringElement(element) && !isEmptyElement(element)) {
          result = true;
        }
      });
      return result && children.length > 1;
    },
    isFlexMode: function isFlexMode() {
      var extra = getComponentFromProp(this, 'extra');
      var itemLayout = this.listContext.itemLayout;

      if (itemLayout === 'vertical') {
        return !!extra;
      }
      return !this.isItemContainsTextNodeAndNotSingular();
    }
  },
  render: function render() {
    var h = arguments[0];
    var _listContext = this.listContext,
        grid = _listContext.grid,
        itemLayout = _listContext.itemLayout;
    var customizePrefixCls = this.prefixCls,
        $slots = this.$slots;

    var listeners = getListeners(this);
    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('list', customizePrefixCls);
    var extra = getComponentFromProp(this, 'extra');
    var actions = getComponentFromProp(this, 'actions');

    var actionsContent = actions && actions.length > 0 && h(
      'ul',
      { 'class': prefixCls + '-item-action', key: 'actions' },
      [actions.map(function (action, i) {
        return h(
          'li',
          { key: prefixCls + '-item-action-' + i },
          [action, i !== actions.length - 1 && h('em', { 'class': prefixCls + '-item-action-split' })]
        );
      })]
    );

    var Tag = grid ? 'div' : 'li';
    var itemChildren = h(
      Tag,
      _mergeJSXProps([{ on: listeners }, {
        'class': classNames(prefixCls + '-item', _defineProperty({}, prefixCls + '-item-no-flex', !this.isFlexMode()))
      }]),
      [itemLayout === 'vertical' && extra ? [h(
        'div',
        { 'class': prefixCls + '-item-main', key: 'content' },
        [$slots['default'], actionsContent]
      ), h(
        'div',
        { 'class': prefixCls + '-item-extra', key: 'extra' },
        [extra]
      )] : [$slots['default'], actionsContent, cloneElement(extra, { key: 'extra' })]]
    );

    var mainContent = grid ? h(
      Col,
      {
        attrs: {
          span: getGrid(grid, 'column'),
          xs: getGrid(grid, 'xs'),
          sm: getGrid(grid, 'sm'),
          md: getGrid(grid, 'md'),
          lg: getGrid(grid, 'lg'),
          xl: getGrid(grid, 'xl'),
          xxl: getGrid(grid, 'xxl')
        }
      },
      [itemChildren]
    ) : itemChildren;

    return mainContent;
  }
};