'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _util = require('../vc-tree/src/util');

var _Tree = require('./Tree');

var _Tree2 = _interopRequireDefault(_Tree);

var _util2 = require('./util');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export type ExpandAction = false | 'click' | 'dblclick'; export interface
// DirectoryTreeProps extends TreeProps {   expandAction?: ExpandAction; }
// export interface DirectoryTreeState {   expandedKeys?: string[];
// selectedKeys?: string[]; }

function getIcon(props, h) {
  var isLeaf = props.isLeaf,
      expanded = props.expanded;

  if (isLeaf) {
    return h(_icon2['default'], {
      attrs: { type: 'file' }
    });
  }
  return h(_icon2['default'], {
    attrs: { type: expanded ? 'folder-open' : 'folder' }
  });
}

exports['default'] = {
  name: 'ADirectoryTree',
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'checkedKeys',
    event: 'check'
  },
  props: (0, _propsUtil.initDefaultProps)((0, _extends3['default'])({}, (0, _Tree.TreeProps)(), {
    expandAction: _vueTypes2['default'].oneOf([false, 'click', 'doubleclick', 'dblclick'])
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
        return _configConsumerProps.ConfigConsumerProps;
      }
    }
  },
  data: function data() {
    var props = (0, _propsUtil.getOptionProps)(this);
    var defaultExpandAll = props.defaultExpandAll,
        defaultExpandParent = props.defaultExpandParent,
        expandedKeys = props.expandedKeys,
        defaultExpandedKeys = props.defaultExpandedKeys;

    var _convertTreeToEntitie = (0, _util.convertTreeToEntities)(this.$slots['default']),
        keyEntities = _convertTreeToEntitie.keyEntities;

    var state = {};
    // Selected keys
    state._selectedKeys = props.selectedKeys || props.defaultSelectedKeys || [];

    // Expanded keys
    if (defaultExpandAll) {
      if (props.treeData) {
        state._expandedKeys = (0, _util2.getFullKeyListByTreeData)(props.treeData);
      } else {
        state._expandedKeys = (0, _util2.getFullKeyList)(this.$slots['default']);
      }
    } else if (defaultExpandParent) {
      state._expandedKeys = (0, _util.conductExpandParent)(expandedKeys || defaultExpandedKeys, keyEntities);
    } else {
      state._expandedKeys = expandedKeys || defaultExpandedKeys;
    }

    this.onDebounceExpand = (0, _debounce2['default'])(this.expandFolderNode, 200, { leading: true });
    return (0, _extends3['default'])({
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
      var newEvent = (0, _extends3['default'])({}, event, {
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
        newEvent.selectedNodes = (0, _util2.convertDirectoryKeysToNodes)(children, newSelectedKeys);
      } else if (multiple && shiftPick) {
        // Shift click
        newSelectedKeys = Array.from(new Set([].concat((0, _toConsumableArray3['default'])(this.cachedSelectedKeys || []), (0, _toConsumableArray3['default'])((0, _util2.calcRangeKeys)(children, expandedKeys, eventKey, this.lastSelectedKey)))));
        newEvent.selectedNodes = (0, _util2.convertDirectoryKeysToNodes)(children, newSelectedKeys);
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
      var newState = (0, _omit2['default'])(state, Object.keys((0, _propsUtil.getOptionProps)(this)).map(function (p) {
        return '_' + p;
      }));
      if (Object.keys(newState).length) {
        this.setState(newState);
      }
    }
  },

  render: function render() {
    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        props = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('tree', customizePrefixCls);
    var _$data = this.$data,
        expandedKeys = _$data._expandedKeys,
        selectedKeys = _$data._selectedKeys;

    var listeners = (0, _propsUtil.getListeners)(this);
    (0, _warning2['default'])(!listeners.doubleclick, '`doubleclick` is deprecated. please use `dblclick` instead.');
    var treeProps = {
      props: (0, _extends3['default'])({
        icon: getIcon
      }, props, {
        prefixCls: prefixCls,
        expandedKeys: expandedKeys,
        selectedKeys: selectedKeys,
        switcherIcon: (0, _propsUtil.getComponentFromProp)(this, 'switcherIcon')
      }),
      ref: 'tree',
      'class': prefixCls + '-directory',
      on: (0, _extends3['default'])({}, (0, _omit2['default'])(listeners, ['update:selectedKeys']), {
        select: this.onSelect,
        click: this.onClick,
        dblclick: this.onDoubleClick,
        expand: this.onExpand
      })
    };
    return h(
      _Tree2['default'],
      treeProps,
      [this.$slots['default']]
    );
  }
};