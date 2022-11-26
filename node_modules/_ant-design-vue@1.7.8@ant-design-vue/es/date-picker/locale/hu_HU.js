import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/hu_HU';
import TimePickerLocale from '../../time-picker/locale/hu_HU';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'Válasszon dátumot',
    rangePlaceholder: ['Kezdő dátum', 'Befejezés dátuma']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;