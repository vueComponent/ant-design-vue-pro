'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _KeyCode = require('./KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _propsUtil = require('../../_util/props-util');

var _vnode = require('../../_util/vnode');

var _Sentinel = require('./Sentinel');

var _Sentinel2 = _interopRequireDefault(_Sentinel);

var _isValid = require('../../_util/isValid');

var _isValid2 = _interopRequireDefault(_isValid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getDefaultActiveKey(props) {
  var activeKey = void 0;
  var children = props.children;
  children.forEach(function (child) {
    if (child && !(0, _isValid2['default'])(activeKey) && !child.disabled) {
      activeKey = child.key;
    }
  });
  return activeKey;
}

function activeKeyIsValid(props, key) {
  var children = props.children;
  var keys = children.map(function (child) {
    return child && child.key;
  });
  return keys.indexOf(key) >= 0;
}

exports['default'] = {
  name: 'Tabs',
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  props: {
    destroyInactiveTabPane: _vueTypes2['default'].bool,
    renderTabBar: _vueTypes2['default'].func.isRequired,
    renderTabContent: _vueTypes2['default'].func.isRequired,
    navWrapper: _vueTypes2['default'].func.def(function (arg) {
      return arg;
    }),
    children: _vueTypes2['default'].any.def([]),
    prefixCls: _vueTypes2['default'].string.def('ant-tabs'),
    tabBarPosition: _vueTypes2['default'].string.def('top'),
    activeKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    defaultActiveKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    __propsSymbol__: _vueTypes2['default'].any,
    direction: _vueTypes2['default'].string.def('ltr'),
    tabBarGutter: _vueTypes2['default'].number
  },
  data: function data() {
    var props = (0, _propsUtil.getOptionProps)(this);
    var activeKey = void 0;
    if ('activeKey' in props) {
      activeKey = props.activeKey;
    } else if ('defaultActiveKey' in props) {
      activeKey = props.defaultActiveKey;
    } else {
      activeKey = getDefaultActiveKey(props);
    }
    return {
      _activeKey: activeKey
    };
  },
  provide: function provide() {
    return {
      sentinelContext: this
    };
  },

  watch: {
    __propsSymbol__: function __propsSymbol__() {
      var nextProps = (0, _propsUtil.getOptionProps)(this);
      if ('activeKey' in nextProps) {
        this.setState({
          _activeKey: nextProps.activeKey
        });
      } else if (!activeKeyIsValid(nextProps, this.$data._activeKey)) {
        // https://github.com/ant-design/ant-design/issues/7093
        this.setState({
          _activeKey: getDefaultActiveKey(nextProps)
        });
      }
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.destroy = true;
    _raf2['default'].cancel(this.sentinelId);
  },

  methods: {
    onTabClick: function onTabClick(activeKey, e) {
      if (this.tabBar.componentOptions && this.tabBar.componentOptions.listeners && this.tabBar.componentOptions.listeners.tabClick) {
        this.tabBar.componentOptions.listeners.tabClick(activeKey, e);
      }
      this.setActiveKey(activeKey);
    },
    onNavKeyDown: function onNavKeyDown(e) {
      var eventKeyCode = e.keyCode;
      if (eventKeyCode === _KeyCode2['default'].RIGHT || eventKeyCode === _KeyCode2['default'].DOWN) {
        e.preventDefault();
        var nextKey = this.getNextActiveKey(true);
        this.onTabClick(nextKey);
      } else if (eventKeyCode === _KeyCode2['default'].LEFT || eventKeyCode === _KeyCode2['default'].UP) {
        e.preventDefault();
        var previousKey = this.getNextActiveKey(false);
        this.onTabClick(previousKey);
      }
    },
    onScroll: function onScroll(_ref) {
      var target = _ref.target,
          currentTarget = _ref.currentTarget;

      if (target === currentTarget && target.scrollLeft > 0) {
        target.scrollLeft = 0;
      }
    },


    // Sentinel for tab index
    setSentinelStart: function setSentinelStart(node) {
      this.sentinelStart = node;
    },
    setSentinelEnd: function setSentinelEnd(node) {
      this.sentinelEnd = node;
    },
    setPanelSentinelStart: function setPanelSentinelStart(node) {
      if (node !== this.panelSentinelStart) {
        this.updateSentinelContext();
      }
      this.panelSentinelStart = node;
    },
    setPanelSentinelEnd: function setPanelSentinelEnd(node) {
      if (node !== this.panelSentinelEnd) {
        this.updateSentinelContext();
      }
      this.panelSentinelEnd = node;
    },
    setActiveKey: function setActiveKey(activeKey) {
      if (this.$data._activeKey !== activeKey) {
        var props = (0, _propsUtil.getOptionProps)(this);
        if (!('activeKey' in props)) {
          this.setState({
            _activeKey: activeKey
          });
        }
        this.__emit('change', activeKey);
      }
    },
    getNextActiveKey: function getNextActiveKey(next) {
      var activeKey = this.$data._activeKey;
      var children = [];
      this.$props.children.forEach(function (c) {
        var disabled = (0, _propsUtil.getValueByProp)(c, 'disabled');
        if (c && !disabled && disabled !== '') {
          if (next) {
            children.push(c);
          } else {
            children.unshift(c);
          }
        }
      });
      var length = children.length;
      var ret = length && children[0].key;
      children.forEach(function (child, i) {
        if (child.key === activeKey) {
          if (i === length - 1) {
            ret = children[0].key;
          } else {
            ret = children[i + 1].key;
          }
        }
      });
      return ret;
    },
    updateSentinelContext: function updateSentinelContext() {
      var _this = this;

      if (this.destroy) return;

      _raf2['default'].cancel(this.sentinelId);
      this.sentinelId = (0, _raf2['default'])(function () {
        if (_this.destroy) return;
        _this.$forceUpdate();
      });
    }
  },
  render: function render() {
    var _cls;

    var h = arguments[0];

    var props = this.$props;
    var prefixCls = props.prefixCls,
        navWrapper = props.navWrapper,
        tabBarPosition = props.tabBarPosition,
        renderTabContent = props.renderTabContent,
        renderTabBar = props.renderTabBar,
        destroyInactiveTabPane = props.destroyInactiveTabPane,
        direction = props.direction,
        tabBarGutter = props.tabBarGutter;

    var cls = (_cls = {}, (0, _defineProperty3['default'])(_cls, prefixCls, 1), (0, _defineProperty3['default'])(_cls, prefixCls + '-' + tabBarPosition, 1), (0, _defineProperty3['default'])(_cls, prefixCls + '-rtl', direction === 'rtl'), _cls);

    this.tabBar = renderTabBar();
    var tabBar = (0, _vnode.cloneElement)(this.tabBar, {
      props: {
        prefixCls: prefixCls,
        navWrapper: navWrapper,
        tabBarPosition: tabBarPosition,
        panels: props.children,
        activeKey: this.$data._activeKey,
        direction: direction,
        tabBarGutter: tabBarGutter
      },
      on: {
        keydown: this.onNavKeyDown,
        tabClick: this.onTabClick
      },
      key: 'tabBar'
    });
    var tabContent = (0, _vnode.cloneElement)(renderTabContent(), {
      props: {
        prefixCls: prefixCls,
        tabBarPosition: tabBarPosition,
        activeKey: this.$data._activeKey,
        destroyInactiveTabPane: destroyInactiveTabPane,
        direction: direction
      },
      on: {
        change: this.setActiveKey
      },
      children: props.children,
      key: 'tabContent'
    });

    var sentinelStart = h(_Sentinel2['default'], {
      key: 'sentinelStart',
      attrs: { setRef: this.setSentinelStart,
        nextElement: this.panelSentinelStart
      }
    });
    var sentinelEnd = h(_Sentinel2['default'], {
      key: 'sentinelEnd',
      attrs: { setRef: this.setSentinelEnd,
        prevElement: this.panelSentinelEnd
      }
    });

    var contents = [];

    if (tabBarPosition === 'bottom') {
      contents.push(sentinelStart, tabContent, sentinelEnd, tabBar);
    } else {
      contents.push(tabBar, sentinelStart, tabContent, sentinelEnd);
    }
    var listeners = (0, _extends3['default'])({}, (0, _omit2['default'])((0, _propsUtil.getListeners)(this), ['change']), {
      scroll: this.onScroll
    });
    return h(
      'div',
      { on: listeners, 'class': cls },
      [contents]
    );
  }
};