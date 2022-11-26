'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _id_ID = require('../vc-pagination/locale/id_ID');

var _id_ID2 = _interopRequireDefault(_id_ID);

var _id_ID3 = require('../date-picker/locale/id_ID');

var _id_ID4 = _interopRequireDefault(_id_ID3);

var _id_ID5 = require('../time-picker/locale/id_ID');

var _id_ID6 = _interopRequireDefault(_id_ID5);

var _id_ID7 = require('../calendar/locale/id_ID');

var _id_ID8 = _interopRequireDefault(_id_ID7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'id',
  Pagination: _id_ID2['default'],
  DatePicker: _id_ID4['default'],
  TimePicker: _id_ID6['default'],
  Calendar: _id_ID8['default'],
  Table: {
    filterTitle: 'Saring',
    filterConfirm: 'OK',
    filterReset: 'Hapus',
    selectAll: 'Pilih semua di halaman ini',
    selectInvert: 'Balikkan pilihan di halaman ini',
    sortTitle: 'Urutkan'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Batal',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Batal'
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Cari',
    itemUnit: 'item',
    itemsUnit: 'item'
  },
  Upload: {
    uploading: 'Mengunggah...',
    removeFile: 'Hapus file',
    uploadError: 'Kesalahan pengunggahan',
    previewFile: 'File pratinjau',
    downloadFile: 'Unduh berkas'
  },
  Empty: {
    description: 'Tidak ada data'
  }
};