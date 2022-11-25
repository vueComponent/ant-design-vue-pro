import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import Checkbox from './Checkbox';
import hasProp from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

function noop() {}
export default {
  name: 'ACheckboxGroup',
  model: {
    prop: 'value'
  },
  props: {
    name: PropTypes.string,
    prefixCls: PropTypes.string,
    defaultValue: PropTypes.array,
    value: PropTypes.array,
    options: PropTypes.array.def([]),
    disabled: PropTypes.bool
  },
  provide: function provide() {
    return {
      checkboxGroupContext: this
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    var value = this.value,
        defaultValue = this.defaultValue;

    return {
      sValue: value || defaultValue || [],
      registeredValues: []
    };
  },

  watch: {
    value: function value(val) {
      this.sValue = val || [];
    }
  },
  methods: {
    getOptions: function getOptions() {
      var options = this.options,
          $scopedSlots = this.$scopedSlots;

      return options.map(function (option) {
        if (typeof option === 'string') {
          return {
            label: option,
            value: option
          };
        }
        var label = option.label;
        if (label === undefined && $scopedSlots.label) {
          label = $scopedSlots.label(option);
        }
        return _extends({}, option, { label: label });
      });
    },
    cancelValue: function cancelValue(value) {
      this.registeredValues = this.registeredValues.filter(function (val) {
        return val !== value;
      });
    },
    registerValue: function registerValue(value) {
      this.registeredValues = [].concat(_toConsumableArray(this.registeredValues), [value]);
    },
    toggleOption: function toggleOption(option) {
      var registeredValues = this.registeredValues;

      var optionIndex = this.sValue.indexOf(option.value);
      var value = [].concat(_toConsumableArray(this.sValue));
      if (optionIndex === -1) {
        value.push(option.value);
      } else {
        value.splice(optionIndex, 1);
      }
      if (!hasProp(this, 'value')) {
        this.sValue = value;
      }
      var options = this.getOptions();
      var val = value.filter(function (val) {
        return registeredValues.indexOf(val) !== -1;
      }).sort(function (a, b) {
        var indexA = options.findIndex(function (opt) {
          return opt.value === a;
        });
        var indexB = options.findIndex(function (opt) {
          return opt.value === b;
        });
        return indexA - indexB;
      });
      this.$emit('input', val);
      this.$emit('change', val);
    }
  },
  render: function render() {
    var h = arguments[0];
    var props = this.$props,
        state = this.$data,
        $slots = this.$slots;
    var customizePrefixCls = props.prefixCls,
        options = props.options;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('checkbox', customizePrefixCls);

    var children = $slots['default'];
    var groupPrefixCls = prefixCls + '-group';
    if (options && options.length > 0) {
      children = this.getOptions().map(function (option) {
        return h(
          Checkbox,
          {
            attrs: {
              prefixCls: prefixCls,

              disabled: 'disabled' in option ? option.disabled : props.disabled,
              indeterminate: option.indeterminate,
              value: option.value,
              checked: state.sValue.indexOf(option.value) !== -1
            },
            key: option.value.toString(), on: {
              'change': option.onChange || noop
            },

            'class': groupPrefixCls + '-item'
          },
          [option.label]
        );
      });
    }
    return h(
      'div',
      { 'class': groupPrefixCls },
      [children]
    );
  }
};