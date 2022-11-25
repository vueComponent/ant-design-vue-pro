import _extends from 'babel-runtime/helpers/extends';
import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import { getOptionProps, hasProp, initDefaultProps, getListeners } from '../_util/props-util';
import * as moment from 'moment';
import FullCalendar from '../vc-calendar/src/FullCalendar';
import Header from './Header';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import interopDefault from '../_util/interopDefault';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import enUS from './locale/en_US';
import Base from '../base';
import { checkValidate, stringToMoment, momentToString, TimeType } from '../_util/moment-util';

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
export var CalendarMode = PropTypes.oneOf(['month', 'year']);

export var CalendarProps = function CalendarProps() {
  return {
    prefixCls: PropTypes.string,
    value: TimeType,
    defaultValue: TimeType,
    mode: CalendarMode,
    fullscreen: PropTypes.bool,
    // dateCellRender: PropTypes.func,
    // monthCellRender: PropTypes.func,
    // dateFullCellRender: PropTypes.func,
    // monthFullCellRender: PropTypes.func,
    locale: PropTypes.object,
    // onPanelChange?: (date?: moment.Moment, mode?: CalendarMode) => void;
    // onSelect?: (date?: moment.Moment) => void;
    disabledDate: PropTypes.func,
    validRange: PropTypes.custom(isMomentArray),
    headerRender: PropTypes.func,
    valueFormat: PropTypes.string
  };
};

var Calendar = {
  name: 'ACalendar',
  mixins: [BaseMixin],
  props: initDefaultProps(CalendarProps(), {
    locale: {},
    fullscreen: true
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  data: function data() {
    var value = this.value,
        defaultValue = this.defaultValue,
        valueFormat = this.valueFormat;

    var sValue = value || defaultValue || interopDefault(moment)();
    checkValidate('Calendar', defaultValue, 'defaultValue', valueFormat);
    checkValidate('Calendar', value, 'value', valueFormat);
    this._sPrefixCls = undefined;
    return {
      sValue: stringToMoment(sValue, valueFormat),
      sMode: this.mode || 'month'
    };
  },

  watch: {
    value: function value(val) {
      checkValidate('Calendar', val, 'value', this.valueFormat);
      this.setState({
        sValue: stringToMoment(val, this.valueFormat)
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
      var val = this.valueFormat ? momentToString(value, this.valueFormat) : value;
      this.$emit('panelChange', val, mode);
      if (value !== this.sValue) {
        this.$emit('change', val);
      }
    },
    onSelect: function onSelect(value) {
      this.setValue(value, 'select');
    },
    setValue: function setValue(value, way) {
      var prevValue = this.value ? stringToMoment(this.value, this.valueFormat) : this.sValue;
      var mode = this.sMode,
          valueFormat = this.valueFormat;

      if (!hasProp(this, 'value')) {
        this.setState({ sValue: value });
      }
      if (way === 'select') {
        if (prevValue && prevValue.month() !== value.month()) {
          this.onPanelChange(value, mode);
        }
        this.$emit('select', valueFormat ? momentToString(value, valueFormat) : value);
      } else if (way === 'changePanel') {
        this.onPanelChange(value, mode);
      }
    },
    getDateRange: function getDateRange(validRange, disabledDate) {
      return function (current) {
        if (!current) {
          return false;
        }

        var _validRange = _slicedToArray(validRange, 2),
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
      var result = _extends({}, enUS, this.$props.locale);
      result.lang = _extends({}, result.lang, (this.$props.locale || {}).lang);
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

      var props = getOptionProps(this);
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
        props: _extends({}, props, {
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
        on: _extends({}, getListeners(this), {
          select: this.onSelect
        })
      };
      return h(
        'div',
        { 'class': cls },
        [h(Header, {
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
        }), h(FullCalendar, fullCalendarProps)]
      );
    }
  },

  render: function render() {
    var h = arguments[0];

    return h(LocaleReceiver, {
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
  Vue.use(Base);
  Vue.component(Calendar.name, Calendar);
};
export { HeaderProps } from './Header';
export default Calendar;