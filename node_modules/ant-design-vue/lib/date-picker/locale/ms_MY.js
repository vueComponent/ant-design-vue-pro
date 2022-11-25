'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ms_MY = require('../../vc-calendar/src/locale/ms_MY');

var _ms_MY2 = _interopRequireDefault(_ms_MY);

var _ms_MY3 = require('../../time-picker/locale/ms_MY');

var _ms_MY4 = _interopRequireDefault(_ms_MY3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Pilih tarikh',
    rangePlaceholder: ['Tarikh mula', 'Tarikh akhir']
  }, _ms_MY2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _ms_MY4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;