'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vi_VN = require('../../vc-calendar/src/locale/vi_VN');

var _vi_VN2 = _interopRequireDefault(_vi_VN);

var _vi_VN3 = require('../../time-picker/locale/vi_VN');

var _vi_VN4 = _interopRequireDefault(_vi_VN3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Chọn thời điểm',
    rangePlaceholder: ['Ngày bắt đầu', 'Ngày kết thúc']
  }, _vi_VN2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _vi_VN4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;