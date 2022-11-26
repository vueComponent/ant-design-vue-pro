'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _da_DK = require('../../vc-calendar/src/locale/da_DK');

var _da_DK2 = _interopRequireDefault(_da_DK);

var _da_DK3 = require('../../time-picker/locale/da_DK');

var _da_DK4 = _interopRequireDefault(_da_DK3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Vælg dato',
    rangePlaceholder: ['Startdato', 'Slutdato']
  }, _da_DK2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _da_DK4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;