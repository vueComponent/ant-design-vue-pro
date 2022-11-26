'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _vcCalendar = require('../vc-calendar');

var _vcCalendar2 = _interopRequireDefault(_vcCalendar);

var _Picker = require('../vc-calendar/src/Picker');

var _Picker2 = _interopRequireDefault(_Picker);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _interface = require('./interface');

var _interopDefault = require('../_util/interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

var _InputIcon = require('./InputIcon');

var _InputIcon2 = _interopRequireDefault(_InputIcon);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function formatValue(value, format) {
  return value && value.format(format) || '';
}
function noop() {}

exports['default'] = {
  // static defaultProps = {
  //   format: 'YYYY-wo',
  //   allowClear: true,
  // };

  // private input: any;
  name: 'AWeekPicker',
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: (0, _propsUtil.initDefaultProps)((0, _interface.WeekPickerProps)(), {
    format: 'gggg-wo',
    allowClear: true
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    var value = this.value || this.defaultValue;
    if (value && !(0, _interopDefault2['default'])(moment).isMoment(value)) {
      throw new Error('The value/defaultValue of WeekPicker or MonthPicker must be ' + 'a moment object');
    }
    return {
      _value: value,
      _open: this.open
    };
  },

  watch: {
    value: function value(val) {
      var state = { _value: val };
      this.setState(state);
      this.prevState = (0, _extends3['default'])({}, this.$data, state);
    },
    open: function open(val) {
      var state = { _open: val };
      this.setState(state);
      this.prevState = (0, _extends3['default'])({}, this.$data, state);
    },
    _open: function _open(val, oldVal) {
      var _this = this;

      this.$nextTick(function () {
        if (!(0, _propsUtil.hasProp)(_this, 'open') && oldVal && !val) {
          _this.focus();
        }
      });
    }
  },
  mounted: function mounted() {
    this.prevState = (0, _extends3['default'])({}, this.$data);
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      if (!(0, _propsUtil.hasProp)(_this2, 'open') && _this2.prevState._open && !_this2._open) {
        _this2.focus();
      }
    });
  },

  methods: {
    weekDateRender: function weekDateRender(current) {
      var h = this.$createElement;

      var selectedValue = this.$data._value;
      var prefixCls = this._prefixCls,
          $scopedSlots = this.$scopedSlots;

      var dateRender = this.dateRender || $scopedSlots.dateRender;
      var dateNode = dateRender ? dateRender(current) : current.date();
      if (selectedValue && current.year() === selectedValue.year() && current.week() === selectedValue.week()) {
        return h(
          'div',
          { 'class': prefixCls + '-selected-day' },
          [h(
            'div',
            { 'class': prefixCls + '-date' },
            [dateNode]
          )]
        );
      }
      return h(
        'div',
        { 'class': prefixCls + '-date' },
        [dateNode]
      );
    },
    handleChange: function handleChange(value) {
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState({ _value: value });
      }
      this.$emit('change', value, formatValue(value, this.format));
    },
    handleOpenChange: function handleOpenChange(open) {
      if (!(0, _propsUtil.hasProp)(this, 'open')) {
        this.setState({ _open: open });
      }
      this.$emit('openChange', open);
    },
    clearSelection: function clearSelection(e) {
      e.preventDefault();
      e.stopPropagation();
      this.handleChange(null);
    },
    focus: function focus() {
      this.$refs.input.focus();
    },
    blur: function blur() {
      this.$refs.input.blur();
    },
    renderFooter: function renderFooter() {
      var h = this.$createElement;
      var prefixCls = this._prefixCls,
          $scopedSlots = this.$scopedSlots;

      var renderExtraFooter = this.renderExtraFooter || $scopedSlots.renderExtraFooter;
      return renderExtraFooter ? h(
        'div',
        { 'class': prefixCls + '-footer-extra' },
        [renderExtraFooter.apply(undefined, arguments)]
      ) : null;
    }
  },

  render: function render() {
    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var suffixIcon = (0, _propsUtil.getComponentFromProp)(this, 'suffixIcon');
    suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
    var customizePrefixCls = this.prefixCls,
        disabled = this.disabled,
        pickerClass = this.pickerClass,
        popupStyle = this.popupStyle,
        pickerInputClass = this.pickerInputClass,
        format = this.format,
        allowClear = this.allowClear,
        locale = this.locale,
        localeCode = this.localeCode,
        disabledDate = this.disabledDate,
        defaultPickerValue = this.defaultPickerValue,
        $data = this.$data,
        $scopedSlots = this.$scopedSlots;

    var listeners = (0, _propsUtil.getListeners)(this);
    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('calendar', customizePrefixCls);
    this._prefixCls = prefixCls;

    var pickerValue = $data._value,
        open = $data._open;
    var _listeners$focus = listeners.focus,
        focus = _listeners$focus === undefined ? noop : _listeners$focus,
        _listeners$blur = listeners.blur,
        blur = _listeners$blur === undefined ? noop : _listeners$blur;


    if (pickerValue && localeCode) {
      pickerValue.locale(localeCode);
    }

    var placeholder = (0, _propsUtil.hasProp)(this, 'placeholder') ? this.placeholder : locale.lang.placeholder;
    var weekDateRender = this.dateRender || $scopedSlots.dateRender || this.weekDateRender;
    var calendar = h(_vcCalendar2['default'], {
      attrs: {
        showWeekNumber: true,
        dateRender: weekDateRender,
        prefixCls: prefixCls,
        format: format,
        locale: locale.lang,
        showDateInput: false,
        showToday: false,
        disabledDate: disabledDate,
        renderFooter: this.renderFooter,
        defaultValue: defaultPickerValue
      }
    });
    var clearIcon = !disabled && allowClear && $data._value ? h(_icon2['default'], {
      attrs: {
        type: 'close-circle',

        theme: 'filled'
      },
      'class': prefixCls + '-picker-clear',
      on: {
        'click': this.clearSelection
      }
    }) : null;

    var inputIcon = h(_InputIcon2['default'], {
      attrs: { suffixIcon: suffixIcon, prefixCls: prefixCls }
    });

    var input = function input(_ref) {
      var value = _ref.value;

      return h(
        'span',
        { style: { display: 'inline-block', width: '100%' } },
        [h('input', {
          ref: 'input',
          attrs: { disabled: disabled,
            readOnly: true,

            placeholder: placeholder
          },
          domProps: {
            'value': value && value.format(format) || ''
          },
          'class': pickerInputClass,
          on: {
            'focus': focus,
            'blur': blur
          }
        }), clearIcon, inputIcon]
      );
    };
    var vcDatePickerProps = {
      props: (0, _extends3['default'])({}, props, {
        calendar: calendar,
        prefixCls: prefixCls + '-picker-container',
        value: pickerValue,
        open: open
      }),
      on: (0, _extends3['default'])({}, listeners, {
        change: this.handleChange,
        openChange: this.handleOpenChange
      }),
      style: popupStyle,
      scopedSlots: (0, _extends3['default'])({ 'default': input }, $scopedSlots)
    };
    return h(
      'span',
      { 'class': pickerClass },
      [h(_Picker2['default'], vcDatePickerProps)]
    );
  }
};