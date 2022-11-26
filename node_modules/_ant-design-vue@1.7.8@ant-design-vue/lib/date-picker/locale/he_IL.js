'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _he_IL = require('../../vc-calendar/src/locale/he_IL');

var _he_IL2 = _interopRequireDefault(_he_IL);

var _he_IL3 = require('../../time-picker/locale/he_IL');

var _he_IL4 = _interopRequireDefault(_he_IL3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'בחר תאריך',
    rangePlaceholder: ['תאריך התחלה', 'תאריך סיום']
  }, _he_IL2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _he_IL4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;