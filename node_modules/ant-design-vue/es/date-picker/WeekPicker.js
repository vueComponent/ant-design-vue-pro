import _extends from 'babel-runtime/helpers/extends';
import * as moment from 'moment';
import Calendar from '../vc-calendar';
import VcDatePicker from '../vc-calendar/src/Picker';
import Icon from '../icon';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { hasProp, getOptionProps, initDefaultProps, getComponentFromProp, getListeners } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { WeekPickerProps } from './interface';
import interopDefault from '../_util/interopDefault';
import InputIcon from './InputIcon';

function formatValue(value, format) {
  return value && value.format(format) || '';
}
function noop() {}

export default {
  // static defaultProps = {
  //   format: 'YYYY-wo',
  //   allowClear: true,
  // };

  // private input: any;
  name: 'AWeekPicker',
  mixins: [BaseMixin],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: initDefaultProps(WeekPickerProps(), {
    format: 'gggg-wo',
    allowClear: true
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    var value = this.value || this.defaultValue;
    if (value && !interopDefault(moment).isMoment(value)) {
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
      this.prevState = _extends({}, this.$data, state);
    },
    open: function open(val) {
      var state = { _open: val };
      this.setState(state);
      this.prevState = _extends({}, this.$data, state);
    },
    _open: function _open(val, oldVal) {
      var _this = this;

      this.$nextTick(function () {
        if (!hasProp(_this, 'open') && oldVal && !val) {
          _this.focus();
        }
      });
    }
  },
  mounted: function mounted() {
    this.prevState = _extends({}, this.$data);
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      if (!hasProp(_this2, 'open') && _this2.prevState._open && !_this2._open) {
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
      if (!hasProp(this, 'value')) {
        this.setState({ _value: value });
      }
      this.$emit('change', value, formatValue(value, this.format));
    },
    handleOpenChange: function handleOpenChange(open) {
      if (!hasProp(this, 'open')) {
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

    var props = getOptionProps(this);
    var suffixIcon = getComponentFromProp(this, 'suffixIcon');
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

    var listeners = getListeners(this);
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

    var placeholder = hasProp(this, 'placeholder') ? this.placeholder : locale.lang.placeholder;
    var weekDateRender = this.dateRender || $scopedSlots.dateRender || this.weekDateRender;
    var calendar = h(Calendar, {
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
    var clearIcon = !disabled && allowClear && $data._value ? h(Icon, {
      attrs: {
        type: 'close-circle',

        theme: 'filled'
      },
      'class': prefixCls + '-picker-clear',
      on: {
        'click': this.clearSelection
      }
    }) : null;

    var inputIcon = h(InputIcon, {
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
      props: _extends({}, props, {
        calendar: calendar,
        prefixCls: prefixCls + '-picker-container',
        value: pickerValue,
        open: open
      }),
      on: _extends({}, listeners, {
        change: this.handleChange,
        openChange: this.handleOpenChange
      }),
      style: popupStyle,
      scopedSlots: _extends({ 'default': input }, $scopedSlots)
    };
    return h(
      'span',
      { 'class': pickerClass },
      [h(VcDatePicker, vcDatePickerProps)]
    );
  }
};