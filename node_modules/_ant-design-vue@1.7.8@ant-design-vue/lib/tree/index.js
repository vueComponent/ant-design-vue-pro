'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Tree = require('./Tree');

var _Tree2 = _interopRequireDefault(_Tree);

var _DirectoryTree = require('./DirectoryTree');

var _DirectoryTree2 = _interopRequireDefault(_DirectoryTree);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Tree2['default'].TreeNode.name = 'ATreeNode';
_Tree2['default'].DirectoryTree = _DirectoryTree2['default'];
/* istanbul ignore next */
_Tree2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Tree2['default'].name, _Tree2['default']);
  Vue.component(_Tree2['default'].TreeNode.name, _Tree2['default'].TreeNode);
  Vue.component(_DirectoryTree2['default'].name, _DirectoryTree2['default']);
};

exports['default'] = _Tree2['default'];