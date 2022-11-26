'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WeekPickerProps = exports.RangePickerProps = exports.MonthPickerProps = exports.DatePickerProps = exports.SinglePickerProps = exports.PickerProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _momentUtil = require('../_util/moment-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// import { TimePickerProps } from '../time-picker'
var PickerProps = exports.PickerProps = function PickerProps() {
  return {
    name: _vueTypes2['default'].string,
    transitionName: _vueTypes2['default'].string,
    prefixCls: _vueTypes2['default'].string,
    inputPrefixCls: _vueTypes2['default'].string,
    format: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].array, _vueTypes2['default'].func]),
    disabled: _vueTypes2['default'].bool,
    allowClear: _vueTypes2['default'].bool,
    suffixIcon: _vueTypes2['default'].any,
    popupStyle: _vueTypes2['default'].object,
    dropdownClassName: _vueTypes2['default'].string,
    locale: _vueTypes2['default'].any,
    localeCode: _vueTypes2['default'].string,
    size: _vueTypes2['default'].oneOf(['large', 'small', 'default']),
    getCalendarContainer: _vueTypes2['default'].func,
    open: _vueTypes2['default'].bool,
    // onOpenChange: PropTypes.(status: bool) => void,
    disabledDate: _vueTypes2['default'].func,
    showToday: _vueTypes2['default'].bool,
    dateRender: _vueTypes2['default'].any, // (current: moment.Moment, today: moment.Moment) => React.ReactNode,
    pickerClass: _vueTypes2['default'].string,
    pickerInputClass: _vueTypes2['default'].string,
    timePicker: _vueTypes2['default'].any,
    autoFocus: _vueTypes2['default'].bool,
    tagPrefixCls: _vueTypes2['default'].string,
    tabIndex: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    align: _vueTypes2['default'].object.def(function () {
      return {};
    }),
    inputReadOnly: _vueTypes2['default'].bool,
    valueFormat: _vueTypes2['default'].string
  };
};

var SinglePickerProps = exports.SinglePickerProps = function SinglePickerProps() {
  return {
    value: _momentUtil.TimeType,
    defaultValue: _momentUtil.TimeType,
    defaultPickerValue: _momentUtil.TimeType,
    renderExtraFooter: _vueTypes2['default'].any,
    placeholder: _vueTypes2['default'].string
    // onChange?: (date: moment.Moment, dateString: string) => void;
  };
};

var DatePickerProps = exports.DatePickerProps = function DatePickerProps() {
  return (0, _extends3['default'])({}, PickerProps(), SinglePickerProps(), {
    showTime: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].bool]),
    open: _vueTypes2['default'].bool,
    disabledTime: _vueTypes2['default'].func,
    // onOpenChange?: (status: bool) => void;
    // onOk?: (selectedTime: moment.Moment) => void;
    mode: _vueTypes2['default'].oneOf(['time', 'date', 'month', 'year', 'decade'])
  });
};

var MonthPickerProps = exports.MonthPickerProps = function MonthPickerProps() {
  return (0, _extends3['default'])({}, PickerProps(), SinglePickerProps(), {
    placeholder: _vueTypes2['default'].string,
    monthCellContentRender: _vueTypes2['default'].func
  });
};
// export const RangePickerPresetRange = PropTypes.oneOfType([TimesType, PropTypes.func])

var RangePickerProps = exports.RangePickerProps = function RangePickerProps() {
  return (0, _extends3['default'])({}, PickerProps(), {
    tagPrefixCls: _vueTypes2['default'].string,
    value: _momentUtil.TimesType,
    defaultValue: _momentUtil.TimesType,
    defaultPickerValue: _momentUtil.TimesType,
    timePicker: _vueTypes2['default'].any,
    // onChange?: (dates: TimesType, dateStrings: [string, string]) => void;
    // onCalendarChange?: (dates: TimesType, dateStrings: [string, string]) => void;
    // onOk?: (selectedTime: moment.Moment) => void;
    showTime: _vueTypes2['default'].oneOfType([_vueTypes2['default'].object, _vueTypes2['default'].bool]),
    ranges: _vueTypes2['default'].object,
    placeholder: _vueTypes2['default'].arrayOf(String),
    mode: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].arrayOf(String)]),
    separator: _vueTypes2['default'].any,
    disabledTime: _vueTypes2['default'].func,
    showToday: _vueTypes2['default'].bool,
    renderExtraFooter: _vueTypes2['default'].any
    // onPanelChange?: (value?: TimesType, mode?: string | string[]) => void;
  });
};

var WeekPickerProps = exports.WeekPickerProps = function WeekPickerProps() {
  return (0, _extends3['default'])({}, PickerProps(), SinglePickerProps(), {
    placeholder: _vueTypes2['default'].string
  });
};

// export interface DatePickerDecorator extends React.ClassicComponentClass<DatePickerProps> {
//   RangePicker: React.ClassicComponentClass<RangePickerProps>;
//   MonthPicker: React.ClassicComponentClass<MonthPickerProps>;
//   WeekPicker: React.ClassicComponentClass<WeexPickerProps>;
// }