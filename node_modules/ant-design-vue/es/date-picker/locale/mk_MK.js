import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/mk_MK';
import TimePickerLocale from '../../time-picker/locale/mk_MK';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'Избери датум',
    rangePlaceholder: ['Од датум', 'До датум']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;