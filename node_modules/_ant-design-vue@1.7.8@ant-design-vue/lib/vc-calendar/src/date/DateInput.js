'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _vueTypes = require('../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../../../_util/props-util');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _util = require('../util');

var _KeyCode = require('../../../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var cachedSelectionStart = void 0;
var cachedSelectionEnd = void 0;
var dateInputInstance = void 0;

var DateInput = {
  mixins: [_BaseMixin2['default']],
  props: {
    prefixCls: _vueTypes2['default'].string,
    timePicker: _vueTypes2['default'].object,
    value: _vueTypes2['default'].object,
    disabledTime: _vueTypes2['default'].any,
    format: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].arrayOf(_vueTypes2['default'].string), _vueTypes2['default'].func]),
    locale: _vueTypes2['default'].object,
    disabledDate: _vueTypes2['default'].func,
    // onChange: PropTypes.func,
    // onClear: PropTypes.func,
    placeholder: _vueTypes2['default'].string,
    // onSelect: PropTypes.func,
    selectedValue: _vueTypes2['default'].object,
    clearIcon: _vueTypes2['default'].any,
    inputMode: _vueTypes2['default'].string,
    inputReadOnly: _vueTypes2['default'].bool
  },

  data: function data() {
    var selectedValue = this.selectedValue;
    return {
      str: (0, _util.formatDate)(selectedValue, this.format),
      invalid: false,
      hasFocus: false
    };
  },

  watch: {
    selectedValue: function selectedValue() {
      this.setState();
    },
    format: function format() {
      this.setState();
    }
  },

  updated: function updated() {
    var _this = this;

    this.$nextTick(function () {
      if (dateInputInstance && _this.$data.hasFocus && !_this.invalid && !(cachedSelectionStart === 0 && cachedSelectionEnd === 0)) {
        dateInputInstance.setSelectionRange(cachedSelectionStart, cachedSelectionEnd);
      }
    });
  },
  getInstance: function getInstance() {
    return dateInputInstance;
  },

  methods: {
    getDerivedStateFromProps: function getDerivedStateFromProps(nextProps, state) {
      var newState = {};
      if (dateInputInstance) {
        cachedSelectionStart = dateInputInstance.selectionStart;
        cachedSelectionEnd = dateInputInstance.selectionEnd;
      }
      // when popup show, click body will call this, bug!
      var selectedValue = nextProps.selectedValue;
      if (!state.hasFocus) {
        newState = {
          str: (0, _util.formatDate)(selectedValue, this.format),
          invalid: false
        };
      }
      return newState;
    },
    onClear: function onClear() {
      this.setState({
        str: ''
      });
      this.__emit('clear', null);
    },
    onInputChange: function onInputChange(e) {
      var _e$target = e.target,
          str = _e$target.value,
          composing = _e$target.composing;
      var _str = this.str,
          oldStr = _str === undefined ? '' : _str;

      if (e.isComposing || composing || oldStr === str) return;

      var _$props = this.$props,
          disabledDate = _$props.disabledDate,
          format = _$props.format,
          selectedValue = _$props.selectedValue;

      // 没有内容，合法并直接退出

      if (!str) {
        this.__emit('change', null);
        this.setState({
          invalid: false,
          str: str
        });
        return;
      }

      // 不合法直接退出
      var parsed = (0, _moment2['default'])(str, format, true);
      if (!parsed.isValid()) {
        this.setState({
          invalid: true,
          str: str
        });
        return;
      }
      var value = this.value.clone();
      value.year(parsed.year()).month(parsed.month()).date(parsed.date()).hour(parsed.hour()).minute(parsed.minute()).second(parsed.second());

      if (!value || disabledDate && disabledDate(value)) {
        this.setState({
          invalid: true,
          str: str
        });
        return;
      }

      if (selectedValue !== value || selectedValue && value && !selectedValue.isSame(value)) {
        this.setState({
          invalid: false,
          str: str
        });
        this.__emit('change', value);
      }
    },
    onFocus: function onFocus() {
      this.setState({ hasFocus: true });
    },
    onBlur: function onBlur() {
      this.setState(function (prevState, prevProps) {
        return {
          hasFocus: false,
          str: (0, _util.formatDate)(prevProps.value, prevProps.format)
        };
      });
    },
    onKeyDown: function onKeyDown(event) {
      var keyCode = event.keyCode;
      var _$props2 = this.$props,
          value = _$props2.value,
          disabledDate = _$props2.disabledDate;

      if (keyCode === _KeyCode2['default'].ENTER) {
        var validateDate = !disabledDate || !disabledDate(value);
        if (validateDate) {
          this.__emit('select', value.clone());
        }
        event.preventDefault();
      }
    },
    getRootDOMNode: function getRootDOMNode() {
      return this.$el;
    },
    focus: function focus() {
      if (dateInputInstance) {
        dateInputInstance.focus();
      }
    },
    saveDateInput: function saveDateInput(dateInput) {
      dateInputInstance = dateInput;
    }
  },

  render: function render() {
    var h = arguments[0];
    var invalid = this.invalid,
        str = this.str,
        locale = this.locale,
        prefixCls = this.prefixCls,
        placeholder = this.placeholder,
        disabled = this.disabled,
        showClear = this.showClear,
        inputMode = this.inputMode,
        inputReadOnly = this.inputReadOnly;

    var clearIcon = (0, _propsUtil.getComponentFromProp)(this, 'clearIcon');
    var invalidClass = invalid ? prefixCls + '-input-invalid' : '';
    return h(
      'div',
      { 'class': prefixCls + '-input-wrap' },
      [h(
        'div',
        { 'class': prefixCls + '-date-input-wrap' },
        [h('input', (0, _babelHelperVueJsxMergeProps2['default'])([{
          directives: [{
            name: 'ant-ref',
            value: this.saveDateInput
          }, {
            name: 'ant-input'
          }]
        }, {
          'class': prefixCls + '-input ' + invalidClass,
          domProps: {
            'value': str
          },
          attrs: {
            disabled: disabled,
            placeholder: placeholder,

            inputMode: inputMode,
            readOnly: inputReadOnly
          },
          on: {
            'input': this.onInputChange,
            'keydown': this.onKeyDown,
            'focus': this.onFocus,
            'blur': this.onBlur
          }
        }]))]
      ), showClear ? h(
        'a',
        {
          attrs: { role: 'button', title: locale.clear },
          on: {
            'click': this.onClear
          }
        },
        [clearIcon || h('span', { 'class': prefixCls + '-clear-btn' })]
      ) : null]
    );
  }
};

exports['default'] = DateInput;