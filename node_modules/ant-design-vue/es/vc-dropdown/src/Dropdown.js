import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import PropTypes from '../../_util/vue-types';
import Trigger from '../../vc-trigger';
import placements from './placements';
import { hasProp, getEvents, getOptionProps } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import { cloneElement } from '../../_util/vnode';

export default {
  mixins: [BaseMixin],
  props: {
    minOverlayWidthMatchTrigger: PropTypes.bool,
    prefixCls: PropTypes.string.def('rc-dropdown'),
    transitionName: PropTypes.string,
    overlayClassName: PropTypes.string.def(''),
    openClassName: PropTypes.string,
    animation: PropTypes.any,
    align: PropTypes.object,
    overlayStyle: PropTypes.object.def(function () {
      return {};
    }),
    placement: PropTypes.string.def('bottomLeft'),
    overlay: PropTypes.any,
    trigger: PropTypes.array.def(['hover']),
    alignPoint: PropTypes.bool,
    showAction: PropTypes.array.def([]),
    hideAction: PropTypes.array.def([]),
    getPopupContainer: PropTypes.func,
    visible: PropTypes.bool,
    defaultVisible: PropTypes.bool.def(false),
    mouseEnterDelay: PropTypes.number.def(0.15),
    mouseLeaveDelay: PropTypes.number.def(0.1)
  },
  data: function data() {
    var sVisible = this.defaultVisible;
    if (hasProp(this, 'visible')) {
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
      if (!hasProp(this, 'visible')) {
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
      if (!hasProp(this, 'visible')) {
        this.setState({
          sVisible: visible
        });
      }
      this.__emit('visibleChange', visible);
    },
    getMinOverlayWidthMatchTrigger: function getMinOverlayWidthMatchTrigger() {
      var props = getOptionProps(this);
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

      this.childOriginEvents = getEvents($slots.overlay[0]);
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
      return cloneElement($slots.overlay[0], extraOverlayProps);
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

      return sVisible && children ? cloneElement(children, { 'class': this.getOpenClassName() }) : children;
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
        otherProps = _objectWithoutProperties(_$props2, ['prefixCls', 'transitionName', 'animation', 'align', 'placement', 'getPopupContainer', 'showAction', 'hideAction', 'overlayClassName', 'overlayStyle', 'trigger']);

    var triggerHideAction = hideAction;
    if (!triggerHideAction && trigger.indexOf('contextmenu') !== -1) {
      triggerHideAction = ['click'];
    }

    var triggerProps = {
      props: _extends({}, otherProps, {
        prefixCls: prefixCls,
        popupClassName: overlayClassName,
        popupStyle: overlayStyle,
        builtinPlacements: placements,
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
      Trigger,
      triggerProps,
      [this.renderChildren(), h(
        'template',
        { slot: 'popup' },
        [this.$slots.overlay && this.getMenuElement()]
      )]
    );
  }
};