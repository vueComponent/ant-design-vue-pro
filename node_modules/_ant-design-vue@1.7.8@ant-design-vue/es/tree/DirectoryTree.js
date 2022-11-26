import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _extends from 'babel-runtime/helpers/extends';
import omit from 'omit.js';
import debounce from 'lodash/debounce';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import { conductExpandParent, convertTreeToEntities } from '../vc-tree/src/util';
import Tree, { TreeProps } from './Tree';
import { calcRangeKeys, getFullKeyList, convertDirectoryKeysToNodes, getFullKeyListByTreeData } from './util';
import Icon from '../icon';
import BaseMixin from '../_util/BaseMixin';
import { initDefaultProps, getOptionProps, getListeners, getComponentFromProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

// export type ExpandAction = false | 'click' | 'dblclick'; export interface
// DirectoryTreeProps extends TreeProps {   expandAction?: ExpandAction; }
// export interface DirectoryTreeState {   expandedKeys?: string[];
// selectedKeys?: string[]; }

function getIcon(props, h) {
  var isLeaf = props.isLeaf,
      expanded = props.expanded;

  if (isLeaf) {
    return h(Icon, {
      attrs: { type: 'file' }
    });
  }
  return h(Icon, {
    attrs: { type: expanded ? 'folder-open' : 'folder' }
  });
}

export default {
  name: 'ADirectoryTree',
  mixins: [BaseMixin],
  model: {
    prop: 'checkedKeys',
    event: 'check'
  },
  props: initDefaultProps(_extends({}, TreeProps(), {
    expandAction: PropTypes.oneOf([false, 'click', 'doubleclick', 'dblclick'])
  }), {
    showIcon: true,
    expandAction: 'click'
  }),

  // state: DirectoryTreeState; onDebounceExpand: (event, node: AntTreeNode) =>
  // void; // Shift click usage lastSelectedKey?: string; cachedSelectedKeys?:
  // string[];
  inject: {
    configProvider: {
      'default': function _default() {
        return ConfigConsumerProps;
      }
    }
  },
  data: function data() {
    var props = getOptionProps(this);
    var defaultExpandAll = props.defaultExpandAll,
        defaultExpandParent = props.defaultExpandParent,
        expandedKeys = props.expandedKeys,
        defaultExpandedKeys = props.defaultExpandedKeys;

    var _convertTreeToEntitie = convertTreeToEntities(this.$slots['default']),
        keyEntities = _convertTreeToEntitie.keyEntities;

    var state = {};
    // Selected keys
    state._selectedKeys = props.selectedKeys || props.defaultSelectedKeys || [];

    // Expanded keys
    if (defaultExpandAll) {
      if (props.treeData) {
        state._expandedKeys = getFullKeyListByTreeData(props.treeData);
      } else {
        state._expandedKeys = getFullKeyList(this.$slots['default']);
      }
    } else if (defaultExpandParent) {
      state._expandedKeys = conductExpandParent(expandedKeys || defaultExpandedKeys, keyEntities);
    } else {
      state._expandedKeys = expandedKeys || defaultExpandedKeys;
    }

    this.onDebounceExpand = debounce(this.expandFolderNode, 200, { leading: true });
    return _extends({
      _selectedKeys: [],
      _expandedKeys: []
    }, state);
  },

  watch: {
    expandedKeys: function expandedKeys(val) {
      this.setState({ _expandedKeys: val });
    },
    selectedKeys: function selectedKeys(val) {
      this.setState({ _selectedKeys: val });
    }
  },
  methods: {
    onExpand: function onExpand(expandedKeys, info) {
      this.setUncontrolledState({ _expandedKeys: expandedKeys });

      this.$emit('expand', expandedKeys, info);

      return undefined;
    },
    onClick: function onClick(event, node) {
      var expandAction = this.$props.expandAction;

      // Expand the tree

      if (expandAction === 'click') {
        this.onDebounceExpand(event, node);
      }
      this.$emit('click', event, node);
    },
    onDoubleClick: function onDoubleClick(event, node) {
      var expandAction = this.$props.expandAction;

      // Expand the tree

      if (expandAction === 'dblclick' || expandAction === 'doubleclick') {
        this.onDebounceExpand(event, node);
      }

      this.$emit('doubleclick', event, node);
      this.$emit('dblclick', event, node);
    },
    onSelect: function onSelect(keys, event) {
      var multiple = this.$props.multiple;

      var children = this.$slots['default'] || [];
      var _$data$_expandedKeys = this.$data._expandedKeys,
          expandedKeys = _$data$_expandedKeys === undefined ? [] : _$data$_expandedKeys;
      var node = event.node,
          nativeEvent = event.nativeEvent;
      var _node$eventKey = node.eventKey,
          eventKey = _node$eventKey === undefined ? '' : _node$eventKey;


      var newState = {};

      // We need wrap this event since some value is not same
      var newEvent = _extends({}, event, {
        selected: true // Directory selected always true
      });

      // Windows / Mac single pick
      var ctrlPick = nativeEvent.ctrlKey || nativeEvent.metaKey;
      var shiftPick = nativeEvent.shiftKey;

      // Generate new selected keys
      var newSelectedKeys = void 0;
      if (multiple && ctrlPick) {
        // Control click
        newSelectedKeys = keys;
        this.lastSelectedKey = eventKey;
        this.cachedSelectedKeys = newSelectedKeys;
        newEvent.selectedNodes = convertDirectoryKeysToNodes(children, newSelectedKeys);
      } else if (multiple && shiftPick) {
        // Shift click
        newSelectedKeys = Array.from(new Set([].concat(_toConsumableArray(this.cachedSelectedKeys || []), _toConsumableArray(calcRangeKeys(children, expandedKeys, eventKey, this.lastSelectedKey)))));
        newEvent.selectedNodes = convertDirectoryKeysToNodes(children, newSelectedKeys);
      } else {
        // Single click
        newSelectedKeys = [eventKey];
        this.lastSelectedKey = eventKey;
        this.cachedSelectedKeys = newSelectedKeys;
        newEvent.selectedNodes = [event.node];
      }
      newState._selectedKeys = newSelectedKeys;

      this.$emit('update:selectedKeys', newSelectedKeys);
      this.$emit('select', newSelectedKeys, newEvent);

      this.setUncontrolledState(newState);
    },
    expandFolderNode: function expandFolderNode(event, node) {
      var isLeaf = node.isLeaf;


      if (isLeaf || event.shiftKey || event.metaKey || event.ctrlKey) {
        return;
      }

      if (this.$refs.tree.$refs.tree) {
        // Get internal vc-tree
        var internalTree = this.$refs.tree.$refs.tree;

        // Call internal rc-tree expand function
        // https://github.com/ant-design/ant-design/issues/12567
        internalTree.onNodeExpand(event, node);
      }
    },
    setUncontrolledState: function setUncontrolledState(state) {
      var newState = omit(state, Object.keys(getOptionProps(this)).map(function (p) {
        return '_' + p;
      }));
      if (Object.keys(newState).length) {
        this.setState(newState);
      }
    }
  },

  render: function render() {
    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        props = _objectWithoutProperties(_getOptionProps, ['prefixCls']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('tree', customizePrefixCls);
    var _$data = this.$data,
        expandedKeys = _$data._expandedKeys,
        selectedKeys = _$data._selectedKeys;

    var listeners = getListeners(this);
    warning(!listeners.doubleclick, '`doubleclick` is deprecated. please use `dblclick` instead.');
    var treeProps = {
      props: _extends({
        icon: getIcon
      }, props, {
        prefixCls: prefixCls,
        expandedKeys: expandedKeys,
        selectedKeys: selectedKeys,
        switcherIcon: getComponentFromProp(this, 'switcherIcon')
      }),
      ref: 'tree',
      'class': prefixCls + '-directory',
      on: _extends({}, omit(listeners, ['update:selectedKeys']), {
        select: this.onSelect,
        click: this.onClick,
        dblclick: this.onDoubleClick,
        expand: this.onExpand
      })
    };
    return h(
      Tree,
      treeProps,
      [this.$slots['default']]
    );
  }
};