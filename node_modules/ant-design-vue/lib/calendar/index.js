'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderProps = exports.CalendarProps = exports.CalendarMode = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _Header = require('./Header');

Object.defineProperty(exports, 'HeaderProps', {
  enumerable: true,
  get: function get() {
    return _Header.HeaderProps;
  }
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _FullCalendar = require('../vc-calendar/src/FullCalendar');

var _FullCalendar2 = _interopRequireDefault(_FullCalendar);

var _Header2 = _interopRequireDefault(_Header);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _interopDefault = require('../_util/interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _en_US = require('./locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _momentUtil = require('../_util/moment-util');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {
  return null;
}

function zerofixed(v) {
  if (v < 10) {
    return '0' + v;
  }
  return '' + v;
}
function isMomentArray(value) {
  return Array.isArray(value) && !!value.find(function (val) {
    return moment.isMoment(val);
  });
}
var CalendarMode = exports.CalendarMode = _vueTypes2['default'].oneOf(['month', 'year']);

var CalendarProps = exports.CalendarProps = function CalendarProps() {
  return {
    prefixCls: _vueTypes2['default'].string,
    value: _momentUtil.TimeType,
    defaultValue: _momentUtil.TimeType,
    mode: CalendarMode,
    fullscreen: _vueTypes2['default'].bool,
    // dateCellRender: PropTypes.func,
    // monthCellRender: PropTypes.func,
    // dateFullCellRender: PropTypes.func,
    // monthFullCellRender: PropTypes.func,
    locale: _vueTypes2['default'].object,
    // onPanelChange?: (date?: moment.Moment, mode?: CalendarMode) => void;
    // onSelect?: (date?: moment.Moment) => void;
    disabledDate: _vueTypes2['default'].func,
    validRange: _vueTypes2['default'].custom(isMomentArray),
    headerRender: _vueTypes2['default'].func,
    valueFormat: _vueTypes2['default'].string
  };
};

var Calendar = {
  name: 'ACalendar',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)(CalendarProps(), {
    locale: {},
    fullscreen: true
  }),
  model: {
    prop: 'value',
    event: 'change'
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

    var sValue = value || defaultValue || (0, _interopDefault2['default'])(moment)();
    (0, _momentUtil.checkValidate)('Calendar', defaultValue, 'defaultValue', valueFormat);
    (0, _momentUtil.checkValidate)('Calendar', value, 'value', valueFormat);
    this._sPrefixCls = undefined;
    return {
      sValue: (0, _momentUtil.stringToMoment)(sValue, valueFormat),
      sMode: this.mode || 'month'
    };
  },

  watch: {
    value: function value(val) {
      (0, _momentUtil.checkValidate)('Calendar', val, 'value', this.valueFormat);
      this.setState({
        sValue: (0, _momentUtil.stringToMoment)(val, this.valueFormat)
      });
    },
    mode: function mode(val) {
      this.setState({
        sMode: val
      });
    }
  },
  methods: {
    onHeaderValueChange: function onHeaderValueChange(value) {
      this.setValue(value, 'changePanel');
    },
    onHeaderTypeChange: function onHeaderTypeChange(mode) {
      this.sMode = mode;
      this.onPanelChange(this.sValue, mode);
    },
    onPanelChange: function onPanelChange(value, mode) {
      var val = this.valueFormat ? (0, _momentUtil.momentToString)(value, this.valueFormat) : value;
      this.$emit('panelChange', val, mode);
      if (value !== this.sValue) {
        this.$emit('change', val);
      }
    },
    onSelect: function onSelect(value) {
      this.setValue(value, 'select');
    },
    setValue: function setValue(value, way) {
      var prevValue = this.value ? (0, _momentUtil.stringToMoment)(this.value, this.valueFormat) : this.sValue;
      var mode = this.sMode,
          valueFormat = this.valueFormat;

      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState({ sValue: value });
      }
      if (way === 'select') {
        if (prevValue && prevValue.month() !== value.month()) {
          this.onPanelChange(value, mode);
        }
        this.$emit('select', valueFormat ? (0, _momentUtil.momentToString)(value, valueFormat) : value);
      } else if (way === 'changePanel') {
        this.onPanelChange(value, mode);
      }
    },
    getDateRange: function getDateRange(validRange, disabledDate) {
      return function (current) {
        if (!current) {
          return false;
        }

        var _validRange = (0, _slicedToArray3['default'])(validRange, 2),
            startDate = _validRange[0],
            endDate = _validRange[1];

        var inRange = !current.isBetween(startDate, endDate, 'days', '[]');
        if (disabledDate) {
          return disabledDate(current) || inRange;
        }
        return inRange;
      };
    },
    getDefaultLocale: function getDefaultLocale() {
      var result = (0, _extends3['default'])({}, _en_US2['default'], this.$props.locale);
      result.lang = (0, _extends3['default'])({}, result.lang, (this.$props.locale || {}).lang);
      return result;
    },
    monthCellRender2: function monthCellRender2(value) {
      var h = this.$createElement;
      var _sPrefixCls = this._sPrefixCls,
          $scopedSlots = this.$scopedSlots;

      var monthCellRender = this.monthCellRender || $scopedSlots.monthCellRender || noop;
      return h(
        'div',
        { 'class': _sPrefixCls + '-month' },
        [h(
          'div',
          { 'class': _sPrefixCls + '-value' },
          [value.localeData().monthsShort(value)]
        ), h(
          'div',
          { 'class': _sPrefixCls + '-content' },
          [monthCellRender(value)]
        )]
      );
    },
    dateCellRender2: function dateCellRender2(value) {
      var h = this.$createElement;
      var _sPrefixCls = this._sPrefixCls,
          $scopedSlots = this.$scopedSlots;

      var dateCellRender = this.dateCellRender || $scopedSlots.dateCellRender || noop;
      return h(
        'div',
        { 'class': _sPrefixCls + '-date' },
        [h(
          'div',
          { 'class': _sPrefixCls + '-value' },
          [zerofixed(value.date())]
        ), h(
          'div',
          { 'class': _sPrefixCls + '-content' },
          [dateCellRender(value)]
        )]
      );
    },
    renderCalendar: function renderCalendar(locale, localeCode) {
      var h = this.$createElement;

      var props = (0, _propsUtil.getOptionProps)(this);
      var value = this.sValue,
          mode = this.sMode,
          $scopedSlots = this.$scopedSlots;

      if (value && localeCode) {
        value.locale(localeCode);
      }
      var customizePrefixCls = props.prefixCls,
          fullscreen = props.fullscreen,
          dateFullCellRender = props.dateFullCellRender,
          monthFullCellRender = props.monthFullCellRender;

      var headerRender = this.headerRender || $scopedSlots.headerRender;
      var getPrefixCls = this.configProvider.getPrefixCls;
      var prefixCls = getPrefixCls('fullcalendar', customizePrefixCls);

      // To support old version react.
      // Have to add prefixCls on the instance.
      // https://github.com/facebook/react/issues/12397
      this._sPrefixCls = prefixCls;

      var cls = '';
      if (fullscreen) {
        cls += ' ' + prefixCls + '-fullscreen';
      }

      var monthCellRender = monthFullCellRender || $scopedSlots.monthFullCellRender || this.monthCellRender2;
      var dateCellRender = dateFullCellRender || $scopedSlots.dateFullCellRender || this.dateCellRender2;

      var disabledDate = props.disabledDate;

      if (props.validRange) {
        disabledDate = this.getDateRange(props.validRange, disabledDate);
      }
      var fullCalendarProps = {
        props: (0, _extends3['default'])({}, props, {
          Select: {},
          locale: locale.lang,
          type: mode === 'year' ? 'month' : 'date',
          prefixCls: prefixCls,
          showHeader: false,
          value: value,
          monthCellRender: monthCellRender,
          dateCellRender: dateCellRender,
          disabledDate: disabledDate
        }),
        on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
          select: this.onSelect
        })
      };
      return h(
        'div',
        { 'class': cls },
        [h(_Header2['default'], {
          attrs: {
            fullscreen: fullscreen,
            type: mode,
            headerRender: headerRender,
            value: value,
            locale: locale.lang,
            prefixCls: prefixCls,

            validRange: props.validRange
          },
          on: {
            'typeChange': this.onHeaderTypeChange,
            'valueChange': this.onHeaderValueChange
          }
        }), h(_FullCalendar2['default'], fullCalendarProps)]
      );
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Calendar',
        defaultLocale: this.getDefaultLocale
      },
      scopedSlots: { 'default': this.renderCalendar }
    });
  }
};

/* istanbul ignore next */
Calendar.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Calendar.name, Calendar);
};
exports['default'] = Calendar;