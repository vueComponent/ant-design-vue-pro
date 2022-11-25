'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Header = {
  mixins: [_BaseMixin2['default']],
  props: {
    format: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string,
    disabledDate: _vueTypes2['default'].func,
    placeholder: _vueTypes2['default'].string,
    clearText: _vueTypes2['default'].string,
    value: _vueTypes2['default'].object,
    inputReadOnly: _vueTypes2['default'].bool.def(false),
    hourOptions: _vueTypes2['default'].array,
    minuteOptions: _vueTypes2['default'].array,
    secondOptions: _vueTypes2['default'].array,
    disabledHours: _vueTypes2['default'].func,
    disabledMinutes: _vueTypes2['default'].func,
    disabledSeconds: _vueTypes2['default'].func,
    // onChange: PropTypes.func,
    // onClear: PropTypes.func,
    // onEsc: PropTypes.func,
    allowEmpty: _vueTypes2['default'].bool,
    defaultOpenValue: _vueTypes2['default'].object,
    currentSelectPanel: _vueTypes2['default'].string,
    focusOnOpen: _vueTypes2['default'].bool,
    // onKeyDown: PropTypes.func,
    clearIcon: _vueTypes2['default'].any
  },
  data: function data() {
    var value = this.value,
        format = this.format;

    return {
      str: value && value.format(format) || '',
      invalid: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    if (this.focusOnOpen) {
      // Wait one frame for the panel to be positioned before focusing
      var requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
      requestAnimationFrame(function () {
        _this.$refs.input.focus();
        _this.$refs.input.select();
      });
    }
  },

  watch: {
    value: function value(val) {
      var _this2 = this;

      this.$nextTick(function () {
        _this2.setState({
          str: val && val.format(_this2.format) || '',
          invalid: false
        });
      });
    }
  },

  methods: {
    onInputChange: function onInputChange(e) {
      var _e$target = e.target,
          str = _e$target.value,
          composing = _e$target.composing;
      var _str = this.str,
          oldStr = _str === undefined ? '' : _str;

      if (e.isComposing || composing || oldStr === str) return;

      this.setState({
        str: str
      });
      var format = this.format,
          hourOptions = this.hourOptions,
          minuteOptions = this.minuteOptions,
          secondOptions = this.secondOptions,
          disabledHours = this.disabledHours,
          disabledMinutes = this.disabledMinutes,
          disabledSeconds = this.disabledSeconds,
          originalValue = this.value;


      if (str) {
        var value = this.getProtoValue().clone();
        var parsed = (0, _moment2['default'])(str, format, true);
        if (!parsed.isValid()) {
          this.setState({
            invalid: true
          });
          return;
        }
        value.hour(parsed.hour()).minute(parsed.minute()).second(parsed.second());

        // if time value not allowed, response warning.
        if (hourOptions.indexOf(value.hour()) < 0 || minuteOptions.indexOf(value.minute()) < 0 || secondOptions.indexOf(value.second()) < 0) {
          this.setState({
            invalid: true
          });
          return;
        }

        // if time value is disabled, response warning.
        var disabledHourOptions = disabledHours();
        var disabledMinuteOptions = disabledMinutes(value.hour());
        var disabledSecondOptions = disabledSeconds(value.hour(), value.minute());
        if (disabledHourOptions && disabledHourOptions.indexOf(value.hour()) >= 0 || disabledMinuteOptions && disabledMinuteOptions.indexOf(value.minute()) >= 0 || disabledSecondOptions && disabledSecondOptions.indexOf(value.second()) >= 0) {
          this.setState({
            invalid: true
          });
          return;
        }

        if (originalValue) {
          if (originalValue.hour() !== value.hour() || originalValue.minute() !== value.minute() || originalValue.second() !== value.second()) {
            // keep other fields for rc-calendar
            var changedValue = originalValue.clone();
            changedValue.hour(value.hour());
            changedValue.minute(value.minute());
            changedValue.second(value.second());
            this.__emit('change', changedValue);
          }
        } else if (originalValue !== value) {
          this.__emit('change', value);
        }
      } else {
        this.__emit('change', null);
      }

      this.setState({
        invalid: false
      });
    },
    onKeyDown: function onKeyDown(e) {
      if (e.keyCode === 27) {
        this.__emit('esc');
      }
      this.__emit('keydown', e);
    },
    getProtoValue: function getProtoValue() {
      return this.value || this.defaultOpenValue;
    },
    getInput: function getInput() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          placeholder = this.placeholder,
          inputReadOnly = this.inputReadOnly,
          invalid = this.invalid,
          str = this.str;

      var invalidClass = invalid ? prefixCls + '-input-invalid' : '';
      return h('input', (0, _babelHelperVueJsxMergeProps2['default'])([{
        'class': prefixCls + '-input ' + invalidClass,
        ref: 'input',
        on: {
          'keydown': this.onKeyDown,
          'input': this.onInputChange
        },
        domProps: {
          'value': str
        },
        attrs: {
          placeholder: placeholder,

          readOnly: !!inputReadOnly
        }
      }, {
        directives: [{
          name: 'ant-input'
        }]
      }]));
    }
  },

  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls;

    return h(
      'div',
      { 'class': prefixCls + '-input-wrap' },
      [this.getInput()]
    );
  }
};

exports['default'] = Header;