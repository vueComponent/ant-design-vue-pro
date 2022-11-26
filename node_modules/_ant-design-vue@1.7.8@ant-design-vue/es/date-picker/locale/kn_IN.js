import _extends from 'babel-runtime/helpers/extends';
import CalendarLocale from '../../vc-calendar/src/locale/kn_IN';
import TimePickerLocale from '../../time-picker/locale/kn_IN';

// Merge into a locale object
var locale = {
  lang: _extends({
    placeholder: 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ',
    rangePlaceholder: ['ಪ್ರಾರಂಭ ದಿನಾಂಕ', 'ಅಂತಿಮ ದಿನಾಂಕ']
  }, CalendarLocale),
  timePickerLocale: _extends({}, TimePickerLocale)
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;