import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/id_ID';
import TimePickerLocale from '../../time-picker/locale/id_ID';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'Pilih tanggal',
    rangePlaceholder: ['Mulai tanggal', 'Tanggal akhir']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;