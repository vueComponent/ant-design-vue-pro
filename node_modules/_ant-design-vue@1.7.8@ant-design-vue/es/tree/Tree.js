import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import warning from 'warning';
import { Tree as VcTree, TreeNode } from '../vc-tree';
import animation from '../_util/openAnimation';
import PropTypes from '../_util/vue-types';
import { initDefaultProps, getOptionProps, filterEmpty, getComponentFromProp, getListeners } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Icon from '../icon';

function TreeProps() {
  return {
    showLine: PropTypes.bool,
    /** 是否支持多选 */
    multiple: PropTypes.bool,
    /** 是否自动展开父节点 */
    autoExpandParent: PropTypes.bool,
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: PropTypes.bool,
    /** 是否支持选中 */
    checkable: PropTypes.bool,
    /** 是否禁用树 */
    disabled: PropTypes.bool,
    /** 默认展开所有树节点 */
    defaultExpandAll: PropTypes.bool,
    /** 默认展开对应树节点 */
    defaultExpandParent: PropTypes.bool,
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: PropTypes.array,
    /** （受控）展开指定的树节点 */
    expandedKeys: PropTypes.array,
    /** （受控）选中复选框的树节点 */
    checkedKeys: PropTypes.oneOfType([PropTypes.array, PropTypes.shape({
      checked: PropTypes.array,
      halfChecked: PropTypes.array
    }).loose]),
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: PropTypes.array,
    /** （受控）设置选中的树节点 */
    selectedKeys: PropTypes.array,
    /** 默认选中的树节点 */
    defaultSelectedKeys: PropTypes.array,
    selectable: PropTypes.bool,
    /** 展开/收起节点时触发 */
    // onExpand: (expandedKeys: string[], info: AntTreeNodeExpandedEvent) => void | PromiseLike<any>,
    /** 点击复选框触发 */
    // onCheck: (checkedKeys: string[] | { checked: string[]; halfChecked: string[] }, e: AntTreeNodeCheckedEvent) => void,
    /** 点击树节点触发 */
    // onSelect: (selectedKeys: string[], e: AntTreeNodeSelectedEvent) => void,
    /** 单击树节点触发 */
    // onClick: (e: React.MouseEvent<HTMLElement>, node: AntTreeNode) => void,
    /** 双击树节点触发 */
    // onDoubleClick: (e: React.MouseEvent<HTMLElement>, node: AntTreeNode) => void,
    /** filter some AntTreeNodes as you need. it should return true */
    filterAntTreeNode: PropTypes.func,
    /** 异步加载数据 */
    loadData: PropTypes.func,
    loadedKeys: PropTypes.array,
    // onLoaded: (loadedKeys: string[], info: { event: 'load', node: AntTreeNode; }) => void,
    /** 响应右键点击 */
    // onRightClick: (options: AntTreeNodeMouseEvent) => void,
    /** 设置节点可拖拽（IE>8）*/
    draggable: PropTypes.bool,
    // /** 开始拖拽时调用 */
    // onDragStart: (options: AntTreeNodeMouseEvent) => void,
    // /** dragenter 触发时调用 */
    // onDragEnter: (options: AntTreeNodeMouseEvent) => void,
    // /** dragover 触发时调用 */
    // onDragOver: (options: AntTreeNodeMouseEvent) => void,
    // /** dragleave 触发时调用 */
    // onDragLeave: (options: AntTreeNodeMouseEvent) => void,
    // /** drop 触发时调用 */
    // onDrop: (options: AntTreeNodeMouseEvent) => void,
    showIcon: PropTypes.bool,
    icon: PropTypes.func,
    switcherIcon: PropTypes.any,
    prefixCls: PropTypes.string,
    filterTreeNode: PropTypes.func,
    openAnimation: PropTypes.any,
    treeNodes: PropTypes.array,
    treeData: PropTypes.array,
    /**
     * @default{title,key,children}
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: PropTypes.object,
    blockNode: PropTypes.bool
  };
}

export { TreeProps };

export default {
  name: 'ATree',
  model: {
    prop: 'checkedKeys',
    event: 'check'
  },
  props: initDefaultProps(TreeProps(), {
    checkable: false,
    showIcon: false,
    openAnimation: {
      on: animation,
      props: { appear: null }
    },
    blockNode: false
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  created: function created() {
    warning(!('treeNodes' in getOptionProps(this)), '`treeNodes` is deprecated. please use treeData instead.');
  },

  TreeNode: TreeNode,
  methods: {
    renderSwitcherIcon: function renderSwitcherIcon(prefixCls, switcherIcon, _ref) {
      var isLeaf = _ref.isLeaf,
          expanded = _ref.expanded,
          loading = _ref.loading;
      var h = this.$createElement;
      var showLine = this.$props.showLine;

      if (loading) {
        return h(Icon, {
          attrs: { type: 'loading' },
          'class': prefixCls + '-switcher-loading-icon' });
      }

      if (isLeaf) {
        return showLine ? h(Icon, {
          attrs: { type: 'file' },
          'class': prefixCls + '-switcher-line-icon' }) : null;
      }
      var switcherCls = prefixCls + '-switcher-icon';
      if (switcherIcon) {
        return cloneElement(switcherIcon, {
          'class': _defineProperty({}, switcherCls, true)
        });
      }
      return showLine ? h(Icon, {
        attrs: {
          type: expanded ? 'minus-square' : 'plus-square',

          theme: 'outlined'
        },
        'class': prefixCls + '-switcher-line-icon' }) : h(Icon, {
        attrs: { type: 'caret-down', theme: 'filled' },
        'class': switcherCls });
    },
    updateTreeData: function updateTreeData(treeData) {
      var _this = this;

      var $slots = this.$slots,
          $scopedSlots = this.$scopedSlots;

      var defaultFields = { children: 'children', title: 'title', key: 'key' };
      var replaceFields = _extends({}, defaultFields, this.$props.replaceFields);
      return treeData.map(function (item) {
        var key = item[replaceFields.key];
        var children = item[replaceFields.children];

        var _item$on = item.on,
            on = _item$on === undefined ? {} : _item$on,
            _item$slots = item.slots,
            slots = _item$slots === undefined ? {} : _item$slots,
            _item$scopedSlots = item.scopedSlots,
            scopedSlots = _item$scopedSlots === undefined ? {} : _item$scopedSlots,
            cls = item['class'],
            style = item.style,
            restProps = _objectWithoutProperties(item, ['on', 'slots', 'scopedSlots', 'class', 'style']);

        var treeNodeProps = _extends({}, restProps, {
          icon: $scopedSlots[scopedSlots.icon] || $slots[slots.icon] || restProps.icon,
          switcherIcon: $scopedSlots[scopedSlots.switcherIcon] || $slots[slots.switcherIcon] || restProps.switcherIcon,
          title: $scopedSlots[scopedSlots.title] || $slots[slots.title] || $scopedSlots.title || restProps[replaceFields.title],
          dataRef: item,
          on: on,
          key: key,
          'class': cls,
          style: style
        });
        if (children) {
          return _extends({}, treeNodeProps, { children: _this.updateTreeData(children) });
        }
        return treeNodeProps;
      });
    }
  },
  render: function render() {
    var _this2 = this,
        _class2;

    var h = arguments[0];

    var props = getOptionProps(this);
    var $slots = this.$slots,
        $scopedSlots = this.$scopedSlots;
    var customizePrefixCls = props.prefixCls,
        showIcon = props.showIcon,
        treeNodes = props.treeNodes,
        blockNode = props.blockNode;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('tree', customizePrefixCls);
    var _switcherIcon = getComponentFromProp(this, 'switcherIcon');
    var checkable = props.checkable;
    var treeData = props.treeData || treeNodes;
    if (treeData) {
      treeData = this.updateTreeData(treeData);
    }
    var vcTreeProps = {
      props: _extends({}, props, {
        prefixCls: prefixCls,
        checkable: checkable ? h('span', { 'class': prefixCls + '-checkbox-inner' }) : checkable,
        children: filterEmpty($scopedSlots['default'] ? $scopedSlots['default']() : $slots['default']),
        __propsSymbol__: Symbol(),
        switcherIcon: function switcherIcon(nodeProps) {
          return _this2.renderSwitcherIcon(prefixCls, _switcherIcon, nodeProps);
        }
      }),
      on: getListeners(this),
      ref: 'tree',
      'class': (_class2 = {}, _defineProperty(_class2, prefixCls + '-icon-hide', !showIcon), _defineProperty(_class2, prefixCls + '-block-node', blockNode), _class2)
    };
    if (treeData) {
      vcTreeProps.props.treeData = treeData;
    }
    return h(VcTree, vcTreeProps);
  }
};