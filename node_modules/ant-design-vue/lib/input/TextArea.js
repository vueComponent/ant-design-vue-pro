'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ClearableLabeledInput = require('./ClearableLabeledInput');

var _ClearableLabeledInput2 = _interopRequireDefault(_ClearableLabeledInput);

var _ResizableTextArea = require('./ResizableTextArea');

var _ResizableTextArea2 = _interopRequireDefault(_ResizableTextArea);

var _inputProps = require('./inputProps');

var _inputProps2 = _interopRequireDefault(_inputProps);

var _propsUtil = require('../_util/props-util');

var _propsUtil2 = _interopRequireDefault(_propsUtil);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _Input = require('./Input');

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TextAreaProps = (0, _extends3['default'])({}, _inputProps2['default'], {
  autosize: _vueTypes2['default'].oneOfType([Object, Boolean]),
  autoSize: _vueTypes2['default'].oneOfType([Object, Boolean])
});

exports['default'] = {
  name: 'ATextarea',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change.value'
  },
  props: (0, _extends3['default'])({}, TextAreaProps),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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
      if (!(0, _propsUtil2['default'])(this, 'value')) {
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
      (0, _Input.resolveOnChange)(this.$refs.resizableTextArea.$refs.textArea, e, this.onChange);
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
      (0, _Input.resolveOnChange)(this.$refs.resizableTextArea.$refs.textArea, e, this.onChange);
    },
    renderTextArea: function renderTextArea(prefixCls) {
      var h = this.$createElement;

      var props = (0, _propsUtil.getOptionProps)(this);
      var resizeProps = {
        props: (0, _extends3['default'])({}, props, {
          prefixCls: prefixCls
        }),
        on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
          input: this.handleChange,
          keydown: this.handleKeyDown
        }),
        attrs: this.$attrs
      };
      return h(_ResizableTextArea2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([resizeProps, { ref: 'resizableTextArea' }]));
    }
  },
  render: function render() {
    var h = arguments[0];
    var stateValue = this.stateValue,
        customizePrefixCls = this.prefixCls;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('input', customizePrefixCls);

    var props = {
      props: (0, _extends3['default'])({}, (0, _propsUtil.getOptionProps)(this), {
        prefixCls: prefixCls,
        inputType: 'text',
        value: (0, _Input.fixControlledValue)(stateValue),
        element: this.renderTextArea(prefixCls),
        handleReset: this.handleReset
      }),
      on: (0, _propsUtil.getListeners)(this)
    };
    return h(_ClearableLabeledInput2['default'], props);
  }
};