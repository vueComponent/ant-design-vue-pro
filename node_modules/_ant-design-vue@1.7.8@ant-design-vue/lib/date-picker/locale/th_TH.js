'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _th_TH = require('../../vc-calendar/src/locale/th_TH');

var _th_TH2 = _interopRequireDefault(_th_TH);

var _th_TH3 = require('../../time-picker/locale/th_TH');

var _th_TH4 = _interopRequireDefault(_th_TH3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'เลือกวันที่',
    rangePlaceholder: ['วันเริ่มต้น', 'วันสิ้นสุด']
  }, _th_TH2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _th_TH4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;