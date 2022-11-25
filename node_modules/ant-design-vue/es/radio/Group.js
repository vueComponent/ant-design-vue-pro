import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import Radio from './Radio';
import { getOptionProps, filterEmpty, hasProp, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
function noop() {}

export default {
  name: 'ARadioGroup',
  model: {
    prop: 'value'
  },
  props: {
    prefixCls: PropTypes.string,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    size: {
      'default': 'default',
      validator: function validator(value) {
        return ['large', 'default', 'small'].includes(value);
      }
    },
    options: {
      'default': function _default() {
        return [];
      },
      type: Array
    },
    disabled: Boolean,
    name: String,
    buttonStyle: PropTypes.string.def('outline')
  },
  data: function data() {
    var value = this.value,
        defaultValue = this.defaultValue;

    this.updatingValue = false;
    return {
      stateValue: value === undefined ? defaultValue : value
    };
  },
  provide: function provide() {
    return {
      radioGroupContext: this
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  computed: {
    radioOptions: function radioOptions() {
      var disabled = this.disabled;

      return this.options.map(function (option) {
        return typeof option === 'string' ? { label: option, value: option } : _extends({}, option, { disabled: option.disabled === undefined ? disabled : option.disabled });
      });
    },
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          size = this.size;

      return _ref = {}, _defineProperty(_ref, '' + prefixCls, true), _defineProperty(_ref, prefixCls + '-' + size, size), _ref;
    }
  },
  watch: {
    value: function value(val) {
      this.updatingValue = false;
      this.stateValue = val;
    }
  },
  methods: {
    onRadioChange: function onRadioChange(ev) {
      var _this = this;

      var lastValue = this.stateValue;
      var value = ev.target.value;

      if (!hasProp(this, 'value')) {
        this.stateValue = value;
      }
      // nextTick for https://github.com/vueComponent/ant-design-vue/issues/1280
      if (!this.updatingValue && value !== lastValue) {
        this.updatingValue = true;
        this.$emit('input', value);
        this.$emit('change', ev);
      }
      this.$nextTick(function () {
        _this.updatingValue = false;
      });
    }
  },
  render: function render() {
    var _this2 = this;

    var h = arguments[0];

    var _getListeners = getListeners(this),
        _getListeners$mouseen = _getListeners.mouseenter,
        mouseenter = _getListeners$mouseen === undefined ? noop : _getListeners$mouseen,
        _getListeners$mousele = _getListeners.mouseleave,
        mouseleave = _getListeners$mousele === undefined ? noop : _getListeners$mousele;

    var props = getOptionProps(this);
    var customizePrefixCls = props.prefixCls,
        options = props.options,
        buttonStyle = props.buttonStyle;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('radio', customizePrefixCls);

    var groupPrefixCls = prefixCls + '-group';
    var classString = classNames(groupPrefixCls, groupPrefixCls + '-' + buttonStyle, _defineProperty({}, groupPrefixCls + '-' + props.size, props.size));

    var children = filterEmpty(this.$slots['default']);

    // 如果存在 options, 优先使用
    if (options && options.length > 0) {
      children = options.map(function (option) {
        if (typeof option === 'string') {
          return h(
            Radio,
            {
              key: option,
              attrs: { prefixCls: prefixCls,
                disabled: props.disabled,
                value: option,
                checked: _this2.stateValue === option
              }
            },
            [option]
          );
        } else {
          return h(
            Radio,
            {
              key: 'radio-group-value-options-' + option.value,
              attrs: { prefixCls: prefixCls,
                disabled: option.disabled || props.disabled,
                value: option.value,
                checked: _this2.stateValue === option.value
              }
            },
            [option.label]
          );
        }
      });
    }

    return h(
      'div',
      { 'class': classString, on: {
          'mouseenter': mouseenter,
          'mouseleave': mouseleave
        }
      },
      [children]
    );
  }
};