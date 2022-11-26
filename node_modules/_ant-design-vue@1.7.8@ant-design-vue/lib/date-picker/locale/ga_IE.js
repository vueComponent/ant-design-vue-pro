'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ga_IE = require('../../vc-calendar/src/locale/ga_IE');

var _ga_IE2 = _interopRequireDefault(_ga_IE);

var _ga_IE3 = require('../../time-picker/locale/ga_IE');

var _ga_IE4 = _interopRequireDefault(_ga_IE3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Select date',
    rangePlaceholder: ['Start date', 'End date']
  }, _ga_IE2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _ga_IE4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;