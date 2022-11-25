'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimePickerProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.generateShowHourMinuteSecond = generateShowHourMinuteSecond;

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _vcTimePicker = require('../vc-time-picker');

var _vcTimePicker2 = _interopRequireDefault(_vcTimePicker);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _en_US = require('./locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _momentUtil = require('../_util/moment-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function generateShowHourMinuteSecond(format) {
  // Ref: http://momentjs.com/docs/#/parsing/string-format/
  return {
    showHour: format.indexOf('H') > -1 || format.indexOf('h') > -1 || format.indexOf('k') > -1,
    showMinute: format.indexOf('m') > -1,
    showSecond: format.indexOf('s') > -1
  };
}

var TimePickerProps = exports.TimePickerProps = function TimePickerProps() {
  return {
    size: _vueTypes2['default'].oneOf(['large', 'default', 'small']),
    value: _momentUtil.TimeOrTimesType,
    defaultValue: _momentUtil.TimeOrTimesType,
    open: _vueTypes2['default'].bool,
    format: _vueTypes2['default'].string,
    disabled: _vueTypes2['default'].bool,
    placeholder: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string,
    hideDisabledOptions: _vueTypes2['default'].bool,
    disabledHours: _vueTypes2['default'].func,
    disabledMinutes: _vueTypes2['default'].func,
    disabledSeconds: _vueTypes2['default'].func,
    getPopupContainer: _vueTypes2['default'].func,
    use12Hours: _vueTypes2['default'].bool,
    focusOnOpen: _vueTypes2['default'].bool,
    hourStep: _vueTypes2['default'].number,
    minuteStep: _vueTypes2['default'].number,
    secondStep: _vueTypes2['default'].number,
    allowEmpty: _vueTypes2['default'].bool,
    allowClear: _vueTypes2['default'].bool,
    inputReadOnly: _vueTypes2['default'].bool,
    clearText: _vueTypes2['default'].string,
    defaultOpenValue: _vueTypes2['default'].object,
    popupClassName: _vueTypes2['default'].string,
    popupStyle: _vueTypes2['default'].object,
    suffixIcon: _vueTypes2['default'].any,
    align: _vueTypes2['default'].object,
    placement: _vueTypes2['default'].any,
    transitionName: _vueTypes2['default'].string,
    autoFocus: _vueTypes2['default'].bool,
    addon: _vueTypes2['default'].any,
    clearIcon: _vueTypes2['default'].any,
    locale: _vueTypes2['default'].object,
    valueFormat: _vueTypes2['default'].string
  };
};

var TimePicker = {
  name: 'ATimePicker',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(TimePickerProps(), {
    align: {
      offset: [0, -2]
    },
    disabled: false,
    disabledHours: undefined,
    disabledMinutes: undefined,
    disabledSeconds: undefined,
    hideDisabledOptions: false,
    placement: 'bottomLeft',
    transitionName: 'slide-up',
    focusOnOpen: true,
    allowClear: true
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  provide: function provide() {
    return {
      savePopupRef: this.savePopupRef
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    var value = this.value,
        defaultValue = this.defaultValue,
        valueFormat = this.valueFormat;


    (0, _momentUtil.checkValidate)('TimePicker', defaultValue, 'defaultValue', valueFormat);
    (0, _momentUtil.checkValidate)('TimePicker', value, 'value', valueFormat);
    (0, _warning2['default'])(!(0, _propsUtil.hasProp)(this, 'allowEmpty'), 'TimePicker', '`allowEmpty` is deprecated. Please use `allowClear` instead.');
    return {
      sValue: (0, _momentUtil.stringToMoment)(value || defaultValue, valueFormat)
    };
  },

  watch: {
    value: function value(val) {
      (0, _momentUtil.checkValidate)('TimePicker', val, 'value', this.valueFormat);
      this.setState({ sValue: (0, _momentUtil.stringToMoment)(val, this.valueFormat) });
    }
  },
  methods: {
    getDefaultFormat: function getDefaultFormat() {
      var format = this.format,
          use12Hours = this.use12Hours;

      if (format) {
        return format;
      } else if (use12Hours) {
        return 'h:mm:ss a';
      }
      return 'HH:mm:ss';
    },
    getAllowClear: function getAllowClear() {
      var _$props = this.$props,
          allowClear = _$props.allowClear,
          allowEmpty = _$props.allowEmpty;

      if ((0, _propsUtil.hasProp)(this, 'allowClear')) {
        return allowClear;
      }
      return allowEmpty;
    },
    getDefaultLocale: function getDefaultLocale() {
      var defaultLocale = (0, _extends3['default'])({}, _en_US2['default'], this.$props.locale);
      return defaultLocale;
    },
    savePopupRef: function savePopupRef(ref) {
      this.popupRef = ref;
    },
    handleChange: function handleChange(value) {
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState({ sValue: value });
      }
      var _format = this.format,
          format = _format === undefined ? 'HH:mm:ss' : _format;

      this.$emit('change', this.valueFormat ? (0, _momentUtil.momentToString)(value, this.valueFormat) : value, value && value.format(format) || '');
    },
    handleOpenClose: function handleOpenClose(_ref) {
      var open = _ref.open;

      this.$emit('openChange', open);
      this.$emit('update:open', open);
    },
    focus: function focus() {
      this.$refs.timePicker.focus();
    },
    blur: function blur() {
      this.$refs.timePicker.blur();
    },
    renderInputIcon: function renderInputIcon(prefixCls) {
      var h = this.$createElement;

      var suffixIcon = (0, _propsUtil.getComponentFromProp)(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      var clockIcon = suffixIcon && (0, _propsUtil.isValidElement)(suffixIcon) && (0, _vnode.cloneElement)(suffixIcon, {
        'class': prefixCls + '-clock-icon'
      }) || h(_icon2['default'], {
        attrs: { type: 'clock-circle' },
        'class': prefixCls + '-clock-icon' });

      return h(
        'span',
        { 'class': prefixCls + '-icon' },
        [clockIcon]
      );
    },
    renderClearIcon: function renderClearIcon(prefixCls) {
      var h = this.$createElement;

      var clearIcon = (0, _propsUtil.getComponentFromProp)(this, 'clearIcon');
      var clearIconPrefixCls = prefixCls + '-clear';

      if (clearIcon && (0, _propsUtil.isValidElement)(clearIcon)) {
        return (0, _vnode.cloneElement)(clearIcon, {
          'class': clearIconPrefixCls
        });
      }

      return h(_icon2['default'], {
        attrs: { type: 'close-circle', theme: 'filled' },
        'class': clearIconPrefixCls });
    },
    renderTimePicker: function renderTimePicker(locale) {
      var h = this.$createElement;

      var props = (0, _propsUtil.getOptionProps)(this);
      props = (0, _omit2['default'])(props, ['defaultValue', 'suffixIcon', 'allowEmpty', 'allowClear']);

      var _props = props,
          customizePrefixCls = _props.prefixCls,
          getPopupContainer = _props.getPopupContainer,
          placeholder = _props.placeholder,
          size = _props.size;

      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('time-picker', customizePrefixCls);

      var format = this.getDefaultFormat();
      var pickerClassName = (0, _defineProperty3['default'])({}, prefixCls + '-' + size, !!size);
      var tempAddon = (0, _propsUtil.getComponentFromProp)(this, 'addon', {}, false);
      var pickerAddon = function pickerAddon(panel) {
        return tempAddon ? h(
          'div',
          { 'class': prefixCls + '-panel-addon' },
          [typeof tempAddon === 'function' ? tempAddon(panel) : tempAddon]
        ) : null;
      };
      var inputIcon = this.renderInputIcon(prefixCls);
      var clearIcon = this.renderClearIcon(prefixCls);
      var getContextPopupContainer = this.configProvider.getPopupContainer;

      var timeProps = {
        props: (0, _extends3['default'])({}, generateShowHourMinuteSecond(format), props, {
          allowEmpty: this.getAllowClear(),
          prefixCls: prefixCls,
          getPopupContainer: getPopupContainer || getContextPopupContainer,
          format: format,
          value: this.sValue,
          placeholder: placeholder === undefined ? locale.placeholder : placeholder,
          addon: pickerAddon,
          inputIcon: inputIcon,
          clearIcon: clearIcon
        }),
        'class': pickerClassName,
        ref: 'timePicker',
        on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
          change: this.handleChange,
          open: this.handleOpenClose,
          close: this.handleOpenClose
        })
      };
      return h(_vcTimePicker2['default'], timeProps);
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'TimePicker',
        defaultLocale: this.getDefaultLocale()
      },
      scopedSlots: { 'default': this.renderTimePicker }
    });
  }
};

/* istanbul ignore next */
TimePicker.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(TimePicker.name, TimePicker);
};

exports['default'] = TimePicker;