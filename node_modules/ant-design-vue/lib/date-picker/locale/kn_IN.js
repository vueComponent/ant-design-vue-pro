'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _kn_IN = require('../../vc-calendar/src/locale/kn_IN');

var _kn_IN2 = _interopRequireDefault(_kn_IN);

var _kn_IN3 = require('../../time-picker/locale/kn_IN');

var _kn_IN4 = _interopRequireDefault(_kn_IN3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ',
    rangePlaceholder: ['ಪ್ರಾರಂಭ ದಿನಾಂಕ', 'ಅಂತಿಮ ದಿನಾಂಕ']
  }, _kn_IN2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _kn_IN4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;