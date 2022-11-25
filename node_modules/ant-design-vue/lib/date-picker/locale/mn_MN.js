'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _mn_MN = require('../../vc-calendar/src/locale/mn_MN');

var _mn_MN2 = _interopRequireDefault(_mn_MN);

var _mn_MN3 = require('../../time-picker/locale/mn_MN');

var _mn_MN4 = _interopRequireDefault(_mn_MN3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Огноо сонгох',
    rangePlaceholder: ['Эхлэх огноо', 'Дуусах огноо']
  }, _mn_MN2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _mn_MN4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;