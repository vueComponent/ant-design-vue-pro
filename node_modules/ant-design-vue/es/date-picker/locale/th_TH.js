import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/th_TH';
import TimePickerLocale from '../../time-picker/locale/th_TH';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'เลือกวันที่',
    rangePlaceholder: ['วันเริ่มต้น', 'วันสิ้นสุด']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;