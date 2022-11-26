'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueRef = require('vue-ref');

var _vueRef2 = _interopRequireDefault(_vueRef);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _contains = require('../vc-util/Dom/contains');

var _contains2 = _interopRequireDefault(_contains);

var _propsUtil = require('../_util/props-util');

var _requestAnimationTimeout = require('../_util/requestAnimationTimeout');

var _addEventListener = require('../vc-util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _Popup = require('./Popup');

var _Popup2 = _interopRequireDefault(_Popup);

var _utils = require('./utils');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vnode = require('../_util/vnode');

var _Portal = require('../_util/Portal');

var _Portal2 = _interopRequireDefault(_Portal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_vue2['default'].use(_vueRef2['default'], { name: 'ant-ref' });

function returnEmptyString() {
  return '';
}

function returnDocument() {
  return window.document;
}
var ALL_HANDLERS = ['click', 'mousedown', 'touchstart', 'mouseenter', 'mouseleave', 'focus', 'blur', 'contextmenu'];

exports['default'] = {
  name: 'Trigger',
  mixins: [_BaseMixin2['default']],
  props: {
    action: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].arrayOf(_vueTypes2['default'].string)]).def([]),
    showAction: _vueTypes2['default'].any.def([]),
    hideAction: _vueTypes2['default'].any.def([]),
    getPopupClassNameFromAlign: _vueTypes2['default'].any.def(returnEmptyString),
    // onPopupVisibleChange: PropTypes.func.def(noop),
    afterPopupVisibleChange: _vueTypes2['default'].func.def(_utils.noop),
    popup: _vueTypes2['default'].any,
    popupStyle: _vueTypes2['default'].object.def(function () {
      return {};
    }),
    prefixCls: _vueTypes2['default'].string.def('rc-trigger-popup'),
    popupClassName: _vueTypes2['default'].string.def(''),
    popupPlacement: _vueTypes2['default'].string,
    builtinPlacements: _vueTypes2['default'].object,
    popupTransitionName: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object]),
    popupAnimation: _vueTypes2['default'].any,
    mouseEnterDelay: _vueTypes2['default'].number.def(0),
    mouseLeaveDelay: _vueTypes2['default'].number.def(0.1),
    zIndex: _vueTypes2['default'].number,
    focusDelay: _vueTypes2['default'].number.def(0),
    blurDelay: _vueTypes2['default'].number.def(0.15),
    getPopupContainer: _vueTypes2['default'].func,
    getDocument: _vueTypes2['default'].func.def(returnDocument),
    forceRender: _vueTypes2['default'].bool,
    destroyPopupOnHide: _vueTypes2['default'].bool.def(false),
    mask: _vueTypes2['default'].bool.def(false),
    maskClosable: _vueTypes2['default'].bool.def(true),
    // onPopupAlign: PropTypes.func.def(noop),
    popupAlign: _vueTypes2['default'].object.def(function () {
      return {};
    }),
    popupVisible: _vueTypes2['default'].bool,
    defaultPopupVisible: _vueTypes2['default'].bool.def(false),
    maskTransitionName: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object]),
    maskAnimation: _vueTypes2['default'].string,
    stretch: _vueTypes2['default'].string,
    alignPoint: _vueTypes2['default'].bool // Maybe we can support user pass position in the future
  },
  provide: function provide() {
    return {
      vcTriggerContext: this
    };
  },

  inject: {
    vcTriggerContext: { 'default': function _default() {
        return {};
      } },
    savePopupRef: { 'default': function _default() {
        return _utils.noop;
      } },
    dialogContext: { 'default': function _default() {
        return null;
      } }
  },
  data: function data() {
    var _this = this;

    var props = this.$props;
    var popupVisible = void 0;
    if ((0, _propsUtil.hasProp)(this, 'popupVisible')) {
      popupVisible = !!props.popupVisible;
    } else {
      popupVisible = !!props.defaultPopupVisible;
    }
    ALL_HANDLERS.forEach(function (h) {
      _this['fire' + h] = function (e) {
        _this.fireEvents(h, e);
      };
    });
    return {
      prevPopupVisible: popupVisible,
      sPopupVisible: popupVisible,
      point: null
    };
  },

  watch: {
    popupVisible: function popupVisible(val) {
      if (val !== undefined) {
        this.prevPopupVisible = this.sPopupVisible;
        this.sPopupVisible = val;
      }
    }
  },
  deactivated: function deactivated() {
    this.setPopupVisible(false);
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.updatedCal();
    });
  },
  updated: function updated() {
    var _this3 = this;

    this.$nextTick(function () {
      _this3.updatedCal();
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.clearDelayTimer();
    this.clearOutsideHandler();
    clearTimeout(this.mouseDownTimeout);
  },

  methods: {
    updatedCal: function updatedCal() {
      var props = this.$props;
      var state = this.$data;

      // We must listen to `mousedown` or `touchstart`, edge case:
      // https://github.com/ant-design/ant-design/issues/5804
      // https://github.com/react-component/calendar/issues/250
      // https://github.com/react-component/trigger/issues/50
      if (state.sPopupVisible) {
        var currentDocument = void 0;
        if (!this.clickOutsideHandler && (this.isClickToHide() || this.isContextmenuToShow())) {
          currentDocument = props.getDocument();
          this.clickOutsideHandler = (0, _addEventListener2['default'])(currentDocument, 'mousedown', this.onDocumentClick);
        }
        // always hide on mobile
        if (!this.touchOutsideHandler) {
          currentDocument = currentDocument || props.getDocument();
          this.touchOutsideHandler = (0, _addEventListener2['default'])(currentDocument, 'touchstart', this.onDocumentClick);
        }
        // close popup when trigger type contains 'onContextmenu' and document is scrolling.
        if (!this.contextmenuOutsideHandler1 && this.isContextmenuToShow()) {
          currentDocument = currentDocument || props.getDocument();
          this.contextmenuOutsideHandler1 = (0, _addEventListener2['default'])(currentDocument, 'scroll', this.onContextmenuClose);
        }
        // close popup when trigger type contains 'onContextmenu' and window is blur.
        if (!this.contextmenuOutsideHandler2 && this.isContextmenuToShow()) {
          this.contextmenuOutsideHandler2 = (0, _addEventListener2['default'])(window, 'blur', this.onContextmenuClose);
        }
      } else {
        this.clearOutsideHandler();
      }
    },
    onMouseenter: function onMouseenter(e) {
      var mouseEnterDelay = this.$props.mouseEnterDelay;

      this.fireEvents('mouseenter', e);
      this.delaySetPopupVisible(true, mouseEnterDelay, mouseEnterDelay ? null : e);
    },
    onMouseMove: function onMouseMove(e) {
      this.fireEvents('mousemove', e);
      this.setPoint(e);
    },
    onMouseleave: function onMouseleave(e) {
      this.fireEvents('mouseleave', e);
      this.delaySetPopupVisible(false, this.$props.mouseLeaveDelay);
    },
    onPopupMouseenter: function onPopupMouseenter() {
      this.clearDelayTimer();
    },
    onPopupMouseleave: function onPopupMouseleave(e) {
      if (e && e.relatedTarget && !e.relatedTarget.setTimeout && this._component && this._component.getPopupDomNode && (0, _contains2['default'])(this._component.getPopupDomNode(), e.relatedTarget)) {
        return;
      }
      this.delaySetPopupVisible(false, this.$props.mouseLeaveDelay);
    },
    onFocus: function onFocus(e) {
      this.fireEvents('focus', e);
      // incase focusin and focusout
      this.clearDelayTimer();
      if (this.isFocusToShow()) {
        this.focusTime = Date.now();
        this.delaySetPopupVisible(true, this.$props.focusDelay);
      }
    },
    onMousedown: function onMousedown(e) {
      this.fireEvents('mousedown', e);
      this.preClickTime = Date.now();
    },
    onTouchstart: function onTouchstart(e) {
      this.fireEvents('touchstart', e);
      this.preTouchTime = Date.now();
    },
    onBlur: function onBlur(e) {
      if (!(0, _contains2['default'])(e.target, e.relatedTarget || document.activeElement)) {
        this.fireEvents('blur', e);
        this.clearDelayTimer();
        if (this.isBlurToHide()) {
          this.delaySetPopupVisible(false, this.$props.blurDelay);
        }
      }
    },
    onContextmenu: function onContextmenu(e) {
      e.preventDefault();
      this.fireEvents('contextmenu', e);
      this.setPopupVisible(true, e);
    },
    onContextmenuClose: function onContextmenuClose() {
      if (this.isContextmenuToShow()) {
        this.close();
      }
    },
    onClick: function onClick(event) {
      this.fireEvents('click', event);
      // focus will trigger click
      if (this.focusTime) {
        var preTime = void 0;
        if (this.preClickTime && this.preTouchTime) {
          preTime = Math.min(this.preClickTime, this.preTouchTime);
        } else if (this.preClickTime) {
          preTime = this.preClickTime;
        } else if (this.preTouchTime) {
          preTime = this.preTouchTime;
        }
        if (Math.abs(preTime - this.focusTime) < 20) {
          return;
        }
        this.focusTime = 0;
      }
      this.preClickTime = 0;
      this.preTouchTime = 0;
      // Only prevent default when all the action is click.
      // https://github.com/ant-design/ant-design/issues/17043
      // https://github.com/ant-design/ant-design/issues/17291
      if (this.isClickToShow() && (this.isClickToHide() || this.isBlurToHide()) && event && event.preventDefault) {
        event.preventDefault();
      }
      if (event && event.domEvent) {
        event.domEvent.preventDefault();
      }
      var nextVisible = !this.$data.sPopupVisible;
      if (this.isClickToHide() && !nextVisible || nextVisible && this.isClickToShow()) {
        this.setPopupVisible(!this.$data.sPopupVisible, event);
      }
    },
    onPopupMouseDown: function onPopupMouseDown() {
      var _this4 = this;

      var _vcTriggerContext = this.vcTriggerContext,
          vcTriggerContext = _vcTriggerContext === undefined ? {} : _vcTriggerContext;

      this.hasPopupMouseDown = true;

      clearTimeout(this.mouseDownTimeout);
      this.mouseDownTimeout = setTimeout(function () {
        _this4.hasPopupMouseDown = false;
      }, 0);

      if (vcTriggerContext.onPopupMouseDown) {
        vcTriggerContext.onPopupMouseDown.apply(vcTriggerContext, arguments);
      }
    },
    onDocumentClick: function onDocumentClick(event) {
      if (this.$props.mask && !this.$props.maskClosable) {
        return;
      }
      var target = event.target;
      var root = this.$el;
      if (!(0, _contains2['default'])(root, target) && !this.hasPopupMouseDown) {
        this.close();
      }
    },
    getPopupDomNode: function getPopupDomNode() {
      if (this._component && this._component.getPopupDomNode) {
        return this._component.getPopupDomNode();
      }
      return null;
    },
    getRootDomNode: function getRootDomNode() {
      return this.$el;
      // return this.$el.children[0] || this.$el
    },
    handleGetPopupClassFromAlign: function handleGetPopupClassFromAlign(align) {
      var className = [];
      var props = this.$props;
      var popupPlacement = props.popupPlacement,
          builtinPlacements = props.builtinPlacements,
          prefixCls = props.prefixCls,
          alignPoint = props.alignPoint,
          getPopupClassNameFromAlign = props.getPopupClassNameFromAlign;

      if (popupPlacement && builtinPlacements) {
        className.push((0, _utils.getAlignPopupClassName)(builtinPlacements, prefixCls, align, alignPoint));
      }
      if (getPopupClassNameFromAlign) {
        className.push(getPopupClassNameFromAlign(align));
      }
      return className.join(' ');
    },
    getPopupAlign: function getPopupAlign() {
      var props = this.$props;
      var popupPlacement = props.popupPlacement,
          popupAlign = props.popupAlign,
          builtinPlacements = props.builtinPlacements;

      if (popupPlacement && builtinPlacements) {
        return (0, _utils.getAlignFromPlacement)(builtinPlacements, popupPlacement, popupAlign);
      }
      return popupAlign;
    },
    savePopup: function savePopup(node) {
      this._component = node;
      this.savePopupRef(node);
    },
    getComponent: function getComponent() {
      var h = this.$createElement;

      var self = this;
      var mouseProps = {};
      if (this.isMouseEnterToShow()) {
        mouseProps.mouseenter = self.onPopupMouseenter;
      }
      if (this.isMouseLeaveToHide()) {
        mouseProps.mouseleave = self.onPopupMouseleave;
      }
      mouseProps.mousedown = this.onPopupMouseDown;
      mouseProps.touchstart = this.onPopupMouseDown;
      var handleGetPopupClassFromAlign = self.handleGetPopupClassFromAlign,
          getRootDomNode = self.getRootDomNode,
          getContainer = self.getContainer;
      var _self$$props = self.$props,
          prefixCls = _self$$props.prefixCls,
          destroyPopupOnHide = _self$$props.destroyPopupOnHide,
          popupClassName = _self$$props.popupClassName,
          action = _self$$props.action,
          popupAnimation = _self$$props.popupAnimation,
          popupTransitionName = _self$$props.popupTransitionName,
          popupStyle = _self$$props.popupStyle,
          mask = _self$$props.mask,
          maskAnimation = _self$$props.maskAnimation,
          maskTransitionName = _self$$props.maskTransitionName,
          zIndex = _self$$props.zIndex,
          stretch = _self$$props.stretch,
          alignPoint = _self$$props.alignPoint;
      var _$data = this.$data,
          sPopupVisible = _$data.sPopupVisible,
          point = _$data.point;

      var align = this.getPopupAlign();
      var popupProps = {
        props: {
          prefixCls: prefixCls,
          destroyPopupOnHide: destroyPopupOnHide,
          visible: sPopupVisible,
          point: alignPoint && point,
          action: action,
          align: align,
          animation: popupAnimation,
          getClassNameFromAlign: handleGetPopupClassFromAlign,
          stretch: stretch,
          getRootDomNode: getRootDomNode,
          mask: mask,
          zIndex: zIndex,
          transitionName: popupTransitionName,
          maskAnimation: maskAnimation,
          maskTransitionName: maskTransitionName,
          getContainer: getContainer,
          popupClassName: popupClassName,
          popupStyle: popupStyle
        },
        on: (0, _extends3['default'])({
          align: (0, _propsUtil.getListeners)(this).popupAlign || _utils.noop
        }, mouseProps),
        directives: [{
          name: 'ant-ref',
          value: this.savePopup
        }]
      };
      return h(
        _Popup2['default'],
        popupProps,
        [(0, _propsUtil.getComponentFromProp)(self, 'popup')]
      );
    },
    getContainer: function getContainer() {
      var props = this.$props,
          dialogContext = this.dialogContext;

      var popupContainer = document.createElement('div');
      // Make sure default popup container will never cause scrollbar appearing
      // https://github.com/react-component/trigger/issues/41
      popupContainer.style.position = 'absolute';
      popupContainer.style.top = '0';
      popupContainer.style.left = '0';
      popupContainer.style.width = '100%';
      var mountNode = props.getPopupContainer ? props.getPopupContainer(this.$el, dialogContext) : props.getDocument().body;
      mountNode.appendChild(popupContainer);
      this.popupContainer = popupContainer;
      return popupContainer;
    },
    setPopupVisible: function setPopupVisible(sPopupVisible, event) {
      var alignPoint = this.alignPoint,
          prevPopupVisible = this.sPopupVisible;

      this.clearDelayTimer();
      if (prevPopupVisible !== sPopupVisible) {
        if (!(0, _propsUtil.hasProp)(this, 'popupVisible')) {
          this.setState({
            sPopupVisible: sPopupVisible,
            prevPopupVisible: prevPopupVisible
          });
        }
        var listeners = (0, _propsUtil.getListeners)(this);
        listeners.popupVisibleChange && listeners.popupVisibleChange(sPopupVisible);
      }
      // Always record the point position since mouseEnterDelay will delay the show
      if (alignPoint && event) {
        this.setPoint(event);
      }
    },
    setPoint: function setPoint(point) {
      var alignPoint = this.$props.alignPoint;

      if (!alignPoint || !point) return;

      this.setState({
        point: {
          pageX: point.pageX,
          pageY: point.pageY
        }
      });
    },
    handlePortalUpdate: function handlePortalUpdate() {
      if (this.prevPopupVisible !== this.sPopupVisible) {
        this.afterPopupVisibleChange(this.sPopupVisible);
      }
    },
    delaySetPopupVisible: function delaySetPopupVisible(visible, delayS, event) {
      var _this5 = this;

      var delay = delayS * 1000;
      this.clearDelayTimer();
      if (delay) {
        var point = event ? { pageX: event.pageX, pageY: event.pageY } : null;
        this.delayTimer = (0, _requestAnimationTimeout.requestAnimationTimeout)(function () {
          _this5.setPopupVisible(visible, point);
          _this5.clearDelayTimer();
        }, delay);
      } else {
        this.setPopupVisible(visible, event);
      }
    },
    clearDelayTimer: function clearDelayTimer() {
      if (this.delayTimer) {
        (0, _requestAnimationTimeout.cancelAnimationTimeout)(this.delayTimer);
        this.delayTimer = null;
      }
    },
    clearOutsideHandler: function clearOutsideHandler() {
      if (this.clickOutsideHandler) {
        this.clickOutsideHandler.remove();
        this.clickOutsideHandler = null;
      }

      if (this.contextmenuOutsideHandler1) {
        this.contextmenuOutsideHandler1.remove();
        this.contextmenuOutsideHandler1 = null;
      }

      if (this.contextmenuOutsideHandler2) {
        this.contextmenuOutsideHandler2.remove();
        this.contextmenuOutsideHandler2 = null;
      }

      if (this.touchOutsideHandler) {
        this.touchOutsideHandler.remove();
        this.touchOutsideHandler = null;
      }
    },
    createTwoChains: function createTwoChains(event) {
      var fn = function fn() {};
      var events = (0, _propsUtil.getListeners)(this);
      if (this.childOriginEvents[event] && events[event]) {
        return this['fire' + event];
      }
      fn = this.childOriginEvents[event] || events[event] || fn;
      return fn;
    },
    isClickToShow: function isClickToShow() {
      var _$props = this.$props,
          action = _$props.action,
          showAction = _$props.showAction;

      return action.indexOf('click') !== -1 || showAction.indexOf('click') !== -1;
    },
    isContextmenuToShow: function isContextmenuToShow() {
      var _$props2 = this.$props,
          action = _$props2.action,
          showAction = _$props2.showAction;

      return action.indexOf('contextmenu') !== -1 || showAction.indexOf('contextmenu') !== -1;
    },
    isClickToHide: function isClickToHide() {
      var _$props3 = this.$props,
          action = _$props3.action,
          hideAction = _$props3.hideAction;

      return action.indexOf('click') !== -1 || hideAction.indexOf('click') !== -1;
    },
    isMouseEnterToShow: function isMouseEnterToShow() {
      var _$props4 = this.$props,
          action = _$props4.action,
          showAction = _$props4.showAction;

      return action.indexOf('hover') !== -1 || showAction.indexOf('mouseenter') !== -1;
    },
    isMouseLeaveToHide: function isMouseLeaveToHide() {
      var _$props5 = this.$props,
          action = _$props5.action,
          hideAction = _$props5.hideAction;

      return action.indexOf('hover') !== -1 || hideAction.indexOf('mouseleave') !== -1;
    },
    isFocusToShow: function isFocusToShow() {
      var _$props6 = this.$props,
          action = _$props6.action,
          showAction = _$props6.showAction;

      return action.indexOf('focus') !== -1 || showAction.indexOf('focus') !== -1;
    },
    isBlurToHide: function isBlurToHide() {
      var _$props7 = this.$props,
          action = _$props7.action,
          hideAction = _$props7.hideAction;

      return action.indexOf('focus') !== -1 || hideAction.indexOf('blur') !== -1;
    },
    forcePopupAlign: function forcePopupAlign() {
      if (this.$data.sPopupVisible && this._component && this._component.$refs.alignInstance) {
        this._component.$refs.alignInstance.forceAlign();
      }
    },
    fireEvents: function fireEvents(type, e) {
      if (this.childOriginEvents[type]) {
        this.childOriginEvents[type](e);
      }
      this.__emit(type, e);
    },
    close: function close() {
      this.setPopupVisible(false);
    }
  },
  render: function render() {
    var _this6 = this;

    var h = arguments[0];
    var sPopupVisible = this.sPopupVisible;

    var children = (0, _propsUtil.filterEmpty)(this.$slots['default']);
    var _$props8 = this.$props,
        forceRender = _$props8.forceRender,
        alignPoint = _$props8.alignPoint;


    if (children.length > 1) {
      (0, _warning2['default'])(false, 'Trigger $slots.default.length > 1, just support only one default', true);
    }
    var child = children[0];
    this.childOriginEvents = (0, _propsUtil.getEvents)(child);
    var newChildProps = {
      props: {},
      on: {},
      key: 'trigger'
    };

    if (this.isContextmenuToShow()) {
      newChildProps.on.contextmenu = this.onContextmenu;
    } else {
      newChildProps.on.contextmenu = this.createTwoChains('contextmenu');
    }

    if (this.isClickToHide() || this.isClickToShow()) {
      newChildProps.on.click = this.onClick;
      newChildProps.on.mousedown = this.onMousedown;
      newChildProps.on.touchstart = this.onTouchstart;
    } else {
      newChildProps.on.click = this.createTwoChains('click');
      newChildProps.on.mousedown = this.createTwoChains('mousedown');
      newChildProps.on.touchstart = this.createTwoChains('onTouchstart');
    }
    if (this.isMouseEnterToShow()) {
      newChildProps.on.mouseenter = this.onMouseenter;
      if (alignPoint) {
        newChildProps.on.mousemove = this.onMouseMove;
      }
    } else {
      newChildProps.on.mouseenter = this.createTwoChains('mouseenter');
    }
    if (this.isMouseLeaveToHide()) {
      newChildProps.on.mouseleave = this.onMouseleave;
    } else {
      newChildProps.on.mouseleave = this.createTwoChains('mouseleave');
    }

    if (this.isFocusToShow() || this.isBlurToHide()) {
      newChildProps.on.focus = this.onFocus;
      newChildProps.on.blur = this.onBlur;
    } else {
      newChildProps.on.focus = this.createTwoChains('focus');
      newChildProps.on.blur = function (e) {
        if (e && (!e.relatedTarget || !(0, _contains2['default'])(e.target, e.relatedTarget))) {
          _this6.createTwoChains('blur')(e);
        }
      };
    }

    var trigger = (0, _vnode.cloneElement)(child, newChildProps);
    var portal = void 0;
    // prevent unmounting after it's rendered
    if (sPopupVisible || this._component || forceRender) {
      portal = h(_Portal2['default'], {
        key: 'portal',
        attrs: { children: this.getComponent(),
          getContainer: this.getContainer,
          didUpdate: this.handlePortalUpdate
        }
      });
    }
    return portal ? (0, _vnode.cloneElement)(trigger, {
      children: [].concat((0, _toConsumableArray3['default'])((trigger.componentOptions ? trigger.componentOptions.children : trigger.children) || []), [portal])
    }) : trigger;
  }
};