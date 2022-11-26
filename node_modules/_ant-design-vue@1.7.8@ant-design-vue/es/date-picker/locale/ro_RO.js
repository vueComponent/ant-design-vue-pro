import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/ro_RO';
import TimePickerLocale from '../../time-picker/locale/ro_RO';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'Selectează data',
    rangePlaceholder: ['Data start', 'Data sfârșit']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;