'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vcTree = require('../../vc-tree');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * SelectNode wrapped the tree node.
 * Let's use SelectNode instead of TreeNode
 * since TreeNode is so confuse here.
 */
exports['default'] = {
  name: 'SelectNode',
  functional: true,
  isTreeNode: true,
  props: _vcTree.TreeNode.props,
  render: function render(h, context) {
    var props = context.props,
        slots = context.slots,
        listeners = context.listeners,
        data = context.data,
        scopedSlots = context.scopedSlots;

    var $slots = slots() || {};
    var children = $slots['default'];
    var slotsKey = Object.keys($slots);
    var scopedSlotsTemp = {}; // for vue 2.5.x
    slotsKey.forEach(function (name) {
      scopedSlotsTemp[name] = function () {
        return $slots[name];
      };
    });
    var treeNodeProps = (0, _extends3['default'])({}, data, {
      on: (0, _extends3['default'])({}, listeners, data.nativeOn),
      props: props,
      scopedSlots: (0, _extends3['default'])({}, scopedSlotsTemp, scopedSlots)
    });
    return h(
      _vcTree.TreeNode,
      treeNodeProps,
      [children]
    );
  }
};