'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ro_RO = require('../../vc-calendar/src/locale/ro_RO');

var _ro_RO2 = _interopRequireDefault(_ro_RO);

var _ro_RO3 = require('../../time-picker/locale/ro_RO');

var _ro_RO4 = _interopRequireDefault(_ro_RO3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Selectează data',
    rangePlaceholder: ['Data start', 'Data sfârșit']
  }, _ro_RO2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _ro_RO4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;