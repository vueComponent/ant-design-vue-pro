'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _vueTypes = require('../../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcTree = require('../../../vc-tree');

var _BaseMixin = require('../../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export const popupContextTypes = {
//   onPopupKeyDown: PropTypes.func.isRequired,
//   onTreeNodeSelect: PropTypes.func.isRequired,
//   onTreeNodeCheck: PropTypes.func.isRequired,
// }
function getDerivedState(nextProps, prevState) {
  var _ref = prevState || {},
      _ref$_prevProps = _ref._prevProps,
      prevProps = _ref$_prevProps === undefined ? {} : _ref$_prevProps,
      loadedKeys = _ref._loadedKeys,
      expandedKeyList = _ref._expandedKeyList,
      cachedExpandedKeyList = _ref._cachedExpandedKeyList;

  var valueList = nextProps.valueList,
      valueEntities = nextProps.valueEntities,
      keyEntities = nextProps.keyEntities,
      treeExpandedKeys = nextProps.treeExpandedKeys,
      filteredTreeNodes = nextProps.filteredTreeNodes,
      upperSearchValue = nextProps.upperSearchValue;


  var newState = {
    _prevProps: (0, _extends3['default'])({}, nextProps)
  };

  // Check value update
  if (valueList !== prevProps.valueList) {
    newState._keyList = valueList.map(function (_ref2) {
      var value = _ref2.value;
      return valueEntities[value];
    }).filter(function (entity) {
      return entity;
    }).map(function (_ref3) {
      var key = _ref3.key;
      return key;
    });
  }

  // Show all when tree is in filter mode
  if (!treeExpandedKeys && filteredTreeNodes && filteredTreeNodes.length && filteredTreeNodes !== prevProps.filteredTreeNodes) {
    newState._expandedKeyList = [].concat((0, _toConsumableArray3['default'])(keyEntities.keys()));
  }

  // Cache `expandedKeyList` when filter set
  if (upperSearchValue && !prevProps.upperSearchValue) {
    newState._cachedExpandedKeyList = expandedKeyList;
  } else if (!upperSearchValue && prevProps.upperSearchValue && !treeExpandedKeys) {
    newState._expandedKeyList = cachedExpandedKeyList || [];
    newState._cachedExpandedKeyList = [];
  }

  // Use expandedKeys if provided
  if (prevProps.treeExpandedKeys !== treeExpandedKeys) {
    newState._expandedKeyList = treeExpandedKeys;
  }

  // Clean loadedKeys if key not exist in keyEntities anymore
  if (nextProps.loadData) {
    newState._loadedKeys = loadedKeys.filter(function (key) {
      return keyEntities.has(key);
    });
  }

  return newState;
}
var BasePopup = {
  mixins: [_BaseMixin2['default']],
  name: 'BasePopup',
  props: {
    prefixCls: _vueTypes2['default'].string,
    upperSearchValue: _vueTypes2['default'].string,
    valueList: _vueTypes2['default'].array,
    searchHalfCheckedKeys: _vueTypes2['default'].array,
    valueEntities: _vueTypes2['default'].object,
    keyEntities: Map,
    treeIcon: _vueTypes2['default'].bool,
    treeLine: _vueTypes2['default'].bool,
    treeNodeFilterProp: _vueTypes2['default'].string,
    treeCheckable: _vueTypes2['default'].any,
    treeCheckStrictly: _vueTypes2['default'].bool,
    treeDefaultExpandAll: _vueTypes2['default'].bool,
    treeDefaultExpandedKeys: _vueTypes2['default'].array,
    treeExpandedKeys: _vueTypes2['default'].array,
    loadData: _vueTypes2['default'].func,
    multiple: _vueTypes2['default'].bool,
    // onTreeExpand: PropTypes.func,
    searchValue: _vueTypes2['default'].string,
    treeNodes: _vueTypes2['default'].any,
    filteredTreeNodes: _vueTypes2['default'].any,
    notFoundContent: _vueTypes2['default'].any,

    ariaId: _vueTypes2['default'].string,
    switcherIcon: _vueTypes2['default'].any,
    // HOC
    renderSearch: _vueTypes2['default'].func,
    // onTreeExpanded: PropTypes.func,

    __propsSymbol__: _vueTypes2['default'].any
  },
  inject: {
    vcTreeSelect: { 'default': function _default() {
        return {};
      } }
  },
  watch: {
    __propsSymbol__: function __propsSymbol__() {
      var state = getDerivedState(this.$props, this.$data);
      this.setState(state);
    }
  },
  data: function data() {
    this.treeRef = (0, _util.createRef)();
    (0, _warning2['default'])(this.$props.__propsSymbol__, 'must pass __propsSymbol__');
    var _$props = this.$props,
        treeDefaultExpandAll = _$props.treeDefaultExpandAll,
        treeDefaultExpandedKeys = _$props.treeDefaultExpandedKeys,
        keyEntities = _$props.keyEntities;

    // TODO: make `expandedKeyList` control

    var expandedKeyList = treeDefaultExpandedKeys;
    if (treeDefaultExpandAll) {
      expandedKeyList = [].concat((0, _toConsumableArray3['default'])(keyEntities.keys()));
    }

    var state = {
      _keyList: [],
      _expandedKeyList: expandedKeyList,
      // Cache `expandedKeyList` when tree is in filter. This is used in `getDerivedState`
      _cachedExpandedKeyList: [],
      _loadedKeys: [],
      _prevProps: {}
    };
    return (0, _extends3['default'])({}, state, getDerivedState(this.$props, state));
  },

  methods: {
    onTreeExpand: function onTreeExpand(expandedKeyList) {
      var _this = this;

      var treeExpandedKeys = this.$props.treeExpandedKeys;

      // Set uncontrolled state

      if (!treeExpandedKeys) {
        this.setState({ _expandedKeyList: expandedKeyList }, function () {
          _this.__emit('treeExpanded');
        });
      }
      this.__emit('update:treeExpandedKeys', expandedKeyList);
      this.__emit('treeExpand', expandedKeyList);
    },
    onLoad: function onLoad(loadedKeys) {
      this.setState({ _loadedKeys: loadedKeys });
    },
    getTree: function getTree() {
      return this.treeRef.current;
    },


    /**
     * Not pass `loadData` when searching. To avoid loop ajax call makes browser crash.
     */
    getLoadData: function getLoadData() {
      var _$props2 = this.$props,
          loadData = _$props2.loadData,
          upperSearchValue = _$props2.upperSearchValue;

      if (upperSearchValue) return null;
      return loadData;
    },


    /**
     * This method pass to Tree component which is used for add filtered class
     * in TreeNode > li
     */
    filterTreeNode: function filterTreeNode(treeNode) {
      var _$props3 = this.$props,
          upperSearchValue = _$props3.upperSearchValue,
          treeNodeFilterProp = _$props3.treeNodeFilterProp;


      var filterVal = treeNode[treeNodeFilterProp];
      if (typeof filterVal === 'string') {
        return upperSearchValue && filterVal.toUpperCase().indexOf(upperSearchValue) !== -1;
      }

      return false;
    },
    renderNotFound: function renderNotFound() {
      var h = this.$createElement;
      var _$props4 = this.$props,
          prefixCls = _$props4.prefixCls,
          notFoundContent = _$props4.notFoundContent;


      return h(
        'span',
        { 'class': prefixCls + '-not-found' },
        [notFoundContent]
      );
    }
  },

  render: function render() {
    var h = arguments[0];
    var _$data = this.$data,
        keyList = _$data._keyList,
        expandedKeyList = _$data._expandedKeyList,
        loadedKeys = _$data._loadedKeys;
    var _$props5 = this.$props,
        prefixCls = _$props5.prefixCls,
        treeNodes = _$props5.treeNodes,
        filteredTreeNodes = _$props5.filteredTreeNodes,
        treeIcon = _$props5.treeIcon,
        treeLine = _$props5.treeLine,
        treeCheckable = _$props5.treeCheckable,
        treeCheckStrictly = _$props5.treeCheckStrictly,
        multiple = _$props5.multiple,
        ariaId = _$props5.ariaId,
        renderSearch = _$props5.renderSearch,
        switcherIcon = _$props5.switcherIcon,
        searchHalfCheckedKeys = _$props5.searchHalfCheckedKeys;
    var _vcTreeSelect = this.vcTreeSelect,
        onPopupKeyDown = _vcTreeSelect.onPopupKeyDown,
        onTreeNodeSelect = _vcTreeSelect.onTreeNodeSelect,
        onTreeNodeCheck = _vcTreeSelect.onTreeNodeCheck;


    var loadData = this.getLoadData();

    var treeProps = {};

    if (treeCheckable) {
      treeProps.checkedKeys = keyList;
    } else {
      treeProps.selectedKeys = keyList;
    }
    var $notFound = void 0;
    var $treeNodes = void 0;
    if (filteredTreeNodes) {
      if (filteredTreeNodes.length) {
        treeProps.checkStrictly = true;
        $treeNodes = filteredTreeNodes;

        // Fill halfCheckedKeys
        if (treeCheckable && !treeCheckStrictly) {
          treeProps.checkedKeys = {
            checked: keyList,
            halfChecked: searchHalfCheckedKeys
          };
        }
      } else {
        $notFound = this.renderNotFound();
      }
    } else if (!treeNodes || !treeNodes.length) {
      $notFound = this.renderNotFound();
    } else {
      $treeNodes = treeNodes;
    }

    var $tree = void 0;
    if ($notFound) {
      $tree = $notFound;
    } else {
      var treeAllProps = {
        props: (0, _extends3['default'])({
          prefixCls: prefixCls + '-tree',
          showIcon: treeIcon,
          showLine: treeLine,
          selectable: !treeCheckable,
          checkable: treeCheckable,
          checkStrictly: treeCheckStrictly,
          multiple: multiple,
          loadData: loadData,
          loadedKeys: loadedKeys,
          expandedKeys: expandedKeyList,
          filterTreeNode: this.filterTreeNode,
          switcherIcon: switcherIcon
        }, treeProps, {
          __propsSymbol__: Symbol(),
          children: $treeNodes
        }),
        on: {
          select: onTreeNodeSelect,
          check: onTreeNodeCheck,
          expand: this.onTreeExpand,
          load: this.onLoad
        },
        directives: [{
          name: 'ant-ref',
          value: this.treeRef
        }]
      };
      $tree = h(_vcTree.Tree, treeAllProps);
    }

    return h(
      'div',
      {
        attrs: { role: 'listbox', id: ariaId, tabIndex: -1 },
        on: {
          'keydown': onPopupKeyDown
        }
      },
      [renderSearch ? renderSearch() : null, $tree]
    );
  }
};

exports['default'] = BasePopup;