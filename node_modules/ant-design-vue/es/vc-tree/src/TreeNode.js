import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';
import classNames from 'classnames';
import { getNodeChildren as _getNodeChildren, mapChildren, warnOnlyTreeNode } from './util';
import { initDefaultProps, filterEmpty, getComponentFromProp } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import getTransitionProps from '../../_util/getTransitionProps';

function noop() {}
var ICON_OPEN = 'open';
var ICON_CLOSE = 'close';

var defaultTitle = '---';

var TreeNode = {
  name: 'TreeNode',
  mixins: [BaseMixin],
  __ANT_TREE_NODE: true,
  props: initDefaultProps({
    eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Pass by parent `cloneElement`
    prefixCls: PropTypes.string,
    // className: PropTypes.string,
    root: PropTypes.object,
    // onSelect: PropTypes.func,

    // By parent
    expanded: PropTypes.bool,
    selected: PropTypes.bool,
    checked: PropTypes.bool,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    halfChecked: PropTypes.bool,
    title: PropTypes.any,
    pos: PropTypes.string,
    dragOver: PropTypes.bool,
    dragOverGapTop: PropTypes.bool,
    dragOverGapBottom: PropTypes.bool,

    // By user
    isLeaf: PropTypes.bool,
    checkable: PropTypes.bool,
    selectable: PropTypes.bool,
    disabled: PropTypes.bool,
    disableCheckbox: PropTypes.bool,
    icon: PropTypes.any,
    dataRef: PropTypes.object,
    switcherIcon: PropTypes.any,
    label: PropTypes.any,
    value: PropTypes.any
  }, {}),

  data: function data() {
    return {
      dragNodeHighlight: false
    };
  },

  inject: {
    vcTree: { 'default': function _default() {
        return {};
      } },
    vcTreeNode: { 'default': function _default() {
        return {};
      } }
  },
  provide: function provide() {
    return {
      vcTreeNode: this
    };
  },


  // Isomorphic needn't load data in server side
  mounted: function mounted() {
    var eventKey = this.eventKey,
        registerTreeNode = this.vcTree.registerTreeNode;

    this.syncLoadData(this.$props);
    registerTreeNode && registerTreeNode(eventKey, this);
  },
  updated: function updated() {
    this.syncLoadData(this.$props);
  },
  beforeDestroy: function beforeDestroy() {
    var eventKey = this.eventKey,
        registerTreeNode = this.vcTree.registerTreeNode;

    registerTreeNode && registerTreeNode(eventKey, null);
  },


  methods: {
    onSelectorClick: function onSelectorClick(e) {
      // Click trigger before select/check operation
      var onNodeClick = this.vcTree.onNodeClick;

      onNodeClick(e, this);
      if (this.isSelectable()) {
        this.onSelect(e);
      } else {
        this.onCheck(e);
      }
    },
    onSelectorDoubleClick: function onSelectorDoubleClick(e) {
      var onNodeDoubleClick = this.vcTree.onNodeDoubleClick;

      onNodeDoubleClick(e, this);
    },
    onSelect: function onSelect(e) {
      if (this.isDisabled()) return;

      var onNodeSelect = this.vcTree.onNodeSelect;

      e.preventDefault();
      onNodeSelect(e, this);
    },
    onCheck: function onCheck(e) {
      if (this.isDisabled()) return;

      var disableCheckbox = this.disableCheckbox,
          checked = this.checked;
      var onNodeCheck = this.vcTree.onNodeCheck;


      if (!this.isCheckable() || disableCheckbox) return;

      e.preventDefault();
      var targetChecked = !checked;
      onNodeCheck(e, this, targetChecked);
    },
    onMouseEnter: function onMouseEnter(e) {
      var onNodeMouseEnter = this.vcTree.onNodeMouseEnter;

      onNodeMouseEnter(e, this);
    },
    onMouseLeave: function onMouseLeave(e) {
      var onNodeMouseLeave = this.vcTree.onNodeMouseLeave;

      onNodeMouseLeave(e, this);
    },
    onContextMenu: function onContextMenu(e) {
      var onNodeContextMenu = this.vcTree.onNodeContextMenu;

      onNodeContextMenu(e, this);
    },
    onDragStart: function onDragStart(e) {
      var onNodeDragStart = this.vcTree.onNodeDragStart;


      e.stopPropagation();
      this.setState({
        dragNodeHighlight: true
      });
      onNodeDragStart(e, this);

      try {
        // ie throw error
        // firefox-need-it
        e.dataTransfer.setData('text/plain', '');
      } catch (error) {
        // empty
      }
    },
    onDragEnter: function onDragEnter(e) {
      var onNodeDragEnter = this.vcTree.onNodeDragEnter;


      e.preventDefault();
      e.stopPropagation();
      onNodeDragEnter(e, this);
    },
    onDragOver: function onDragOver(e) {
      var onNodeDragOver = this.vcTree.onNodeDragOver;


      e.preventDefault();
      e.stopPropagation();
      onNodeDragOver(e, this);
    },
    onDragLeave: function onDragLeave(e) {
      var onNodeDragLeave = this.vcTree.onNodeDragLeave;


      e.stopPropagation();
      onNodeDragLeave(e, this);
    },
    onDragEnd: function onDragEnd(e) {
      var onNodeDragEnd = this.vcTree.onNodeDragEnd;


      e.stopPropagation();
      this.setState({
        dragNodeHighlight: false
      });
      onNodeDragEnd(e, this);
    },
    onDrop: function onDrop(e) {
      var onNodeDrop = this.vcTree.onNodeDrop;


      e.preventDefault();
      e.stopPropagation();
      this.setState({
        dragNodeHighlight: false
      });
      onNodeDrop(e, this);
    },


    // Disabled item still can be switch
    onExpand: function onExpand(e) {
      var onNodeExpand = this.vcTree.onNodeExpand;

      onNodeExpand(e, this);
    },
    getNodeChildren: function getNodeChildren() {
      var children = this.$slots['default'];

      var originList = filterEmpty(children);
      var targetList = _getNodeChildren(originList);

      if (originList.length !== targetList.length) {
        warnOnlyTreeNode();
      }

      return targetList;
    },
    getNodeState: function getNodeState() {
      var expanded = this.expanded;


      if (this.isLeaf2()) {
        return null;
      }

      return expanded ? ICON_OPEN : ICON_CLOSE;
    },
    isLeaf2: function isLeaf2() {
      var isLeaf = this.isLeaf,
          loaded = this.loaded;
      var loadData = this.vcTree.loadData;


      var hasChildren = this.getNodeChildren().length !== 0;
      if (isLeaf === false) {
        return false;
      }
      return isLeaf || !loadData && !hasChildren || loadData && loaded && !hasChildren;
    },
    isDisabled: function isDisabled() {
      var disabled = this.disabled;
      var treeDisabled = this.vcTree.disabled;

      // Follow the logic of Selectable

      if (disabled === false) {
        return false;
      }

      return !!(treeDisabled || disabled);
    },
    isCheckable: function isCheckable() {
      var checkable = this.$props.checkable;
      var treeCheckable = this.vcTree.checkable;

      // Return false if tree or treeNode is not checkable

      if (!treeCheckable || checkable === false) return false;
      return treeCheckable;
    },


    // Load data to avoid default expanded tree without data
    syncLoadData: function syncLoadData(props) {
      var expanded = props.expanded,
          loading = props.loading,
          loaded = props.loaded;
      var _vcTree = this.vcTree,
          loadData = _vcTree.loadData,
          onNodeLoad = _vcTree.onNodeLoad;

      if (loading) return;
      // read from state to avoid loadData at same time
      if (loadData && expanded && !this.isLeaf2()) {
        // We needn't reload data when has children in sync logic
        // It's only needed in node expanded
        var hasChildren = this.getNodeChildren().length !== 0;
        if (!hasChildren && !loaded) {
          onNodeLoad(this);
        }
      }
    },
    isSelectable: function isSelectable() {
      var selectable = this.selectable;
      var treeSelectable = this.vcTree.selectable;

      // Ignore when selectable is undefined or null

      if (typeof selectable === 'boolean') {
        return selectable;
      }

      return treeSelectable;
    },


    // Switcher
    renderSwitcher: function renderSwitcher() {
      var h = this.$createElement;
      var expanded = this.expanded;
      var prefixCls = this.vcTree.prefixCls;

      var switcherIcon = getComponentFromProp(this, 'switcherIcon', {}, false) || getComponentFromProp(this.vcTree, 'switcherIcon', {}, false);
      if (this.isLeaf2()) {
        return h(
          'span',
          {
            key: 'switcher',
            'class': classNames(prefixCls + '-switcher', prefixCls + '-switcher-noop')
          },
          [typeof switcherIcon === 'function' ? switcherIcon(_extends({}, this.$props, this.$props.dataRef, { isLeaf: true })) : switcherIcon]
        );
      }

      var switcherCls = classNames(prefixCls + '-switcher', prefixCls + '-switcher_' + (expanded ? ICON_OPEN : ICON_CLOSE));
      return h(
        'span',
        { key: 'switcher', on: {
            'click': this.onExpand
          },
          'class': switcherCls },
        [typeof switcherIcon === 'function' ? switcherIcon(_extends({}, this.$props, this.$props.dataRef, { isLeaf: false })) : switcherIcon]
      );
    },


    // Checkbox
    renderCheckbox: function renderCheckbox() {
      var h = this.$createElement;
      var checked = this.checked,
          halfChecked = this.halfChecked,
          disableCheckbox = this.disableCheckbox;
      var prefixCls = this.vcTree.prefixCls;

      var disabled = this.isDisabled();
      var checkable = this.isCheckable();

      if (!checkable) return null;

      // [Legacy] Custom element should be separate with `checkable` in future
      var $custom = typeof checkable !== 'boolean' ? checkable : null;

      return h(
        'span',
        {
          key: 'checkbox',
          'class': classNames(prefixCls + '-checkbox', checked && prefixCls + '-checkbox-checked', !checked && halfChecked && prefixCls + '-checkbox-indeterminate', (disabled || disableCheckbox) && prefixCls + '-checkbox-disabled'),
          on: {
            'click': this.onCheck
          }
        },
        [$custom]
      );
    },
    renderIcon: function renderIcon() {
      var h = this.$createElement;
      var loading = this.loading;
      var prefixCls = this.vcTree.prefixCls;


      return h('span', {
        key: 'icon',
        'class': classNames(prefixCls + '-iconEle', prefixCls + '-icon__' + (this.getNodeState() || 'docu'), loading && prefixCls + '-icon_loading')
      });
    },


    // Icon + Title
    renderSelector: function renderSelector(h) {
      var selected = this.selected,
          loading = this.loading,
          dragNodeHighlight = this.dragNodeHighlight;

      var icon = getComponentFromProp(this, 'icon', {}, false);
      var _vcTree2 = this.vcTree,
          prefixCls = _vcTree2.prefixCls,
          showIcon = _vcTree2.showIcon,
          treeIcon = _vcTree2.icon,
          draggable = _vcTree2.draggable,
          loadData = _vcTree2.loadData;

      var disabled = this.isDisabled();
      var title = getComponentFromProp(this, 'title', {}, false);
      var wrapClass = prefixCls + '-node-content-wrapper';

      // Icon - Still show loading icon when loading without showIcon
      var $icon = void 0;

      if (showIcon) {
        var currentIcon = icon || treeIcon;
        $icon = currentIcon ? h(
          'span',
          { 'class': classNames(prefixCls + '-iconEle', prefixCls + '-icon__customize') },
          [typeof currentIcon === 'function' ? currentIcon(_extends({}, this.$props, this.$props.dataRef), h) : currentIcon]
        ) : this.renderIcon();
      } else if (loadData && loading) {
        $icon = this.renderIcon();
      }

      var currentTitle = title;
      var $title = currentTitle ? h(
        'span',
        { 'class': prefixCls + '-title' },
        [typeof currentTitle === 'function' ? currentTitle(_extends({}, this.$props, this.$props.dataRef), h) : currentTitle]
      ) : h(
        'span',
        { 'class': prefixCls + '-title' },
        [defaultTitle]
      );

      return h(
        'span',
        {
          key: 'selector',
          ref: 'selectHandle',
          attrs: { title: typeof title === 'string' ? title : '',

            draggable: !disabled && draggable || undefined,
            'aria-grabbed': !disabled && draggable || undefined
          },
          'class': classNames('' + wrapClass, wrapClass + '-' + (this.getNodeState() || 'normal'), !disabled && (selected || dragNodeHighlight) && prefixCls + '-node-selected', !disabled && draggable && 'draggable'), on: {
            'mouseenter': this.onMouseEnter,
            'mouseleave': this.onMouseLeave,
            'contextmenu': this.onContextMenu,
            'click': this.onSelectorClick,
            'dblclick': this.onSelectorDoubleClick,
            'dragstart': draggable ? this.onDragStart : noop
          }
        },
        [$icon, $title]
      );
    },


    // Children list wrapped with `Animation`
    renderChildren: function renderChildren() {
      var h = this.$createElement;
      var expanded = this.expanded,
          pos = this.pos;
      var _vcTree3 = this.vcTree,
          prefixCls = _vcTree3.prefixCls,
          openTransitionName = _vcTree3.openTransitionName,
          openAnimation = _vcTree3.openAnimation,
          renderTreeNode = _vcTree3.renderTreeNode;


      var animProps = {};
      if (openTransitionName) {
        animProps = getTransitionProps(openTransitionName);
      } else if ((typeof openAnimation === 'undefined' ? 'undefined' : _typeof(openAnimation)) === 'object') {
        animProps = _extends({}, openAnimation);
        animProps.props = _extends({ css: false }, animProps.props);
      }

      // Children TreeNode
      var nodeList = this.getNodeChildren();

      if (nodeList.length === 0) {
        return null;
      }

      var $children = void 0;
      if (expanded) {
        $children = h(
          'ul',
          {
            'class': classNames(prefixCls + '-child-tree', expanded && prefixCls + '-child-tree-open'),
            attrs: { 'data-expanded': expanded,
              role: 'group'
            }
          },
          [mapChildren(nodeList, function (node, index) {
            return renderTreeNode(node, index, pos);
          })]
        );
      }

      return h(
        'transition',
        animProps,
        [$children]
      );
    }
  },

  render: function render(h) {
    var _ref;

    var _$props = this.$props,
        dragOver = _$props.dragOver,
        dragOverGapTop = _$props.dragOverGapTop,
        dragOverGapBottom = _$props.dragOverGapBottom,
        isLeaf = _$props.isLeaf,
        expanded = _$props.expanded,
        selected = _$props.selected,
        checked = _$props.checked,
        halfChecked = _$props.halfChecked,
        loading = _$props.loading;
    var _vcTree4 = this.vcTree,
        prefixCls = _vcTree4.prefixCls,
        filterTreeNode = _vcTree4.filterTreeNode,
        draggable = _vcTree4.draggable;

    var disabled = this.isDisabled();
    return h(
      'li',
      {
        'class': (_ref = {}, _defineProperty(_ref, prefixCls + '-treenode-disabled', disabled), _defineProperty(_ref, prefixCls + '-treenode-switcher-' + (expanded ? 'open' : 'close'), !isLeaf), _defineProperty(_ref, prefixCls + '-treenode-checkbox-checked', checked), _defineProperty(_ref, prefixCls + '-treenode-checkbox-indeterminate', halfChecked), _defineProperty(_ref, prefixCls + '-treenode-selected', selected), _defineProperty(_ref, prefixCls + '-treenode-loading', loading), _defineProperty(_ref, 'drag-over', !disabled && dragOver), _defineProperty(_ref, 'drag-over-gap-top', !disabled && dragOverGapTop), _defineProperty(_ref, 'drag-over-gap-bottom', !disabled && dragOverGapBottom), _defineProperty(_ref, 'filter-node', filterTreeNode && filterTreeNode(this)), _ref),
        attrs: { role: 'treeitem'
        },
        on: {
          'dragenter': draggable ? this.onDragEnter : noop,
          'dragover': draggable ? this.onDragOver : noop,
          'dragleave': draggable ? this.onDragLeave : noop,
          'drop': draggable ? this.onDrop : noop,
          'dragend': draggable ? this.onDragEnd : noop
        }
      },
      [this.renderSwitcher(), this.renderCheckbox(), this.renderSelector(h), this.renderChildren()]
    );
  }
};

TreeNode.isTreeNode = 1;

export default TreeNode;