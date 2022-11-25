import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/hr_HR';
import TimePickerLocale from '../../time-picker/locale/hr_HR';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'Odaberite datum',
    rangePlaceholder: ['Početni datum', 'Završni datum']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;