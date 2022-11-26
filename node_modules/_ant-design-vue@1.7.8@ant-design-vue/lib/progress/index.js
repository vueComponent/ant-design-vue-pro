'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressProps = undefined;

var _progress = require('./progress');

Object.defineProperty(exports, 'ProgressProps', {
  enumerable: true,
  get: function get() {
    return _progress.ProgressProps;
  }
});

var _progress2 = _interopRequireDefault(_progress);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* istanbul ignore next */
_progress2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_progress2['default'].name, _progress2['default']);
};

exports['default'] = _progress2['default'];