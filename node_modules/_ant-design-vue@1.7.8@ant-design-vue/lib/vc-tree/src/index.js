'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeNode = exports.Tree = undefined;

var _Tree = require('./Tree');

var _Tree2 = _interopRequireDefault(_Tree);

var _TreeNode = require('./TreeNode');

var _TreeNode2 = _interopRequireDefault(_TreeNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Tree.Tree.TreeNode = _TreeNode2['default'];
_Tree2['default'].TreeNode = _TreeNode2['default'];

exports.Tree = _Tree.Tree;
exports.TreeNode = _TreeNode2['default'];
exports['default'] = _Tree2['default'];