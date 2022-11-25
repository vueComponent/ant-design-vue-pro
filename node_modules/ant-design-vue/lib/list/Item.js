'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Meta = exports.ListItemMetaProps = exports.ListItemProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../_util/props-util');

var _grid = require('../grid');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _index = require('./index');

var _vnode = require('../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ListItemProps = exports.ListItemProps = {
  prefixCls: _vueTypes2['default'].string,
  extra: _vueTypes2['default'].any,
  actions: _vueTypes2['default'].arrayOf(_vueTypes2['default'].any),
  grid: _index.ListGridType
};

var ListItemMetaProps = exports.ListItemMetaProps = {
  avatar: _vueTypes2['default'].any,
  description: _vueTypes2['default'].any,
  prefixCls: _vueTypes2['default'].string,
  title: _vueTypes2['default'].any
};

var Meta = exports.Meta = {
  functional: true,
  name: 'AListItemMeta',
  __ANT_LIST_ITEM_META: true,
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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
      (0, _babelHelperVueJsxMergeProps2['default'])([{ on: listeners }, { 'class': prefixCls + '-item-meta' }]),
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

exports['default'] = {
  name: 'AListItem',
  Meta: Meta,
  props: ListItemProps,
  inject: {
    listContext: { 'default': function _default() {
        return {};
      } },
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    isItemContainsTextNodeAndNotSingular: function isItemContainsTextNodeAndNotSingular() {
      var $slots = this.$slots;

      var result = void 0;
      var children = $slots['default'] || [];
      children.forEach(function (element) {
        if ((0, _propsUtil.isStringElement)(element) && !(0, _propsUtil.isEmptyElement)(element)) {
          result = true;
        }
      });
      return result && children.length > 1;
    },
    isFlexMode: function isFlexMode() {
      var extra = (0, _propsUtil.getComponentFromProp)(this, 'extra');
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

    var listeners = (0, _propsUtil.getListeners)(this);
    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('list', customizePrefixCls);
    var extra = (0, _propsUtil.getComponentFromProp)(this, 'extra');
    var actions = (0, _propsUtil.getComponentFromProp)(this, 'actions');

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
      (0, _babelHelperVueJsxMergeProps2['default'])([{ on: listeners }, {
        'class': (0, _classnames2['default'])(prefixCls + '-item', (0, _defineProperty3['default'])({}, prefixCls + '-item-no-flex', !this.isFlexMode()))
      }]),
      [itemLayout === 'vertical' && extra ? [h(
        'div',
        { 'class': prefixCls + '-item-main', key: 'content' },
        [$slots['default'], actionsContent]
      ), h(
        'div',
        { 'class': prefixCls + '-item-extra', key: 'extra' },
        [extra]
      )] : [$slots['default'], actionsContent, (0, _vnode.cloneElement)(extra, { key: 'extra' })]]
    );

    var mainContent = grid ? h(
      _grid.Col,
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