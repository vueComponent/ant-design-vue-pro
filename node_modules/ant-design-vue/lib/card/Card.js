'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _tabs = require('../tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _row = require('../row');

var _row2 = _interopRequireDefault(_row);

var _col = require('../col');

var _col2 = _interopRequireDefault(_col);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TabPane = _tabs2['default'].TabPane;
exports['default'] = {
  name: 'ACard',
  mixins: [_BaseMixin2['default']],
  props: {
    prefixCls: _vueTypes2['default'].string,
    title: _vueTypes2['default'].any,
    extra: _vueTypes2['default'].any,
    bordered: _vueTypes2['default'].bool.def(true),
    bodyStyle: _vueTypes2['default'].object,
    headStyle: _vueTypes2['default'].object,
    loading: _vueTypes2['default'].bool.def(false),
    hoverable: _vueTypes2['default'].bool.def(false),
    type: _vueTypes2['default'].string,
    size: _vueTypes2['default'].oneOf(['default', 'small']),
    actions: _vueTypes2['default'].any,
    tabList: _vueTypes2['default'].array,
    tabProps: _vueTypes2['default'].object,
    tabBarExtraContent: _vueTypes2['default'].any,
    activeTabKey: _vueTypes2['default'].string,
    defaultActiveTabKey: _vueTypes2['default'].string
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      widerPadding: false
    };
  },

  methods: {
    getAction: function getAction(actions) {
      var h = this.$createElement;

      var actionList = actions.map(function (action, index) {
        return h(
          'li',
          { style: { width: 100 / actions.length + '%' }, key: 'action-' + index },
          [h('span', [action])]
        );
      });
      return actionList;
    },
    onTabChange: function onTabChange(key) {
      this.$emit('tabChange', key);
    },
    isContainGrid: function isContainGrid() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var containGrid = void 0;
      obj.forEach(function (element) {
        if (element && (0, _propsUtil.getSlotOptions)(element).__ANT_CARD_GRID) {
          containGrid = true;
        }
      });
      return containGrid;
    }
  },
  render: function render() {
    var _classString, _extends2;

    var h = arguments[0];
    var _$props = this.$props,
        customizePrefixCls = _$props.prefixCls,
        _$props$headStyle = _$props.headStyle,
        headStyle = _$props$headStyle === undefined ? {} : _$props$headStyle,
        _$props$bodyStyle = _$props.bodyStyle,
        bodyStyle = _$props$bodyStyle === undefined ? {} : _$props$bodyStyle,
        loading = _$props.loading,
        _$props$bordered = _$props.bordered,
        bordered = _$props$bordered === undefined ? true : _$props$bordered,
        _$props$size = _$props.size,
        size = _$props$size === undefined ? 'default' : _$props$size,
        type = _$props.type,
        tabList = _$props.tabList,
        _$props$tabProps = _$props.tabProps,
        tabProps = _$props$tabProps === undefined ? {} : _$props$tabProps,
        hoverable = _$props.hoverable,
        activeTabKey = _$props.activeTabKey,
        defaultActiveTabKey = _$props.defaultActiveTabKey;


    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('card', customizePrefixCls);

    var $slots = this.$slots,
        $scopedSlots = this.$scopedSlots;

    var tabBarExtraContent = (0, _propsUtil.getComponentFromProp)(this, 'tabBarExtraContent');
    var classString = (_classString = {}, (0, _defineProperty3['default'])(_classString, '' + prefixCls, true), (0, _defineProperty3['default'])(_classString, prefixCls + '-loading', loading), (0, _defineProperty3['default'])(_classString, prefixCls + '-bordered', bordered), (0, _defineProperty3['default'])(_classString, prefixCls + '-hoverable', !!hoverable), (0, _defineProperty3['default'])(_classString, prefixCls + '-contain-grid', this.isContainGrid($slots['default'])), (0, _defineProperty3['default'])(_classString, prefixCls + '-contain-tabs', tabList && tabList.length), (0, _defineProperty3['default'])(_classString, prefixCls + '-' + size, size !== 'default'), (0, _defineProperty3['default'])(_classString, prefixCls + '-type-' + type, !!type), _classString);

    var loadingBlockStyle = bodyStyle.padding === 0 || bodyStyle.padding === '0px' ? { padding: 24 } : undefined;

    var loadingBlock = h(
      'div',
      { 'class': prefixCls + '-loading-content', style: loadingBlockStyle },
      [h(
        _row2['default'],
        {
          attrs: { gutter: 8 }
        },
        [h(
          _col2['default'],
          {
            attrs: { span: 22 }
          },
          [h('div', { 'class': prefixCls + '-loading-block' })]
        )]
      ), h(
        _row2['default'],
        {
          attrs: { gutter: 8 }
        },
        [h(
          _col2['default'],
          {
            attrs: { span: 8 }
          },
          [h('div', { 'class': prefixCls + '-loading-block' })]
        ), h(
          _col2['default'],
          {
            attrs: { span: 15 }
          },
          [h('div', { 'class': prefixCls + '-loading-block' })]
        )]
      ), h(
        _row2['default'],
        {
          attrs: { gutter: 8 }
        },
        [h(
          _col2['default'],
          {
            attrs: { span: 6 }
          },
          [h('div', { 'class': prefixCls + '-loading-block' })]
        ), h(
          _col2['default'],
          {
            attrs: { span: 18 }
          },
          [h('div', { 'class': prefixCls + '-loading-block' })]
        )]
      ), h(
        _row2['default'],
        {
          attrs: { gutter: 8 }
        },
        [h(
          _col2['default'],
          {
            attrs: { span: 13 }
          },
          [h('div', { 'class': prefixCls + '-loading-block' })]
        ), h(
          _col2['default'],
          {
            attrs: { span: 9 }
          },
          [h('div', { 'class': prefixCls + '-loading-block' })]
        )]
      ), h(
        _row2['default'],
        {
          attrs: { gutter: 8 }
        },
        [h(
          _col2['default'],
          {
            attrs: { span: 4 }
          },
          [h('div', { 'class': prefixCls + '-loading-block' })]
        ), h(
          _col2['default'],
          {
            attrs: { span: 3 }
          },
          [h('div', { 'class': prefixCls + '-loading-block' })]
        ), h(
          _col2['default'],
          {
            attrs: { span: 16 }
          },
          [h('div', { 'class': prefixCls + '-loading-block' })]
        )]
      )]
    );

    var hasActiveTabKey = activeTabKey !== undefined;
    var tabsProps = {
      props: (0, _extends4['default'])({
        size: 'large'
      }, tabProps, (_extends2 = {}, (0, _defineProperty3['default'])(_extends2, hasActiveTabKey ? 'activeKey' : 'defaultActiveKey', hasActiveTabKey ? activeTabKey : defaultActiveTabKey), (0, _defineProperty3['default'])(_extends2, 'tabBarExtraContent', tabBarExtraContent), _extends2)),
      on: {
        change: this.onTabChange
      },
      'class': prefixCls + '-head-tabs'
    };

    var head = void 0;
    var tabs = tabList && tabList.length ? h(
      _tabs2['default'],
      tabsProps,
      [tabList.map(function (item) {
        var temp = item.tab,
            _item$scopedSlots = item.scopedSlots,
            scopedSlots = _item$scopedSlots === undefined ? {} : _item$scopedSlots;

        var name = scopedSlots.tab;
        var tab = temp !== undefined ? temp : $scopedSlots[name] ? $scopedSlots[name](item) : null;
        return h(TabPane, {
          attrs: { tab: tab, disabled: item.disabled },
          key: item.key });
      })]
    ) : null;
    var titleDom = (0, _propsUtil.getComponentFromProp)(this, 'title');
    var extraDom = (0, _propsUtil.getComponentFromProp)(this, 'extra');
    if (titleDom || extraDom || tabs) {
      head = h(
        'div',
        { 'class': prefixCls + '-head', style: headStyle },
        [h(
          'div',
          { 'class': prefixCls + '-head-wrapper' },
          [titleDom && h(
            'div',
            { 'class': prefixCls + '-head-title' },
            [titleDom]
          ), extraDom && h(
            'div',
            { 'class': prefixCls + '-extra' },
            [extraDom]
          )]
        ), tabs]
      );
    }

    var children = $slots['default'];
    var cover = (0, _propsUtil.getComponentFromProp)(this, 'cover');
    var coverDom = cover ? h(
      'div',
      { 'class': prefixCls + '-cover' },
      [cover]
    ) : null;
    var body = h(
      'div',
      { 'class': prefixCls + '-body', style: bodyStyle },
      [loading ? loadingBlock : children]
    );
    var actions = (0, _propsUtil.filterEmpty)(this.$slots.actions);
    var actionDom = actions && actions.length ? h(
      'ul',
      { 'class': prefixCls + '-actions' },
      [this.getAction(actions)]
    ) : null;

    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([{
        'class': classString,
        ref: 'cardContainerRef'
      }, { on: (0, _omit2['default'])((0, _propsUtil.getListeners)(this), ['tabChange', 'tab-change']) }]),
      [head, coverDom, children ? body : null, actionDom]
    );
  }
};