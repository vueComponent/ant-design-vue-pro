'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _Checkbox = require('./Checkbox');

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _propsUtil = require('../_util/props-util');

var _propsUtil2 = _interopRequireDefault(_propsUtil);

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
exports['default'] = {
  name: 'ACheckboxGroup',
  model: {
    prop: 'value'
  },
  props: {
    name: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string,
    defaultValue: _vueTypes2['default'].array,
    value: _vueTypes2['default'].array,
    options: _vueTypes2['default'].array.def([]),
    disabled: _vueTypes2['default'].bool
  },
  provide: function provide() {
    return {
      checkboxGroupContext: this
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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
        return (0, _extends3['default'])({}, option, { label: label });
      });
    },
    cancelValue: function cancelValue(value) {
      this.registeredValues = this.registeredValues.filter(function (val) {
        return val !== value;
      });
    },
    registerValue: function registerValue(value) {
      this.registeredValues = [].concat((0, _toConsumableArray3['default'])(this.registeredValues), [value]);
    },
    toggleOption: function toggleOption(option) {
      var registeredValues = this.registeredValues;

      var optionIndex = this.sValue.indexOf(option.value);
      var value = [].concat((0, _toConsumableArray3['default'])(this.sValue));
      if (optionIndex === -1) {
        value.push(option.value);
      } else {
        value.splice(optionIndex, 1);
      }
      if (!(0, _propsUtil2['default'])(this, 'value')) {
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
          _Checkbox2['default'],
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