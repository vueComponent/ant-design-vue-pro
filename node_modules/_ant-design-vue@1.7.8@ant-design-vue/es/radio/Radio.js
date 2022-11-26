import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import PropTypes from '../_util/vue-types';
import VcCheckbox from '../vc-checkbox';
import classNames from 'classnames';
import { getOptionProps, getAttrs, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

function noop() {}

export default {
  name: 'ARadio',
  model: {
    prop: 'checked'
  },
  props: {
    prefixCls: PropTypes.string,
    defaultChecked: Boolean,
    checked: { type: Boolean, 'default': undefined },
    disabled: Boolean,
    isGroup: Boolean,
    value: PropTypes.any,
    name: String,
    id: String,
    autoFocus: Boolean,
    type: PropTypes.string.def('radio')
  },
  inject: {
    radioGroupContext: { 'default': undefined },
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    focus: function focus() {
      this.$refs.vcCheckbox.focus();
    },
    blur: function blur() {
      this.$refs.vcCheckbox.blur();
    },
    handleChange: function handleChange(event) {
      var targetChecked = event.target.checked;
      this.$emit('input', targetChecked);
      this.$emit('change', event);
    },
    onChange: function onChange(e) {
      this.$emit('change', e);
      if (this.radioGroupContext && this.radioGroupContext.onRadioChange) {
        this.radioGroupContext.onRadioChange(e);
      }
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];
    var $slots = this.$slots,
        radioGroup = this.radioGroupContext;

    var props = getOptionProps(this);
    var children = $slots['default'];

    var _getListeners = getListeners(this),
        _getListeners$mouseen = _getListeners.mouseenter,
        mouseenter = _getListeners$mouseen === undefined ? noop : _getListeners$mouseen,
        _getListeners$mousele = _getListeners.mouseleave,
        mouseleave = _getListeners$mousele === undefined ? noop : _getListeners$mousele,
        restListeners = _objectWithoutProperties(_getListeners, ['mouseenter', 'mouseleave']);

    var customizePrefixCls = props.prefixCls,
        restProps = _objectWithoutProperties(props, ['prefixCls']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('radio', customizePrefixCls);

    var radioProps = {
      props: _extends({}, restProps, { prefixCls: prefixCls }),
      on: restListeners,
      attrs: getAttrs(this)
    };

    if (radioGroup) {
      radioProps.props.name = radioGroup.name;
      radioProps.on.change = this.onChange;
      radioProps.props.checked = props.value === radioGroup.stateValue;
      radioProps.props.disabled = props.disabled || radioGroup.disabled;
    } else {
      radioProps.on.change = this.handleChange;
    }
    var wrapperClassString = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-wrapper', true), _defineProperty(_classNames, prefixCls + '-wrapper-checked', radioProps.props.checked), _defineProperty(_classNames, prefixCls + '-wrapper-disabled', radioProps.props.disabled), _classNames));

    return h(
      'label',
      { 'class': wrapperClassString, on: {
          'mouseenter': mouseenter,
          'mouseleave': mouseleave
        }
      },
      [h(VcCheckbox, _mergeJSXProps([radioProps, { ref: 'vcCheckbox' }])), children !== undefined ? h('span', [children]) : null]
    );
  }
};