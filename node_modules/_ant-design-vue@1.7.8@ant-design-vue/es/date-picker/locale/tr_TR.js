import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/tr_TR';
import TimePickerLocale from '../../time-picker/locale/tr_TR';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'Tarih Seç',
    rangePlaceholder: ['Başlangıç Tarihi', 'Bitiş Tarihi']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;