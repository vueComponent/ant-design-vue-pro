import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import ClearableLabeledInput from './ClearableLabeledInput';
import ResizableTextArea from './ResizableTextArea';
import inputProps from './inputProps';
import hasProp, { getListeners, getOptionProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { fixControlledValue, resolveOnChange } from './Input';
import PropTypes from '../_util/vue-types';

var TextAreaProps = _extends({}, inputProps, {
  autosize: PropTypes.oneOfType([Object, Boolean]),
  autoSize: PropTypes.oneOfType([Object, Boolean])
});

export default {
  name: 'ATextarea',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: _extends({}, TextAreaProps),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    var value = typeof this.value === 'undefined' ? this.defaultValue : this.value;
    return {
      stateValue: typeof value === 'undefined' ? '' : value
    };
  },

  computed: {},
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
    });
  },

  methods: {
    setValue: function setValue(value, callback) {
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
    handleKeyDown: function handleKeyDown(e) {
      if (e.keyCode === 13) {
        this.$emit('pressEnter', e);
      }
      this.$emit('keydown', e);
    },
    onChange: function onChange(e) {
      this.$emit('change.value', e.target.value);
      this.$emit('change', e);
      this.$emit('input', e);
    },
    handleChange: function handleChange(e) {
      var _this2 = this;

      var _e$target = e.target,
          value = _e$target.value,
          composing = _e$target.composing;

      if ((e.isComposing || composing) && this.lazy || this.stateValue === value) return;

      this.setValue(e.target.value, function () {
        _this2.$refs.resizableTextArea.resizeTextarea();
      });
      resolveOnChange(this.$refs.resizableTextArea.$refs.textArea, e, this.onChange);
    },
    focus: function focus() {
      this.$refs.resizableTextArea.$refs.textArea.focus();
    },
    blur: function blur() {
      this.$refs.resizableTextArea.$refs.textArea.blur();
    },
    handleReset: function handleReset(e) {
      var _this3 = this;

      this.setValue('', function () {
        _this3.$refs.resizableTextArea.renderTextArea();
        _this3.focus();
      });
      resolveOnChange(this.$refs.resizableTextArea.$refs.textArea, e, this.onChange);
    },
    renderTextArea: function renderTextArea(prefixCls) {
      var h = this.$createElement;

      var props = getOptionProps(this);
      var resizeProps = {
        props: _extends({}, props, {
          prefixCls: prefixCls
        }),
        on: _extends({}, getListeners(this), {
          input: this.handleChange,
          keydown: this.handleKeyDown
        }),
        attrs: this.$attrs
      };
      return h(ResizableTextArea, _mergeJSXProps([resizeProps, { ref: 'resizableTextArea' }]));
    }
  },
  render: function render() {
    var h = arguments[0];
    var stateValue = this.stateValue,
        customizePrefixCls = this.prefixCls;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('input', customizePrefixCls);

    var props = {
      props: _extends({}, getOptionProps(this), {
        prefixCls: prefixCls,
        inputType: 'text',
        value: fixControlledValue(stateValue),
        element: this.renderTextArea(prefixCls),
        handleReset: this.handleReset
      }),
      on: getListeners(this)
    };
    return h(ClearableLabeledInput, props);
  }
};