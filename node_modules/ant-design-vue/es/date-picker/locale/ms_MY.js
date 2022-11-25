import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/ms_MY';
import TimePickerLocale from '../../time-picker/locale/ms_MY';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'Pilih tarikh',
    rangePlaceholder: ['Tarikh mula', 'Tarikh akhir']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;