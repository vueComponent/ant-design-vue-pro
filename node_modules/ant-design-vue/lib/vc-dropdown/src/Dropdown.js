'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcTrigger = require('../../vc-trigger');

var _vcTrigger2 = _interopRequireDefault(_vcTrigger);

var _placements = require('./placements');

var _placements2 = _interopRequireDefault(_placements);

var _propsUtil = require('../../_util/props-util');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vnode = require('../../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  props: {
    minOverlayWidthMatchTrigger: _vueTypes2['default'].bool,
    prefixCls: _vueTypes2['default'].string.def('rc-dropdown'),
    transitionName: _vueTypes2['default'].string,
    overlayClassName: _vueTypes2['default'].string.def(''),
    openClassName: _vueTypes2['default'].string,
    animation: _vueTypes2['default'].any,
    align: _vueTypes2['default'].object,
    overlayStyle: _vueTypes2['default'].object.def(function () {
      return {};
    }),
    placement: _vueTypes2['default'].string.def('bottomLeft'),
    overlay: _vueTypes2['default'].any,
    trigger: _vueTypes2['default'].array.def(['hover']),
    alignPoint: _vueTypes2['default'].bool,
    showAction: _vueTypes2['default'].array.def([]),
    hideAction: _vueTypes2['default'].array.def([]),
    getPopupContainer: _vueTypes2['default'].func,
    visible: _vueTypes2['default'].bool,
    defaultVisible: _vueTypes2['default'].bool.def(false),
    mouseEnterDelay: _vueTypes2['default'].number.def(0.15),
    mouseLeaveDelay: _vueTypes2['default'].number.def(0.1)
  },
  data: function data() {
    var sVisible = this.defaultVisible;
    if ((0, _propsUtil.hasProp)(this, 'visible')) {
      sVisible = this.visible;
    }
    return {
      sVisible: sVisible
    };
  },

  watch: {
    visible: function visible(val) {
      if (val !== undefined) {
        this.setState({
          sVisible: val
        });
      }
    }
  },
  methods: {
    onClick: function onClick(e) {
      // do no call onVisibleChange, if you need click to hide, use onClick and control visible
      if (!(0, _propsUtil.hasProp)(this, 'visible')) {
        this.setState({
          sVisible: false
        });
      }
      this.$emit('overlayClick', e);
      if (this.childOriginEvents.click) {
        this.childOriginEvents.click(e);
      }
    },
    onVisibleChange: function onVisibleChange(visible) {
      if (!(0, _propsUtil.hasProp)(this, 'visible')) {
        this.setState({
          sVisible: visible
        });
      }
      this.__emit('visibleChange', visible);
    },
    getMinOverlayWidthMatchTrigger: function getMinOverlayWidthMatchTrigger() {
      var props = (0, _propsUtil.getOptionProps)(this);
      var minOverlayWidthMatchTrigger = props.minOverlayWidthMatchTrigger,
          alignPoint = props.alignPoint;

      if ('minOverlayWidthMatchTrigger' in props) {
        return minOverlayWidthMatchTrigger;
      }

      return !alignPoint;
    },
    getOverlayElement: function getOverlayElement() {
      var overlay = this.overlay || this.$slots.overlay || this.$scopedSlots.overlay;
      var overlayElement = void 0;
      if (typeof overlay === 'function') {
        overlayElement = overlay();
      } else {
        overlayElement = overlay;
      }
      return overlayElement;
    },
    getMenuElement: function getMenuElement() {
      var _this = this;

      var onClick = this.onClick,
          prefixCls = this.prefixCls,
          $slots = this.$slots;

      this.childOriginEvents = (0, _propsUtil.getEvents)($slots.overlay[0]);
      var overlayElement = this.getOverlayElement();
      var extraOverlayProps = {
        props: {
          prefixCls: prefixCls + '-menu',
          getPopupContainer: function getPopupContainer() {
            return _this.getPopupDomNode();
          }
        },
        on: {
          click: onClick
        }
      };
      if (typeof overlayElement.type === 'string') {
        delete extraOverlayProps.props.prefixCls;
      }
      return (0, _vnode.cloneElement)($slots.overlay[0], extraOverlayProps);
    },
    getMenuElementOrLambda: function getMenuElementOrLambda() {
      var overlay = this.overlay || this.$slots.overlay || this.$scopedSlots.overlay;
      if (typeof overlay === 'function') {
        return this.getMenuElement;
      }
      return this.getMenuElement();
    },
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.trigger.getPopupDomNode();
    },
    getOpenClassName: function getOpenClassName() {
      var _$props = this.$props,
          openClassName = _$props.openClassName,
          prefixCls = _$props.prefixCls;

      if (openClassName !== undefined) {
        return openClassName;
      }
      return prefixCls + '-open';
    },
    afterVisibleChange: function afterVisibleChange(visible) {
      if (visible && this.getMinOverlayWidthMatchTrigger()) {
        var overlayNode = this.getPopupDomNode();
        var rootNode = this.$el;
        if (rootNode && overlayNode && rootNode.offsetWidth > overlayNode.offsetWidth) {
          overlayNode.style.minWidth = rootNode.offsetWidth + 'px';
          if (this.$refs.trigger && this.$refs.trigger._component && this.$refs.trigger._component.$refs && this.$refs.trigger._component.$refs.alignInstance) {
            this.$refs.trigger._component.$refs.alignInstance.forceAlign();
          }
        }
      }
    },
    renderChildren: function renderChildren() {
      var children = this.$slots['default'] && this.$slots['default'][0];
      var sVisible = this.sVisible;

      return sVisible && children ? (0, _vnode.cloneElement)(children, { 'class': this.getOpenClassName() }) : children;
    }
  },

  render: function render() {
    var h = arguments[0];
    var _$props2 = this.$props,
        prefixCls = _$props2.prefixCls,
        transitionName = _$props2.transitionName,
        animation = _$props2.animation,
        align = _$props2.align,
        placement = _$props2.placement,
        getPopupContainer = _$props2.getPopupContainer,
        showAction = _$props2.showAction,
        hideAction = _$props2.hideAction,
        overlayClassName = _$props2.overlayClassName,
        overlayStyle = _$props2.overlayStyle,
        trigger = _$props2.trigger,
        otherProps = (0, _objectWithoutProperties3['default'])(_$props2, ['prefixCls', 'transitionName', 'animation', 'align', 'placement', 'getPopupContainer', 'showAction', 'hideAction', 'overlayClassName', 'overlayStyle', 'trigger']);

    var triggerHideAction = hideAction;
    if (!triggerHideAction && trigger.indexOf('contextmenu') !== -1) {
      triggerHideAction = ['click'];
    }

    var triggerProps = {
      props: (0, _extends3['default'])({}, otherProps, {
        prefixCls: prefixCls,
        popupClassName: overlayClassName,
        popupStyle: overlayStyle,
        builtinPlacements: _placements2['default'],
        action: trigger,
        showAction: showAction,
        hideAction: triggerHideAction || [],
        popupPlacement: placement,
        popupAlign: align,
        popupTransitionName: transitionName,
        popupAnimation: animation,
        popupVisible: this.sVisible,
        afterPopupVisibleChange: this.afterVisibleChange,
        getPopupContainer: getPopupContainer
      }),
      on: {
        popupVisibleChange: this.onVisibleChange
      },
      ref: 'trigger'
    };
    return h(
      _vcTrigger2['default'],
      triggerProps,
      [this.renderChildren(), h(
        'template',
        { slot: 'popup' },
        [this.$slots.overlay && this.getMenuElement()]
      )]
    );
  }
};