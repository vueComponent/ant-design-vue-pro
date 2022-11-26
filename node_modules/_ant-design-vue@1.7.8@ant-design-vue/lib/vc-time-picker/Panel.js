'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _Combobox = require('./Combobox');

var _Combobox2 = _interopRequireDefault(_Combobox);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function generateOptions(length, disabledOptions, hideDisabledOptions) {
  var step = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  var arr = [];
  for (var value = 0; value < length; value += step) {
    if (!disabledOptions || disabledOptions.indexOf(value) < 0 || !hideDisabledOptions) {
      arr.push(value);
    }
  }
  return arr;
}

function toNearestValidTime(time, hourOptions, minuteOptions, secondOptions) {
  var hour = hourOptions.slice().sort(function (a, b) {
    return Math.abs(time.hour() - a) - Math.abs(time.hour() - b);
  })[0];
  var minute = minuteOptions.slice().sort(function (a, b) {
    return Math.abs(time.minute() - a) - Math.abs(time.minute() - b);
  })[0];
  var second = secondOptions.slice().sort(function (a, b) {
    return Math.abs(time.second() - a) - Math.abs(time.second() - b);
  })[0];
  return (0, _moment2['default'])(hour + ':' + minute + ':' + second, 'HH:mm:ss');
}

var Panel = {
  mixins: [_BaseMixin2['default']],
  props: {
    clearText: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string.def('rc-time-picker-panel'),
    defaultOpenValue: {
      type: Object,
      'default': function _default() {
        return (0, _moment2['default'])();
      }
    },
    value: _vueTypes2['default'].any,
    defaultValue: _vueTypes2['default'].any,
    placeholder: _vueTypes2['default'].string,
    format: _vueTypes2['default'].string,
    inputReadOnly: _vueTypes2['default'].bool.def(false),
    disabledHours: _vueTypes2['default'].func.def(noop),
    disabledMinutes: _vueTypes2['default'].func.def(noop),
    disabledSeconds: _vueTypes2['default'].func.def(noop),
    hideDisabledOptions: _vueTypes2['default'].bool,
    // onChange: PropTypes.func,
    // onEsc: PropTypes.func,
    allowEmpty: _vueTypes2['default'].bool,
    showHour: _vueTypes2['default'].bool,
    showMinute: _vueTypes2['default'].bool,
    showSecond: _vueTypes2['default'].bool,
    // onClear: PropTypes.func,
    use12Hours: _vueTypes2['default'].bool.def(false),
    hourStep: _vueTypes2['default'].number,
    minuteStep: _vueTypes2['default'].number,
    secondStep: _vueTypes2['default'].number,
    addon: _vueTypes2['default'].func.def(noop),
    focusOnOpen: _vueTypes2['default'].bool,
    // onKeydown: PropTypes.func,
    clearIcon: _vueTypes2['default'].any
  },
  data: function data() {
    return {
      sValue: this.value,
      selectionRange: [],
      currentSelectPanel: ''
    };
  },

  watch: {
    value: function value(val) {
      this.setState({
        sValue: val
      });
    }
  },

  methods: {
    onChange: function onChange(newValue) {
      this.setState({ sValue: newValue });
      this.__emit('change', newValue);
    },
    onAmPmChange: function onAmPmChange(ampm) {
      this.__emit('amPmChange', ampm);
    },
    onCurrentSelectPanelChange: function onCurrentSelectPanelChange(currentSelectPanel) {
      this.setState({ currentSelectPanel: currentSelectPanel });
    },


    // https://github.com/ant-design/ant-design/issues/5829
    close: function close() {
      this.__emit('esc');
    },
    onEsc: function onEsc(e) {
      this.__emit('esc', e);
    },
    disabledHours2: function disabledHours2() {
      var use12Hours = this.use12Hours,
          disabledHours = this.disabledHours;

      var disabledOptions = disabledHours();
      if (use12Hours && Array.isArray(disabledOptions)) {
        if (this.isAM()) {
          disabledOptions = disabledOptions.filter(function (h) {
            return h < 12;
          }).map(function (h) {
            return h === 0 ? 12 : h;
          });
        } else {
          disabledOptions = disabledOptions.map(function (h) {
            return h === 12 ? 12 : h - 12;
          });
        }
      }
      return disabledOptions;
    },
    isAM: function isAM() {
      var value = this.sValue || this.defaultOpenValue;
      return value.hour() >= 0 && value.hour() < 12;
    }
  },

  render: function render() {
    var h = arguments[0];
    var prefixCls = this.prefixCls,
        placeholder = this.placeholder,
        disabledMinutes = this.disabledMinutes,
        addon = this.addon,
        disabledSeconds = this.disabledSeconds,
        hideDisabledOptions = this.hideDisabledOptions,
        showHour = this.showHour,
        showMinute = this.showMinute,
        showSecond = this.showSecond,
        format = this.format,
        defaultOpenValue = this.defaultOpenValue,
        clearText = this.clearText,
        use12Hours = this.use12Hours,
        focusOnOpen = this.focusOnOpen,
        hourStep = this.hourStep,
        minuteStep = this.minuteStep,
        secondStep = this.secondStep,
        inputReadOnly = this.inputReadOnly,
        sValue = this.sValue,
        currentSelectPanel = this.currentSelectPanel;

    var clearIcon = (0, _propsUtil.getComponentFromProp)(this, 'clearIcon');

    var _getListeners = (0, _propsUtil.getListeners)(this),
        _getListeners$esc = _getListeners.esc,
        esc = _getListeners$esc === undefined ? noop : _getListeners$esc,
        _getListeners$keydown = _getListeners.keydown,
        keydown = _getListeners$keydown === undefined ? noop : _getListeners$keydown;

    var disabledHourOptions = this.disabledHours2();
    var disabledMinuteOptions = disabledMinutes(sValue ? sValue.hour() : null);
    var disabledSecondOptions = disabledSeconds(sValue ? sValue.hour() : null, sValue ? sValue.minute() : null);
    var hourOptions = generateOptions(24, disabledHourOptions, hideDisabledOptions, hourStep);
    var minuteOptions = generateOptions(60, disabledMinuteOptions, hideDisabledOptions, minuteStep);
    var secondOptions = generateOptions(60, disabledSecondOptions, hideDisabledOptions, secondStep);
    var validDefaultOpenValue = toNearestValidTime(defaultOpenValue, hourOptions, minuteOptions, secondOptions);
    return h(
      'div',
      { 'class': prefixCls + '-inner' },
      [h(_Header2['default'], {
        attrs: {
          clearText: clearText,
          prefixCls: prefixCls,
          defaultOpenValue: validDefaultOpenValue,
          value: sValue,
          currentSelectPanel: currentSelectPanel,

          format: format,
          placeholder: placeholder,
          hourOptions: hourOptions,
          minuteOptions: minuteOptions,
          secondOptions: secondOptions,
          disabledHours: this.disabledHours2,
          disabledMinutes: disabledMinutes,
          disabledSeconds: disabledSeconds,

          focusOnOpen: focusOnOpen,

          inputReadOnly: inputReadOnly,
          clearIcon: clearIcon
        },
        on: {
          'esc': esc,
          'change': this.onChange,
          'keydown': keydown
        }
      }), h(_Combobox2['default'], {
        attrs: {
          prefixCls: prefixCls,
          value: sValue,
          defaultOpenValue: validDefaultOpenValue,
          format: format,

          showHour: showHour,
          showMinute: showMinute,
          showSecond: showSecond,
          hourOptions: hourOptions,
          minuteOptions: minuteOptions,
          secondOptions: secondOptions,
          disabledHours: this.disabledHours2,
          disabledMinutes: disabledMinutes,
          disabledSeconds: disabledSeconds,

          use12Hours: use12Hours,

          isAM: this.isAM()
        },
        on: {
          'change': this.onChange,
          'amPmChange': this.onAmPmChange,
          'currentSelectPanelChange': this.onCurrentSelectPanelChange,
          'esc': this.onEsc
        }
      }), addon(this)]
    );
  }
};

exports['default'] = Panel;