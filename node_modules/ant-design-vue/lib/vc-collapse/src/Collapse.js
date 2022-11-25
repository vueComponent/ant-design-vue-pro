'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../_util/props-util');

var _vnode = require('../../_util/vnode');

var _openAnimationFactory = require('./openAnimationFactory');

var _openAnimationFactory2 = _interopRequireDefault(_openAnimationFactory);

var _commonProps = require('./commonProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toArray(activeKey) {
  var currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    currentActiveKey = currentActiveKey ? [currentActiveKey] : [];
  }
  return currentActiveKey.map(function (key) {
    return String(key);
  });
}
exports['default'] = {
  name: 'Collapse',
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  props: (0, _propsUtil.initDefaultProps)((0, _commonProps.collapseProps)(), {
    prefixCls: 'rc-collapse',
    accordion: false,
    destroyInactivePanel: false
  }),
  data: function data() {
    var _$props = this.$props,
        activeKey = _$props.activeKey,
        defaultActiveKey = _$props.defaultActiveKey,
        openAnimation = _$props.openAnimation,
        prefixCls = _$props.prefixCls;

    var currentActiveKey = defaultActiveKey;
    if ((0, _propsUtil.hasProp)(this, 'activeKey')) {
      currentActiveKey = activeKey;
    }
    var currentOpenAnimations = openAnimation || (0, _openAnimationFactory2['default'])(prefixCls);
    return {
      currentOpenAnimations: currentOpenAnimations,
      stateActiveKey: _toArray(currentActiveKey)
    };
  },

  watch: {
    activeKey: function activeKey(val) {
      this.setState({
        stateActiveKey: _toArray(val)
      });
    },
    openAnimation: function openAnimation(val) {
      this.setState({
        currentOpenAnimations: val
      });
    }
  },
  methods: {
    onClickItem: function onClickItem(key) {
      var activeKey = this.stateActiveKey;
      if (this.accordion) {
        activeKey = activeKey[0] === key ? [] : [key];
      } else {
        activeKey = [].concat((0, _toConsumableArray3['default'])(activeKey));
        var index = activeKey.indexOf(key);
        var isActive = index > -1;
        if (isActive) {
          // remove active state
          activeKey.splice(index, 1);
        } else {
          activeKey.push(key);
        }
      }
      this.setActiveKey(activeKey);
    },
    getNewChild: function getNewChild(child, index) {
      if ((0, _propsUtil.isEmptyElement)(child)) return;
      var activeKey = this.stateActiveKey;
      var _$props2 = this.$props,
          prefixCls = _$props2.prefixCls,
          accordion = _$props2.accordion,
          destroyInactivePanel = _$props2.destroyInactivePanel,
          expandIcon = _$props2.expandIcon;

      // If there is no key provide, use the panel order as default key

      var key = child.key || String(index);

      var _getPropsData = (0, _propsUtil.getPropsData)(child),
          header = _getPropsData.header,
          headerClass = _getPropsData.headerClass,
          disabled = _getPropsData.disabled;

      var isActive = false;

      if (accordion) {
        isActive = activeKey[0] === key;
      } else {
        isActive = activeKey.indexOf(key) > -1;
      }

      var panelEvents = {};
      if (!disabled && disabled !== '') {
        panelEvents = {
          itemClick: this.onClickItem
        };
      }

      var props = {
        key: key,
        props: {
          panelKey: key,
          header: header,
          headerClass: headerClass,
          isActive: isActive,
          prefixCls: prefixCls,
          destroyInactivePanel: destroyInactivePanel,
          openAnimation: this.currentOpenAnimations,
          accordion: accordion,
          expandIcon: expandIcon
        },
        on: panelEvents
      };

      return (0, _vnode.cloneElement)(child, props);
    },
    getItems: function getItems() {
      var _this = this;

      var newChildren = [];
      this.$slots['default'] && this.$slots['default'].forEach(function (child, index) {
        newChildren.push(_this.getNewChild(child, index));
      });
      return newChildren;
    },
    setActiveKey: function setActiveKey(activeKey) {
      this.setState({ stateActiveKey: activeKey });
      this.$emit('change', this.accordion ? activeKey[0] : activeKey);
    }
  },
  render: function render() {
    var h = arguments[0];
    var _$props3 = this.$props,
        prefixCls = _$props3.prefixCls,
        accordion = _$props3.accordion;

    var collapseClassName = (0, _defineProperty3['default'])({}, prefixCls, true);
    return h(
      'div',
      { 'class': collapseClassName, attrs: { role: accordion ? 'tablist' : null }
      },
      [this.getItems()]
    );
  }
};