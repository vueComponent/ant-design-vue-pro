import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import { getComponentFromProp, getOptionProps, getListeners } from '../_util/props-util';
import Input from './Input';
import Icon from '../icon';
import inputProps from './inputProps';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

var ActionMap = {
  click: 'click',
  hover: 'mouseover'
};

export default {
  name: 'AInputPassword',
  mixins: [BaseMixin],
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: _extends({}, inputProps, {
    prefixCls: PropTypes.string,
    inputPrefixCls: PropTypes.string,
    action: PropTypes.string.def('click'),
    visibilityToggle: PropTypes.bool.def(true)
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      visible: false
    };
  },

  methods: {
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    onVisibleChange: function onVisibleChange() {
      if (this.disabled) {
        return;
      }
      this.setState({
        visible: !this.visible
      });
    },
    getIcon: function getIcon(prefixCls) {
      var _on;

      var h = this.$createElement;
      var action = this.$props.action;

      var iconTrigger = ActionMap[action] || '';
      var iconProps = {
        props: {
          type: this.visible ? 'eye' : 'eye-invisible'
        },
        on: (_on = {}, _defineProperty(_on, iconTrigger, this.onVisibleChange), _defineProperty(_on, 'mousedown', function mousedown(e) {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/issues/15173
          e.preventDefault();
        }), _defineProperty(_on, 'mouseup', function mouseup(e) {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/pull/23633/files
          e.preventDefault();
        }), _on),
        'class': prefixCls + '-icon',
        key: 'passwordIcon'
      };
      return h(Icon, iconProps);
    }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        customizeInputPrefixCls = _getOptionProps.inputPrefixCls,
        size = _getOptionProps.size,
        suffix = _getOptionProps.suffix,
        visibilityToggle = _getOptionProps.visibilityToggle,
        restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'inputPrefixCls', 'size', 'suffix', 'visibilityToggle']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);
    var prefixCls = getPrefixCls('input-password', customizePrefixCls);

    var suffixIcon = visibilityToggle && this.getIcon(prefixCls);
    var inputClassName = classNames(prefixCls, _defineProperty({}, prefixCls + '-' + size, !!size));
    var inputProps = {
      props: _extends({}, restProps, {
        prefixCls: inputPrefixCls,
        size: size,
        suffix: suffixIcon,
        prefix: getComponentFromProp(this, 'prefix'),
        addonAfter: getComponentFromProp(this, 'addonAfter'),
        addonBefore: getComponentFromProp(this, 'addonBefore')
      }),
      attrs: _extends({}, this.$attrs, {
        type: this.visible ? 'text' : 'password'
      }),
      'class': inputClassName,
      ref: 'input',
      on: getListeners(this)
    };
    return h(Input, inputProps);
  }
};