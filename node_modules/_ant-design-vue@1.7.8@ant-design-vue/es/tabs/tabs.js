import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import Icon from '../icon';
import VcTabs, { TabPane } from '../vc-tabs/src';
import TabContent from '../vc-tabs/src/TabContent';
import { isFlexSupported } from '../_util/styleChecker';
import PropTypes from '../_util/vue-types';
import { getComponentFromProp, getOptionProps, filterEmpty, getListeners } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import isValid from '../_util/isValid';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import TabBar from './TabBar';

export default {
  TabPane: TabPane,
  name: 'ATabs',
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  props: {
    prefixCls: PropTypes.string,
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hideAdd: PropTypes.bool.def(false),
    tabBarStyle: PropTypes.object,
    tabBarExtraContent: PropTypes.any,
    destroyInactiveTabPane: PropTypes.bool.def(false),
    type: PropTypes.oneOf(['line', 'card', 'editable-card']),
    tabPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).def('top'),
    size: PropTypes.oneOf(['default', 'small', 'large']),
    animated: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    tabBarGutter: PropTypes.number,
    renderTabBar: PropTypes.func
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  mounted: function mounted() {
    var NO_FLEX = ' no-flex';
    var tabNode = this.$el;
    if (tabNode && !isFlexSupported && tabNode.className.indexOf(NO_FLEX) === -1) {
      tabNode.className += NO_FLEX;
    }
  },

  methods: {
    removeTab: function removeTab(targetKey, e) {
      e.stopPropagation();
      if (isValid(targetKey)) {
        this.$emit('edit', targetKey, 'remove');
      }
    },
    handleChange: function handleChange(activeKey) {
      this.$emit('change', activeKey);
    },
    createNewTab: function createNewTab(targetKey) {
      this.$emit('edit', targetKey, 'add');
    },
    onTabClick: function onTabClick(val) {
      this.$emit('tabClick', val);
    },
    onPrevClick: function onPrevClick(val) {
      this.$emit('prevClick', val);
    },
    onNextClick: function onNextClick(val) {
      this.$emit('nextClick', val);
    }
  },

  render: function render() {
    var _cls,
        _this = this,
        _contentCls;

    var h = arguments[0];

    var props = getOptionProps(this);
    var customizePrefixCls = props.prefixCls,
        size = props.size,
        _props$type = props.type,
        type = _props$type === undefined ? 'line' : _props$type,
        tabPosition = props.tabPosition,
        _props$animated = props.animated,
        animated = _props$animated === undefined ? true : _props$animated,
        hideAdd = props.hideAdd,
        renderTabBar = props.renderTabBar;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('tabs', customizePrefixCls);
    var children = filterEmpty(this.$slots['default']);

    var tabBarExtraContent = getComponentFromProp(this, 'tabBarExtraContent');
    var tabPaneAnimated = (typeof animated === 'undefined' ? 'undefined' : _typeof(animated)) === 'object' ? animated.tabPane : animated;

    // card tabs should not have animation
    if (type !== 'line') {
      tabPaneAnimated = 'animated' in props ? tabPaneAnimated : false;
    }
    var cls = (_cls = {}, _defineProperty(_cls, prefixCls + '-vertical', tabPosition === 'left' || tabPosition === 'right'), _defineProperty(_cls, prefixCls + '-' + size, !!size), _defineProperty(_cls, prefixCls + '-card', type.indexOf('card') >= 0), _defineProperty(_cls, prefixCls + '-' + type, true), _defineProperty(_cls, prefixCls + '-no-animation', !tabPaneAnimated), _cls);
    // only card type tabs can be added and closed
    var childrenWithClose = [];
    if (type === 'editable-card') {
      childrenWithClose = [];
      children.forEach(function (child, index) {
        var props = getOptionProps(child);
        var closable = props.closable;
        closable = typeof closable === 'undefined' ? true : closable;
        var closeIcon = closable ? h(Icon, {
          attrs: {
            type: 'close'
          },
          'class': prefixCls + '-close-x',
          on: {
            'click': function click(e) {
              return _this.removeTab(child.key, e);
            }
          }
        }) : null;
        childrenWithClose.push(cloneElement(child, {
          props: {
            tab: h(
              'div',
              { 'class': closable ? undefined : prefixCls + '-tab-unclosable' },
              [getComponentFromProp(child, 'tab'), closeIcon]
            )
          },
          key: child.key || index
        }));
      });
      // Add new tab handler
      if (!hideAdd) {
        tabBarExtraContent = h('span', [h(Icon, {
          attrs: { type: 'plus' },
          'class': prefixCls + '-new-tab', on: {
            'click': this.createNewTab
          }
        }), tabBarExtraContent]);
      }
    }

    tabBarExtraContent = tabBarExtraContent ? h(
      'div',
      { 'class': prefixCls + '-extra-content' },
      [tabBarExtraContent]
    ) : null;

    var renderTabBarSlot = renderTabBar || this.$scopedSlots.renderTabBar;
    var listeners = getListeners(this);
    var tabBarProps = {
      props: _extends({}, this.$props, {
        prefixCls: prefixCls,
        tabBarExtraContent: tabBarExtraContent,
        renderTabBar: renderTabBarSlot
      }),
      on: listeners
    };
    var contentCls = (_contentCls = {}, _defineProperty(_contentCls, prefixCls + '-' + tabPosition + '-content', true), _defineProperty(_contentCls, prefixCls + '-card-content', type.indexOf('card') >= 0), _contentCls);
    var tabsProps = {
      props: _extends({}, getOptionProps(this), {
        prefixCls: prefixCls,
        tabBarPosition: tabPosition,
        // https://github.com/vueComponent/ant-design-vue/issues/2030
        // 如仅传递 tabBarProps 会导致，第二次执行 renderTabBar 时，丢失 on 属性，
        // 添加key之后，会在babel jsx 插件中做一次merge，最终TabBar接收的是一个新的对象，而不是 tabBarProps
        renderTabBar: function renderTabBar() {
          return h(TabBar, _mergeJSXProps([{ key: 'tabBar' }, tabBarProps]));
        },
        renderTabContent: function renderTabContent() {
          return h(TabContent, { 'class': contentCls, attrs: { animated: tabPaneAnimated, animatedWithMargin: true }
          });
        },
        children: childrenWithClose.length > 0 ? childrenWithClose : children,
        __propsSymbol__: Symbol()
      }),
      on: _extends({}, listeners, {
        change: this.handleChange
      }),
      'class': cls
    };
    return h(VcTabs, tabsProps);
  }
};