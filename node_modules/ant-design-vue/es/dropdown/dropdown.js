import _extends from 'babel-runtime/helpers/extends';
import RcDropdown from '../vc-dropdown/src/index';
import DropdownButton from './dropdown-button';
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import { getOptionProps, getPropsData, getComponentFromProp, getListeners } from '../_util/props-util';
import getDropdownProps from './getDropdownProps';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Icon from '../icon';

var DropdownProps = getDropdownProps();
var Dropdown = {
  name: 'ADropdown',
  props: _extends({}, DropdownProps, {
    prefixCls: PropTypes.string,
    mouseEnterDelay: PropTypes.number.def(0.15),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    placement: DropdownProps.placement.def('bottomLeft')
  }),
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  provide: function provide() {
    return {
      savePopupRef: this.savePopupRef
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    savePopupRef: function savePopupRef(ref) {
      this.popupRef = ref;
    },
    getTransitionName: function getTransitionName() {
      var _$props = this.$props,
          _$props$placement = _$props.placement,
          placement = _$props$placement === undefined ? '' : _$props$placement,
          transitionName = _$props.transitionName;

      if (transitionName !== undefined) {
        return transitionName;
      }
      if (placement.indexOf('top') >= 0) {
        return 'slide-down';
      }
      return 'slide-up';
    },
    renderOverlay: function renderOverlay(prefixCls) {
      var h = this.$createElement;

      var overlay = getComponentFromProp(this, 'overlay');
      var overlayNode = Array.isArray(overlay) ? overlay[0] : overlay;
      // menu cannot be selectable in dropdown defaultly
      // menu should be focusable in dropdown defaultly
      var overlayProps = overlayNode && getPropsData(overlayNode);

      var _ref = overlayProps || {},
          _ref$selectable = _ref.selectable,
          selectable = _ref$selectable === undefined ? false : _ref$selectable,
          _ref$focusable = _ref.focusable,
          focusable = _ref$focusable === undefined ? true : _ref$focusable;

      var expandIcon = h(
        'span',
        { 'class': prefixCls + '-menu-submenu-arrow' },
        [h(Icon, {
          attrs: { type: 'right' },
          'class': prefixCls + '-menu-submenu-arrow-icon' })]
      );

      var fixedModeOverlay = overlayNode && overlayNode.componentOptions ? cloneElement(overlayNode, {
        props: {
          mode: 'vertical',
          selectable: selectable,
          focusable: focusable,
          expandIcon: expandIcon
        }
      }) : overlay;
      return fixedModeOverlay;
    }
  },

  render: function render() {
    var h = arguments[0];
    var $slots = this.$slots;

    var props = getOptionProps(this);
    var customizePrefixCls = props.prefixCls,
        trigger = props.trigger,
        disabled = props.disabled,
        getPopupContainer = props.getPopupContainer;
    var getContextPopupContainer = this.configProvider.getPopupContainer;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('dropdown', customizePrefixCls);

    var dropdownTrigger = cloneElement($slots['default'], {
      'class': prefixCls + '-trigger',
      props: {
        disabled: disabled
      }
    });
    var triggerActions = disabled ? [] : trigger;
    var alignPoint = void 0;
    if (triggerActions && triggerActions.indexOf('contextmenu') !== -1) {
      alignPoint = true;
    }
    var dropdownProps = {
      props: _extends({
        alignPoint: alignPoint
      }, props, {
        prefixCls: prefixCls,
        getPopupContainer: getPopupContainer || getContextPopupContainer,
        transitionName: this.getTransitionName(),
        trigger: triggerActions
      }),
      on: getListeners(this)
    };
    return h(
      RcDropdown,
      dropdownProps,
      [dropdownTrigger, h(
        'template',
        { slot: 'overlay' },
        [this.renderOverlay(prefixCls)]
      )]
    );
  }
};

Dropdown.Button = DropdownButton;
export default Dropdown;
export { DropdownProps };