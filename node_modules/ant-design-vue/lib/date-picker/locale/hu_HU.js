'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _hu_HU = require('../../vc-calendar/src/locale/hu_HU');

var _hu_HU2 = _interopRequireDefault(_hu_HU);

var _hu_HU3 = require('../../time-picker/locale/hu_HU');

var _hu_HU4 = _interopRequireDefault(_hu_HU3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Válasszon dátumot',
    rangePlaceholder: ['Kezdő dátum', 'Befejezés dátuma']
  }, _hu_HU2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _hu_HU4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;