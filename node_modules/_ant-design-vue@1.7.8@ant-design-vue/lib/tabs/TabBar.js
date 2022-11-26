'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _ScrollableInkTabBar = require('../vc-tabs/src/ScrollableInkTabBar');

var _ScrollableInkTabBar2 = _interopRequireDefault(_ScrollableInkTabBar);

var _vnode = require('../_util/vnode');

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TabBar = {
  name: 'TabBar',
  inheritAttrs: false,
  props: {
    prefixCls: _vueTypes2['default'].string,
    tabBarStyle: _vueTypes2['default'].object,
    tabBarExtraContent: _vueTypes2['default'].any,
    type: _vueTypes2['default'].oneOf(['line', 'card', 'editable-card']),
    tabPosition: _vueTypes2['default'].oneOf(['top', 'right', 'bottom', 'left']).def('top'),
    tabBarPosition: _vueTypes2['default'].oneOf(['top', 'right', 'bottom', 'left']),
    size: _vueTypes2['default'].oneOf(['default', 'small', 'large']),
    animated: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].object]),
    renderTabBar: _vueTypes2['default'].func,
    panels: _vueTypes2['default'].array.def([]),
    activeKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    tabBarGutter: _vueTypes2['default'].number
  },
  render: function render() {
    var _cls;

    var h = arguments[0];
    var _$props = this.$props,
        tabBarStyle = _$props.tabBarStyle,
        _$props$animated = _$props.animated,
        animated = _$props$animated === undefined ? true : _$props$animated,
        renderTabBar = _$props.renderTabBar,
        tabBarExtraContent = _$props.tabBarExtraContent,
        tabPosition = _$props.tabPosition,
        prefixCls = _$props.prefixCls,
        _$props$type = _$props.type,
        type = _$props$type === undefined ? 'line' : _$props$type,
        size = _$props.size;

    var inkBarAnimated = (typeof animated === 'undefined' ? 'undefined' : (0, _typeof3['default'])(animated)) === 'object' ? animated.inkBar : animated;

    var isVertical = tabPosition === 'left' || tabPosition === 'right';
    var prevIconType = isVertical ? 'up' : 'left';
    var nextIconType = isVertical ? 'down' : 'right';
    var prevIcon = h(
      'span',
      { 'class': prefixCls + '-tab-prev-icon' },
      [h(_icon2['default'], {
        attrs: { type: prevIconType },
        'class': prefixCls + '-tab-prev-icon-target' })]
    );
    var nextIcon = h(
      'span',
      { 'class': prefixCls + '-tab-next-icon' },
      [h(_icon2['default'], {
        attrs: { type: nextIconType },
        'class': prefixCls + '-tab-next-icon-target' })]
    );

    // Additional className for style usage
    var cls = (_cls = {}, (0, _defineProperty3['default'])(_cls, prefixCls + '-' + tabPosition + '-bar', true), (0, _defineProperty3['default'])(_cls, prefixCls + '-' + size + '-bar', !!size), (0, _defineProperty3['default'])(_cls, prefixCls + '-card-bar', type && type.indexOf('card') >= 0), _cls);

    var renderProps = {
      props: (0, _extends3['default'])({}, this.$props, this.$attrs, {
        inkBarAnimated: inkBarAnimated,
        extraContent: tabBarExtraContent,
        prevIcon: prevIcon,
        nextIcon: nextIcon
      }),
      style: tabBarStyle,
      on: (0, _propsUtil.getListeners)(this),
      'class': cls
    };

    var RenderTabBar = void 0;

    if (renderTabBar) {
      RenderTabBar = renderTabBar(renderProps, _ScrollableInkTabBar2['default']);
      // https://github.com/vueComponent/ant-design-vue/issues/2157
      return (0, _vnode.cloneElement)(RenderTabBar, renderProps);
    } else {
      return h(_ScrollableInkTabBar2['default'], renderProps);
    }
  }
};

exports['default'] = TabBar;