'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SHOW_CHILD = exports.SHOW_PARENT = exports.SHOW_ALL = exports.TreeNode = undefined;

var _src = require('./src');

Object.defineProperty(exports, 'TreeNode', {
  enumerable: true,
  get: function get() {
    return _src.TreeNode;
  }
});
Object.defineProperty(exports, 'SHOW_ALL', {
  enumerable: true,
  get: function get() {
    return _src.SHOW_ALL;
  }
});
Object.defineProperty(exports, 'SHOW_PARENT', {
  enumerable: true,
  get: function get() {
    return _src.SHOW_PARENT;
  }
});
Object.defineProperty(exports, 'SHOW_CHILD', {
  enumerable: true,
  get: function get() {
    return _src.SHOW_CHILD;
  }
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _src2 = _interopRequireDefault(_src);

var _vueRef = require('vue-ref');

var _vueRef2 = _interopRequireDefault(_vueRef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_vue2['default'].use(_vueRef2['default'], { name: 'ant-ref' }); // export this package's api
// base 2.9.3
exports['default'] = _src2['default'];