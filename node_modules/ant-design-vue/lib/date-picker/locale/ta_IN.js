'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ta_IN = require('../../vc-calendar/src/locale/ta_IN');

var _ta_IN2 = _interopRequireDefault(_ta_IN);

var _ta_IN3 = require('../../time-picker/locale/ta_IN');

var _ta_IN4 = _interopRequireDefault(_ta_IN3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
// Tamil Locale added to rc-calendar
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'தேதியைத் தேர்ந்தெடுக்கவும்',
    rangePlaceholder: ['தொடக்க தேதி', 'கடைசி தேதி']
  }, _ta_IN2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _ta_IN4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;