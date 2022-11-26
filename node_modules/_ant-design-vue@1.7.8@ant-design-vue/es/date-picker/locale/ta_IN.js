import _extends from 'babel-runtime/helpers/extends';
// Tamil Locale added to rc-calendar
import CalendarLocale from '../../vc-calendar/src/locale/ta_IN';
import TimePickerLocale from '../../time-picker/locale/ta_IN';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'தேதியைத் தேர்ந்தெடுக்கவும்',
    rangePlaceholder: ['தொடக்க தேதி', 'கடைசி தேதி']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;