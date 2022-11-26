import _extends from 'babel-runtime/helpers/extends';
import { TreeNode } from '../../vc-tree';
/**
 * SelectNode wrapped the tree node.
 * Let's use SelectNode instead of TreeNode
 * since TreeNode is so confuse here.
 */
export default {
  name: 'SelectNode',
  functional: true,
  isTreeNode: true,
  props: TreeNode.props,
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
    var treeNodeProps = _extends({}, data, {
      on: _extends({}, listeners, data.nativeOn),
      props: props,
      scopedSlots: _extends({}, scopedSlotsTemp, scopedSlots)
    });
    return h(
      TreeNode,
      treeNodeProps,
      [children]
    );
  }
};