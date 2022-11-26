'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ru_RU = require('../vc-pagination/locale/ru_RU');

var _ru_RU2 = _interopRequireDefault(_ru_RU);

var _ru_RU3 = require('../date-picker/locale/ru_RU');

var _ru_RU4 = _interopRequireDefault(_ru_RU3);

var _ru_RU5 = require('../time-picker/locale/ru_RU');

var _ru_RU6 = _interopRequireDefault(_ru_RU5);

var _ru_RU7 = require('../calendar/locale/ru_RU');

var _ru_RU8 = _interopRequireDefault(_ru_RU7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  locale: 'ru',
  Pagination: _ru_RU2['default'],
  DatePicker: _ru_RU4['default'],
  TimePicker: _ru_RU6['default'],
  Calendar: _ru_RU8['default'],
  Table: {
    filterTitle: 'Фильтр',
    filterConfirm: 'OK',
    filterReset: 'Сбросить',
    selectAll: 'Выбрать всё',
    selectInvert: 'Инвертировать выбор',
    sortTitle: 'Сортировка'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Отмена',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Отмена'
  },
  Transfer: {
    searchPlaceholder: 'Поиск',
    itemUnit: 'элем.',
    itemsUnit: 'элем.'
  },
  Upload: {
    uploading: 'Загрузка...',
    removeFile: 'Удалить файл',
    uploadError: 'При загрузке произошла ошибка',
    previewFile: 'Предпросмотр файла',
    downloadFile: 'Загрузить файл'
  },
  Empty: {
    description: 'Нет данных'
  },
  Text: {
    edit: 'редактировать',
    copy: 'копировать',
    copied: 'скопировано',
    expand: 'раскрыть'
  },
  PageHeader: {
    back: 'назад'
  }
};