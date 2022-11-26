'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _Radio = require('./Radio');

var _Radio2 = _interopRequireDefault(_Radio);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

exports['default'] = {
  name: 'ARadioGroup',
  model: {
    prop: 'value'
  },
  props: {
    prefixCls: _vueTypes2['default'].string,
    defaultValue: _vueTypes2['default'].any,
    value: _vueTypes2['default'].any,
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
    buttonStyle: _vueTypes2['default'].string.def('outline')
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
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  computed: {
    radioOptions: function radioOptions() {
      var disabled = this.disabled;

      return this.options.map(function (option) {
        return typeof option === 'string' ? { label: option, value: option } : (0, _extends3['default'])({}, option, { disabled: option.disabled === undefined ? disabled : option.disabled });
      });
    },
    classes: function classes() {
      var _ref;

      var prefixCls = this.prefixCls,
          size = this.size;

      return _ref = {}, (0, _defineProperty3['default'])(_ref, '' + prefixCls, true), (0, _defineProperty3['default'])(_ref, prefixCls + '-' + size, size), _ref;
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

      if (!(0, _propsUtil.hasProp)(this, 'value')) {
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

    var _getListeners = (0, _propsUtil.getListeners)(this),
        _getListeners$mouseen = _getListeners.mouseenter,
        mouseenter = _getListeners$mouseen === undefined ? noop : _getListeners$mouseen,
        _getListeners$mousele = _getListeners.mouseleave,
        mouseleave = _getListeners$mousele === undefined ? noop : _getListeners$mousele;

    var props = (0, _propsUtil.getOptionProps)(this);
    var customizePrefixCls = props.prefixCls,
        options = props.options,
        buttonStyle = props.buttonStyle;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('radio', customizePrefixCls);

    var groupPrefixCls = prefixCls + '-group';
    var classString = (0, _classnames2['default'])(groupPrefixCls, groupPrefixCls + '-' + buttonStyle, (0, _defineProperty3['default'])({}, groupPrefixCls + '-' + props.size, props.size));

    var children = (0, _propsUtil.filterEmpty)(this.$slots['default']);

    // 如果存在 options, 优先使用
    if (options && options.length > 0) {
      children = options.map(function (option) {
        if (typeof option === 'string') {
          return h(
            _Radio2['default'],
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
            _Radio2['default'],
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