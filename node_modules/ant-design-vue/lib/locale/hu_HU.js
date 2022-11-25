'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hu_HU = require('../vc-pagination/locale/hu_HU');

var _hu_HU2 = _interopRequireDefault(_hu_HU);

var _hu_HU3 = require('../date-picker/locale/hu_HU');

var _hu_HU4 = _interopRequireDefault(_hu_HU3);

var _hu_HU5 = require('../time-picker/locale/hu_HU');

var _hu_HU6 = _interopRequireDefault(_hu_HU5);

var _hu_HU7 = require('../calendar/locale/hu_HU');

var _hu_HU8 = _interopRequireDefault(_hu_HU7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'hu',
  Pagination: _hu_HU2['default'],
  DatePicker: _hu_HU4['default'],
  TimePicker: _hu_HU6['default'],
  Calendar: _hu_HU8['default'],
  Table: {
    filterTitle: 'Szűrők',
    filterConfirm: 'Alkalmazás',
    filterReset: 'Visszaállítás',
    selectAll: 'Jelenlegi oldal kiválasztása',
    selectInvert: 'Jelenlegi oldal inverze',
    sortTitle: 'Rendezés'
  },
  Modal: {
    okText: 'Alkalmazás',
    cancelText: 'Visszavonás',
    justOkText: 'Alkalmazás'
  },
  Popconfirm: {
    okText: 'Alkalmazás',
    cancelText: 'Visszavonás'
  },
  Transfer: {
    searchPlaceholder: 'Keresés',
    itemUnit: 'elem',
    itemsUnit: 'elemek'
  },
  Upload: {
    uploading: 'Feltöltés...',
    removeFile: 'Fájl eltávolítása',
    uploadError: 'Feltöltési hiba',
    previewFile: 'Fájl előnézet',
    downloadFile: 'Fájl letöltése'
  },
  Empty: {
    description: 'Nincs adat'
  }
};