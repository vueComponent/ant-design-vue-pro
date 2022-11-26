'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaginationConfig = exports.PaginationProps = undefined;

var _Pagination = require('./Pagination');

Object.defineProperty(exports, 'PaginationProps', {
  enumerable: true,
  get: function get() {
    return _Pagination.PaginationProps;
  }
});
Object.defineProperty(exports, 'PaginationConfig', {
  enumerable: true,
  get: function get() {
    return _Pagination.PaginationConfig;
  }
});

var _Pagination2 = _interopRequireDefault(_Pagination);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* istanbul ignore next */
_Pagination2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Pagination2['default'].name, _Pagination2['default']);
};

exports['default'] = _Pagination2['default'];