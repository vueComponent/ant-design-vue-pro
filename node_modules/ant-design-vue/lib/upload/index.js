'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadChangeParam = exports.UploadListProps = exports.UploadProps = undefined;

var _interface = require('./interface');

Object.defineProperty(exports, 'UploadProps', {
  enumerable: true,
  get: function get() {
    return _interface.UploadProps;
  }
});
Object.defineProperty(exports, 'UploadListProps', {
  enumerable: true,
  get: function get() {
    return _interface.UploadListProps;
  }
});
Object.defineProperty(exports, 'UploadChangeParam', {
  enumerable: true,
  get: function get() {
    return _interface.UploadChangeParam;
  }
});

var _Upload = require('./Upload');

var _Upload2 = _interopRequireDefault(_Upload);

var _Dragger = require('./Dragger');

var _Dragger2 = _interopRequireDefault(_Dragger);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Upload2['default'].Dragger = _Dragger2['default'];

/* istanbul ignore next */
_Upload2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Upload2['default'].name, _Upload2['default']);
  Vue.component(_Dragger2['default'].name, _Dragger2['default']);
};

exports['default'] = _Upload2['default'];