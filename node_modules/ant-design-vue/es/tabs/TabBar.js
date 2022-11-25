import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import Icon from '../icon';
import ScrollableInkTabBar from '../vc-tabs/src/ScrollableInkTabBar';
import { cloneElement } from '../_util/vnode';
import PropTypes from '../_util/vue-types';
import { getListeners } from '../_util/props-util';
var TabBar = {
  name: 'TabBar',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    tabBarStyle: PropTypes.object,
    tabBarExtraContent: PropTypes.any,
    type: PropTypes.oneOf(['line', 'card', 'editable-card']),
    tabPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).def('top'),
    tabBarPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    size: PropTypes.oneOf(['default', 'small', 'large']),
    animated: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    renderTabBar: PropTypes.func,
    panels: PropTypes.array.def([]),
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tabBarGutter: PropTypes.number
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

    var inkBarAnimated = (typeof animated === 'undefined' ? 'undefined' : _typeof(animated)) === 'object' ? animated.inkBar : animated;

    var isVertical = tabPosition === 'left' || tabPosition === 'right';
    var prevIconType = isVertical ? 'up' : 'left';
    var nextIconType = isVertical ? 'down' : 'right';
    var prevIcon = h(
      'span',
      { 'class': prefixCls + '-tab-prev-icon' },
      [h(Icon, {
        attrs: { type: prevIconType },
        'class': prefixCls + '-tab-prev-icon-target' })]
    );
    var nextIcon = h(
      'span',
      { 'class': prefixCls + '-tab-next-icon' },
      [h(Icon, {
        attrs: { type: nextIconType },
        'class': prefixCls + '-tab-next-icon-target' })]
    );

    // Additional className for style usage
    var cls = (_cls = {}, _defineProperty(_cls, prefixCls + '-' + tabPosition + '-bar', true), _defineProperty(_cls, prefixCls + '-' + size + '-bar', !!size), _defineProperty(_cls, prefixCls + '-card-bar', type && type.indexOf('card') >= 0), _cls);

    var renderProps = {
      props: _extends({}, this.$props, this.$attrs, {
        inkBarAnimated: inkBarAnimated,
        extraContent: tabBarExtraContent,
        prevIcon: prevIcon,
        nextIcon: nextIcon
      }),
      style: tabBarStyle,
      on: getListeners(this),
      'class': cls
    };

    var RenderTabBar = void 0;

    if (renderTabBar) {
      RenderTabBar = renderTabBar(renderProps, ScrollableInkTabBar);
      // https://github.com/vueComponent/ant-design-vue/issues/2157
      return cloneElement(RenderTabBar, renderProps);
    } else {
      return h(ScrollableInkTabBar, renderProps);
    }
  }
};

export default TabBar;