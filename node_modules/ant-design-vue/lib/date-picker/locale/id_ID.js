'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _id_ID = require('../../vc-calendar/src/locale/id_ID');

var _id_ID2 = _interopRequireDefault(_id_ID);

var _id_ID3 = require('../../time-picker/locale/id_ID');

var _id_ID4 = _interopRequireDefault(_id_ID3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Merge into a locale object
var locale = {
  lang: (0, _extends3['default'])({
    placeholder: 'Pilih tanggal',
    rangePlaceholder: ['Mulai tanggal', 'Tanggal akhir']
  }, _id_ID2['default']),
  timePickerLocale: (0, _extends3['default'])({}, _id_ID4['default'])
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

exports['default'] = locale;