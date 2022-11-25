import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import Button from '../button';
import buttonTypes from '../button/buttonTypes';
import { ButtonGroupProps } from '../button/button-group';
import Dropdown from './dropdown';
import PropTypes from '../_util/vue-types';
import { hasProp, getComponentFromProp } from '../_util/props-util';
import getDropdownProps from './getDropdownProps';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Icon from '../icon';

var ButtonTypesProps = buttonTypes();
var DropdownProps = getDropdownProps();
var ButtonGroup = Button.Group;
var DropdownButtonProps = _extends({}, ButtonGroupProps, DropdownProps, {
  type: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'danger', 'default']).def('default'),
  size: PropTypes.oneOf(['small', 'large', 'default']).def('default'),
  htmlType: ButtonTypesProps.htmlType,
  href: PropTypes.string,
  disabled: PropTypes.bool,
  prefixCls: PropTypes.string,
  placement: DropdownProps.placement.def('bottomRight'),
  icon: PropTypes.any,
  title: PropTypes.string
});
export { DropdownButtonProps };
export default {
  name: 'ADropdownButton',
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  props: DropdownButtonProps,
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
    onClick: function onClick(e) {
      this.$emit('click', e);
    },
    onVisibleChange: function onVisibleChange(val) {
      this.$emit('visibleChange', val);
    }
  },
  render: function render() {
    var h = arguments[0];

    var _$props = this.$props,
        type = _$props.type,
        disabled = _$props.disabled,
        htmlType = _$props.htmlType,
        customizePrefixCls = _$props.prefixCls,
        trigger = _$props.trigger,
        align = _$props.align,
        visible = _$props.visible,
        placement = _$props.placement,
        getPopupContainer = _$props.getPopupContainer,
        href = _$props.href,
        title = _$props.title,
        restProps = _objectWithoutProperties(_$props, ['type', 'disabled', 'htmlType', 'prefixCls', 'trigger', 'align', 'visible', 'placement', 'getPopupContainer', 'href', 'title']);

    var icon = getComponentFromProp(this, 'icon') || h(Icon, {
      attrs: { type: 'ellipsis' }
    });
    var getContextPopupContainer = this.configProvider.getPopupContainer;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('dropdown-button', customizePrefixCls);
    var dropdownProps = {
      props: {
        align: align,
        disabled: disabled,
        trigger: disabled ? [] : trigger,
        placement: placement,
        getPopupContainer: getPopupContainer || getContextPopupContainer
      },
      on: {
        visibleChange: this.onVisibleChange
      }
    };
    if (hasProp(this, 'visible')) {
      dropdownProps.props.visible = visible;
    }

    var buttonGroupProps = {
      props: _extends({}, restProps),
      'class': prefixCls
    };

    return h(
      ButtonGroup,
      buttonGroupProps,
      [h(
        Button,
        {
          attrs: {
            type: type,
            disabled: disabled,

            htmlType: htmlType,
            href: href,
            title: title
          },
          on: {
            'click': this.onClick
          }
        },
        [this.$slots['default']]
      ), h(
        Dropdown,
        dropdownProps,
        [h(
          'template',
          { slot: 'overlay' },
          [getComponentFromProp(this, 'overlay')]
        ), h(
          Button,
          {
            attrs: { type: type }
          },
          [icon]
        )]
      )]
    );
  }
};