import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import classNames from 'classnames';
import TextArea from './TextArea';
import omit from 'omit.js';
import inputProps from './inputProps';
import { hasProp, getComponentFromProp, getListeners, getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import ClearableLabeledInput from './ClearableLabeledInput';

function noop() {}

export function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}

export function resolveOnChange(target, e, onChange) {
  if (onChange) {
    var event = e;
    if (e.type === 'click') {
      // click clear icon
      //event = Object.create(e);
      Object.defineProperty(event, 'target', {
        writable: true
      });
      Object.defineProperty(event, 'currentTarget', {
        writable: true
      });
      event.target = target;
      event.currentTarget = target;
      var originalInputValue = target.value;
      // change target ref value cause e.target.value should be '' when clear input
      target.value = '';
      onChange(event);
      // reset target ref value
      target.value = originalInputValue;
      return;
    }
    onChange(event);
  }
}

export function getInputClassName(prefixCls, size, disabled) {
  var _classNames;

  return classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-sm', size === 'small'), _defineProperty(_classNames, prefixCls + '-lg', size === 'large'), _defineProperty(_classNames, prefixCls + '-disabled', disabled), _classNames));
}

export default {
  name: 'AInput',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: _extends({}, inputProps),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    var props = this.$props;
    var value = typeof props.value === 'undefined' ? props.defaultValue : props.value;
    return {
      stateValue: typeof value === 'undefined' ? '' : value
    };
  },

  watch: {
    value: function value(val) {
      this.stateValue = val;
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus) {
        _this.focus();
      }
      _this.clearPasswordValueAttribute();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.removePasswordTimeout) {
      clearTimeout(this.removePasswordTimeout);
    }
  },

  methods: {
    onBlur: function onBlur(e) {
      // fix this isssue: https://github.com/vueComponent/ant-design-vue/issues/3816
      // reference: https://github.com/vuejs/vue/issues/5847 and https://github.com/vuejs/vue/issues/8431
      this.$forceUpdate();

      var _getListeners = getListeners(this),
          blur = _getListeners.blur;

      blur && blur(e);
    },
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    select: function select() {
      this.$refs.input.select();
    },
    setValue: function setValue(value, callback) {
      if (this.stateValue === value) {
        return;
      }
      if (!hasProp(this, 'value')) {
        this.stateValue = value;
        this.$nextTick(function () {
          callback && callback();
        });
      } else {
        // 不在严格受控
        // https://github.com/vueComponent/ant-design-vue/issues/2207，modal 是 新 new 实例，更新队列和当前不在同一个更新队列中
        // this.$forceUpdate();
      }
    },
    onChange: function onChange(e) {
      this.$emit('change.value', e.target.value);
      this.$emit('change', e);
      this.$emit('input', e);
    },
    handleReset: function handleReset(e) {
      var _this2 = this;

      this.setValue('', function () {
        _this2.focus();
      });
      resolveOnChange(this.$refs.input, e, this.onChange);
    },
    renderInput: function renderInput(prefixCls) {
      var h = this.$createElement;

      var otherProps = omit(this.$props, ['prefixCls', 'addonBefore', 'addonAfter', 'prefix', 'suffix', 'allowClear', 'value', 'defaultValue', 'lazy', 'size', 'inputType', 'className']);
      var stateValue = this.stateValue,
          handleKeyDown = this.handleKeyDown,
          handleChange = this.handleChange,
          size = this.size,
          disabled = this.disabled;

      var inputProps = {
        directives: [{ name: 'ant-input' }],
        domProps: {
          value: fixControlledValue(stateValue)
        },
        attrs: _extends({}, otherProps, this.$attrs),
        on: _extends({}, getListeners(this), {
          keydown: handleKeyDown,
          input: handleChange,
          change: noop,
          blur: this.onBlur
        }),
        'class': getInputClassName(prefixCls, size, disabled),
        ref: 'input',
        key: 'ant-input'
      };
      return h('input', inputProps);
    },
    clearPasswordValueAttribute: function clearPasswordValueAttribute() {
      var _this3 = this;

      // https://github.com/ant-design/ant-design/issues/20541
      this.removePasswordTimeout = setTimeout(function () {
        if (_this3.$refs.input && _this3.$refs.input.getAttribute && _this3.$refs.input.getAttribute('type') === 'password' && _this3.$refs.input.hasAttribute('value')) {
          _this3.$refs.input.removeAttribute('value');
        }
      });
    },
    handleChange: function handleChange(e) {
      var _e$target = e.target,
          value = _e$target.value,
          composing = _e$target.composing;
      // https://github.com/vueComponent/ant-design-vue/issues/2203

      if ((e.isComposing || composing) && this.lazy || this.stateValue === value) return;
      this.setValue(value, this.clearPasswordValueAttribute);
      resolveOnChange(this.$refs.input, e, this.onChange);
    },
    handleKeyDown: function handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    }
  },
  render: function render() {
    var h = arguments[0];

    if (this.$props.type === 'textarea') {
      var textareaProps = {
        props: this.$props,
        attrs: this.$attrs,
        on: _extends({}, getListeners(this), {
          input: this.handleChange,
          keydown: this.handleKeyDown,
          change: noop,
          blur: this.onBlur
        })
      };
      return h(TextArea, _mergeJSXProps([textareaProps, { ref: 'input' }]));
    }
    var customizePrefixCls = this.$props.prefixCls;
    var stateValue = this.$data.stateValue;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('input', customizePrefixCls);
    var addonAfter = getComponentFromProp(this, 'addonAfter');
    var addonBefore = getComponentFromProp(this, 'addonBefore');
    var suffix = getComponentFromProp(this, 'suffix');
    var prefix = getComponentFromProp(this, 'prefix');
    var props = {
      props: _extends({}, getOptionProps(this), {
        prefixCls: prefixCls,
        inputType: 'input',
        value: fixControlledValue(stateValue),
        element: this.renderInput(prefixCls),
        handleReset: this.handleReset,
        addonAfter: addonAfter,
        addonBefore: addonBefore,
        suffix: suffix,
        prefix: prefix
      }),
      on: getListeners(this)
    };
    return h(ClearableLabeledInput, props);
  }
};