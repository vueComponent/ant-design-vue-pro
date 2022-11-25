import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import animation from '../_util/openAnimation';
import { getOptionProps, initDefaultProps, getComponentFromProp, isValidElement, getListeners } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import VcCollapse, { collapseProps } from '../vc-collapse';
import Icon from '../icon';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export default {
  name: 'ACollapse',
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  props: initDefaultProps(collapseProps(), {
    bordered: true,
    openAnimation: animation,
    expandIconPosition: 'left'
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    renderExpandIcon: function renderExpandIcon(panelProps, prefixCls) {
      var h = this.$createElement;

      var expandIcon = getComponentFromProp(this, 'expandIcon', panelProps);
      var icon = expandIcon || h(Icon, {
        attrs: { type: 'right', rotate: panelProps.isActive ? 90 : undefined }
      });
      return isValidElement(Array.isArray(expandIcon) ? icon[0] : icon) ? cloneElement(icon, {
        'class': prefixCls + '-arrow'
      }) : icon;
    }
  },
  render: function render() {
    var _collapseClassName,
        _this = this;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        bordered = this.bordered,
        expandIconPosition = this.expandIconPosition;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('collapse', customizePrefixCls);

    var collapseClassName = (_collapseClassName = {}, _defineProperty(_collapseClassName, prefixCls + '-borderless', !bordered), _defineProperty(_collapseClassName, prefixCls + '-icon-position-' + expandIconPosition, true), _collapseClassName);
    var rcCollapeProps = {
      props: _extends({}, getOptionProps(this), {
        prefixCls: prefixCls,
        expandIcon: function expandIcon(panelProps) {
          return _this.renderExpandIcon(panelProps, prefixCls);
        }
      }),
      'class': collapseClassName,
      on: getListeners(this)
    };
    return h(
      VcCollapse,
      rcCollapeProps,
      [this.$slots['default']]
    );
  }
};