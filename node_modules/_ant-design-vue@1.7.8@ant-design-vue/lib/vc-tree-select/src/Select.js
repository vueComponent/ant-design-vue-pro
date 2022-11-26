'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _domScrollIntoView = require('dom-scroll-into-view');

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _KeyCode = require('../../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _SelectTrigger = require('./SelectTrigger');

var _SelectTrigger2 = _interopRequireDefault(_SelectTrigger);

var _SingleSelector = require('./Selector/SingleSelector');

var _SingleSelector2 = _interopRequireDefault(_SingleSelector);

var _MultipleSelector = require('./Selector/MultipleSelector');

var _MultipleSelector2 = _interopRequireDefault(_MultipleSelector);

var _SinglePopup = require('./Popup/SinglePopup');

var _SinglePopup2 = _interopRequireDefault(_SinglePopup);

var _MultiplePopup = require('./Popup/MultiplePopup');

var _MultiplePopup2 = _interopRequireDefault(_MultiplePopup);

var _strategies = require('./strategies');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _util = require('./util');

var _SelectNode = require('./SelectNode');

var _SelectNode2 = _interopRequireDefault(_SelectNode);

var _propsUtil = require('../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * ARIA: https://www.w3.org/TR/wai-aria/#combobox
 * Sample 1: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/combobox/aria1.1pattern/listbox-combo.html
 * Sample 2: https://www.w3.org/blog/wai-components-gallery/widget/combobox-with-aria-autocompleteinline/
 *
 * Tab logic:
 * Popup is close
 * 1. Focus input (mark component as focused)
 * 2. Press enter to show the popup
 * 3. If popup has input, focus it
 *
 * Popup is open
 * 1. press tab to close the popup
 * 2. Focus back to the selection input box
 * 3. Let the native tab going on
 *
 * TreeSelect use 2 design type.
 * In single mode, we should focus on the `span`
 * In multiple mode, we should focus on the `input`
 */

function getWatch() {
  var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var watch = {};
  keys.forEach(function (k) {
    watch[k] = function () {
      this.needSyncKeys[k] = true;
    };
  });
  return watch;
}
var Select = {
  name: 'Select',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)({
    prefixCls: _vueTypes2['default'].string,
    prefixAria: _vueTypes2['default'].string,
    multiple: _vueTypes2['default'].bool,
    showArrow: _vueTypes2['default'].bool,
    open: _vueTypes2['default'].bool,
    value: _vueTypes2['default'].any,

    autoFocus: _vueTypes2['default'].bool,

    defaultOpen: _vueTypes2['default'].bool,
    defaultValue: _vueTypes2['default'].any,

    showSearch: _vueTypes2['default'].bool,
    placeholder: _vueTypes2['default'].any,
    inputValue: _vueTypes2['default'].string, // [Legacy] Deprecated. Use `searchValue` instead.
    searchValue: _vueTypes2['default'].string,
    autoClearSearchValue: _vueTypes2['default'].bool,
    searchPlaceholder: _vueTypes2['default'].any, // [Legacy] Confuse with placeholder
    disabled: _vueTypes2['default'].bool,
    children: _vueTypes2['default'].any,
    labelInValue: _vueTypes2['default'].bool,
    maxTagCount: _vueTypes2['default'].number,
    maxTagPlaceholder: _vueTypes2['default'].oneOfType([_vueTypes2['default'].any, _vueTypes2['default'].func]),
    maxTagTextLength: _vueTypes2['default'].number,
    showCheckedStrategy: _vueTypes2['default'].oneOf([_strategies.SHOW_ALL, _strategies.SHOW_PARENT, _strategies.SHOW_CHILD]),
    dropdownClassName: _vueTypes2['default'].string,
    dropdownStyle: _vueTypes2['default'].object,
    dropdownVisibleChange: _vueTypes2['default'].func,
    dropdownMatchSelectWidth: _vueTypes2['default'].bool,
    treeData: _vueTypes2['default'].array,
    treeDataSimpleMode: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].object]),
    treeNodeFilterProp: _vueTypes2['default'].string,
    treeNodeLabelProp: _vueTypes2['default'].string,
    treeCheckable: _vueTypes2['default'].oneOfType([_vueTypes2['default'].any, _vueTypes2['default'].object, _vueTypes2['default'].bool]),
    // treeCheckable: PropTypes.any,
    treeCheckStrictly: _vueTypes2['default'].bool,
    treeIcon: _vueTypes2['default'].bool,
    treeLine: _vueTypes2['default'].bool,
    treeDefaultExpandAll: _vueTypes2['default'].bool,
    treeDefaultExpandedKeys: _vueTypes2['default'].array,
    treeExpandedKeys: _vueTypes2['default'].array,
    loadData: _vueTypes2['default'].func,
    filterTreeNode: _vueTypes2['default'].oneOfType([_vueTypes2['default'].func, _vueTypes2['default'].bool]),

    notFoundContent: _vueTypes2['default'].any,
    getPopupContainer: _vueTypes2['default'].func,

    // onSearch: PropTypes.func,
    // onSelect: PropTypes.func,
    // onDeselect: PropTypes.func,
    // onChange: PropTypes.func,
    // onDropdownVisibleChange: PropTypes.func,

    // onTreeExpand: PropTypes.func,
    allowClear: _vueTypes2['default'].bool,
    transitionName: _vueTypes2['default'].string,
    animation: _vueTypes2['default'].string,
    choiceTransitionName: _vueTypes2['default'].string,
    inputIcon: _vueTypes2['default'].any,
    clearIcon: _vueTypes2['default'].any,
    removeIcon: _vueTypes2['default'].any,
    switcherIcon: _vueTypes2['default'].any,
    __propsSymbol__: _vueTypes2['default'].any
  }, {
    prefixCls: 'rc-tree-select',
    prefixAria: 'rc-tree-select',
    showSearch: true,
    autoClearSearchValue: true,
    showCheckedStrategy: _strategies.SHOW_CHILD,

    // dropdownMatchSelectWidth change the origin design, set to false now
    // ref: https://github.com/react-component/select/blob/4cad95e098a341a09de239ad6981067188842020/src/Select.jsx#L344
    // ref: https://github.com/react-component/select/pull/71
    treeNodeFilterProp: 'value',
    treeNodeLabelProp: 'title',
    treeIcon: false,
    notFoundContent: 'Not Found',
    dropdownStyle: {},
    dropdownVisibleChange: function dropdownVisibleChange() {
      return true;
    }
  }),

  data: function data() {
    (0, _warning2['default'])(this.$props.__propsSymbol__, 'must pass __propsSymbol__');
    var _$props = this.$props,
        prefixAria = _$props.prefixAria,
        defaultOpen = _$props.defaultOpen,
        open = _$props.open;

    this.needSyncKeys = {};
    this.selectorRef = (0, _util.createRef)();
    this.selectTriggerRef = (0, _util.createRef)();

    // ARIA need `aria-controls` props mapping
    // Since this need user input. Let's generate ourselves
    this.ariaId = (0, _util.generateAriaId)(prefixAria + '-list');

    var state = {
      _open: open || defaultOpen,
      _valueList: [],
      _searchHalfCheckedKeys: [],
      _missValueList: [], // Contains the value not in the tree
      _selectorValueList: [], // Used for multiple selector
      _valueEntities: {},
      _posEntities: new Map(),
      _keyEntities: new Map(),
      _searchValue: '',
      _prevProps: {},
      _init: true,
      _focused: undefined,
      _treeNodes: undefined,
      _filteredTreeNodes: undefined
    };
    var newState = this.getDerivedState(this.$props, state);
    return (0, _extends3['default'])({}, state, newState);
  },
  provide: function provide() {
    return {
      vcTreeSelect: {
        onSelectorFocus: this.onSelectorFocus,
        onSelectorBlur: this.onSelectorBlur,
        onSelectorKeyDown: this.onComponentKeyDown,
        onSelectorClear: this.onSelectorClear,
        onMultipleSelectorRemove: this.onMultipleSelectorRemove,

        onTreeNodeSelect: this.onTreeNodeSelect,
        onTreeNodeCheck: this.onTreeNodeCheck,
        onPopupKeyDown: this.onComponentKeyDown,

        onSearchInputChange: this.onSearchInputChange,
        onSearchInputKeyDown: this.onSearchInputKeyDown
      }
    };
  },

  watch: (0, _extends3['default'])({}, getWatch(['treeData', 'defaultValue', 'value']), {
    __propsSymbol__: function __propsSymbol__() {
      var state = this.getDerivedState(this.$props, this.$data);
      this.setState(state);
      this.needSyncKeys = {};
    },
    '$data._valueList': function $data_valueList() {
      var _this = this;

      this.$nextTick(function () {
        _this.forcePopupAlign();
      });
    },
    '$data._open': function $data_open(open) {
      var _this2 = this;

      setTimeout(function () {
        var prefixCls = _this2.$props.prefixCls;
        var _$data = _this2.$data,
            selectorValueList = _$data._selectorValueList,
            valueEntities = _$data._valueEntities;

        var isMultiple = _this2.isMultiple();

        // Scroll to value position, only need sync on single mode
        if (!isMultiple && selectorValueList.length && open && _this2.popup) {
          var value = selectorValueList[0].value;

          var _popup$getTree = _this2.popup.getTree(),
              domTreeNodes = _popup$getTree.domTreeNodes;

          var _ref = valueEntities[value] || {},
              key = _ref.key;

          var treeNode = domTreeNodes[key];

          if (treeNode) {
            var domNode = treeNode.$el;
            (0, _raf2['default'])(function () {
              var popupNode = _this2.popup.$el;
              var triggerContainer = (0, _util.findPopupContainer)(popupNode, prefixCls + '-dropdown');
              var searchNode = _this2.popup.searchRef.current;

              if (domNode && triggerContainer && searchNode) {
                (0, _domScrollIntoView2['default'])(domNode, triggerContainer, {
                  onlyScrollIfNeeded: true,
                  offsetTop: searchNode.offsetHeight
                });
              }
            });
          }
        }
      });
    }
  }),
  mounted: function mounted() {
    var _this3 = this;

    this.$nextTick(function () {
      var _$props2 = _this3.$props,
          autoFocus = _$props2.autoFocus,
          disabled = _$props2.disabled;

      if (autoFocus && !disabled) {
        _this3.focus();
      }
    });
  },


  methods: {
    getDerivedState: function getDerivedState(nextProps, prevState) {
      var h = this.$createElement;
      var _prevState$_prevProps = prevState._prevProps,
          prevProps = _prevState$_prevProps === undefined ? {} : _prevState$_prevProps;
      var treeCheckable = nextProps.treeCheckable,
          treeCheckStrictly = nextProps.treeCheckStrictly,
          filterTreeNode = nextProps.filterTreeNode,
          treeNodeFilterProp = nextProps.treeNodeFilterProp,
          treeDataSimpleMode = nextProps.treeDataSimpleMode;

      var newState = {
        _prevProps: (0, _extends3['default'])({}, nextProps),
        _init: false
      };
      var self = this;
      // Process the state when props updated
      function processState(propName, updater) {
        if (prevProps[propName] !== nextProps[propName] || self.needSyncKeys[propName]) {
          updater(nextProps[propName], prevProps[propName]);
          return true;
        }
        return false;
      }

      var valueRefresh = false;

      // Open
      processState('open', function (propValue) {
        newState._open = propValue;
      });

      // Tree Nodes
      var treeNodes = void 0;
      var treeDataChanged = false;
      var treeDataModeChanged = false;
      processState('treeData', function (propValue) {
        treeNodes = (0, _util.convertDataToTree)(h, propValue);
        treeDataChanged = true;
      });

      processState('treeDataSimpleMode', function (propValue, prevValue) {
        if (!propValue) return;

        var prev = !prevValue || prevValue === true ? {} : prevValue;

        // Shallow equal to avoid dynamic prop object
        if (!(0, _shallowequal2['default'])(propValue, prev)) {
          treeDataModeChanged = true;
        }
      });

      // Parse by `treeDataSimpleMode`
      if (treeDataSimpleMode && (treeDataChanged || treeDataModeChanged)) {
        var simpleMapper = (0, _extends3['default'])({
          id: 'id',
          pId: 'pId',
          rootPId: null
        }, treeDataSimpleMode !== true ? treeDataSimpleMode : {});
        treeNodes = (0, _util.convertDataToTree)(h, (0, _util.parseSimpleTreeData)(nextProps.treeData, simpleMapper));
      }

      // If `treeData` not provide, use children TreeNodes
      if (!nextProps.treeData) {
        // processState('children', (propValue) => {
        //   treeNodes = Array.isArray(propValue) ? propValue : [propValue]
        // })
        treeNodes = (0, _propsUtil.filterEmpty)(this.$slots['default']);
      }

      // Convert `treeData` to entities
      if (treeNodes) {
        var entitiesMap = (0, _util.convertTreeToEntities)(treeNodes);
        newState._treeNodes = treeNodes;
        newState._posEntities = entitiesMap.posEntities;
        newState._valueEntities = entitiesMap.valueEntities;
        newState._keyEntities = entitiesMap.keyEntities;

        valueRefresh = true;
      }

      // Value List
      if (prevState._init) {
        processState('defaultValue', function (propValue) {
          newState._valueList = (0, _util.formatInternalValue)(propValue, nextProps);
          valueRefresh = true;
        });
      }

      processState('value', function (propValue) {
        newState._valueList = (0, _util.formatInternalValue)(propValue, nextProps);
        valueRefresh = true;
      });

      // Selector Value List
      if (valueRefresh) {
        // Find out that value not exist in the tree
        var missValueList = [];
        var filteredValueList = [];
        var keyList = [];

        // Get latest value list
        var latestValueList = newState._valueList;
        if (!latestValueList) {
          // Also need add prev missValueList to avoid new treeNodes contains the value
          latestValueList = [].concat((0, _toConsumableArray3['default'])(prevState._valueList), (0, _toConsumableArray3['default'])(prevState._missValueList));
        }

        // Get key by value
        var valueLabels = {};
        latestValueList.forEach(function (wrapperValue) {
          var value = wrapperValue.value,
              label = wrapperValue.label;

          var entity = (newState._valueEntities || prevState._valueEntities)[value];
          valueLabels[value] = label;

          if (entity) {
            keyList.push(entity.key);
            filteredValueList.push(wrapperValue);
            return;
          }

          // If not match, it may caused by ajax load. We need keep this
          missValueList.push(wrapperValue);
        });

        // We need calculate the value when tree is checked tree
        if (treeCheckable && !treeCheckStrictly) {
          // Calculate the keys need to be checked
          var _conductCheck = (0, _util.conductCheck)(keyList, true, newState._keyEntities || prevState._keyEntities),
              checkedKeys = _conductCheck.checkedKeys;

          // Format value list again for internal usage


          newState._valueList = checkedKeys.map(function (key) {
            var val = (newState._keyEntities || prevState._keyEntities).get(key).value;

            var wrappedValue = {
              value: val
            };

            if (valueLabels[val] !== undefined) {
              wrappedValue.label = valueLabels[val];
            }

            return wrappedValue;
          });
        } else {
          newState._valueList = filteredValueList;
        }

        // Fill the missValueList, we still need display in the selector
        newState._missValueList = missValueList;

        // Calculate the value list for `Selector` usage
        newState._selectorValueList = (0, _util.formatSelectorValue)(newState._valueList, nextProps, newState._valueEntities || prevState._valueEntities);
      }

      // [Legacy] To align with `Select` component,
      // We use `searchValue` instead of `inputValue` but still keep the api
      // `inputValue` support `null` to work as `autoClearSearchValue`
      processState('inputValue', function (propValue) {
        if (propValue !== null) {
          newState._searchValue = propValue;
        }
      });

      // Search value
      processState('searchValue', function (propValue) {
        newState._searchValue = propValue;
      });

      // Do the search logic
      if (newState._searchValue !== undefined || prevState._searchValue && treeNodes) {
        var searchValue = newState._searchValue !== undefined ? newState._searchValue : prevState._searchValue;
        var upperSearchValue = String(searchValue).toUpperCase();

        var filterTreeNodeFn = filterTreeNode;
        if (filterTreeNode === false) {
          // Don't filter if is false
          filterTreeNodeFn = function filterTreeNodeFn() {
            return true;
          };
        } else if (typeof filterTreeNodeFn !== 'function') {
          // When is not function (true or undefined), use inner filter
          filterTreeNodeFn = function filterTreeNodeFn(_, node) {
            var nodeValue = String((0, _propsUtil.getPropsData)(node)[treeNodeFilterProp]).toUpperCase();
            return nodeValue.indexOf(upperSearchValue) !== -1;
          };
        }

        newState._filteredTreeNodes = (0, _util.getFilterTree)(this.$createElement, newState._treeNodes || prevState._treeNodes, searchValue, filterTreeNodeFn, newState._valueEntities || prevState._valueEntities, _SelectNode2['default']);
      }

      // We should re-calculate the halfCheckedKeys when in search mode
      if (valueRefresh && treeCheckable && !treeCheckStrictly && (newState._searchValue || prevState._searchValue)) {
        newState._searchHalfCheckedKeys = (0, _util.getHalfCheckedKeys)(newState._valueList, newState._valueEntities || prevState._valueEntities);
      }

      // Checked Strategy
      processState('showCheckedStrategy', function () {
        newState._selectorValueList = newState._selectorValueList || (0, _util.formatSelectorValue)(newState._valueList || prevState._valueList, nextProps, newState._valueEntities || prevState._valueEntities);
      });

      return newState;
    },

    // ==================== Selector ====================
    onSelectorFocus: function onSelectorFocus() {
      this.setState({ _focused: true });
    },
    onSelectorBlur: function onSelectorBlur() {
      this.setState({ _focused: false });

      // TODO: Close when Popup is also not focused
      // this.setState({ open: false });
    },


    // Handle key board event in both Selector and Popup
    onComponentKeyDown: function onComponentKeyDown(event) {
      var open = this.$data._open;
      var keyCode = event.keyCode;


      if (!open) {
        if ([_KeyCode2['default'].ENTER, _KeyCode2['default'].DOWN].indexOf(keyCode) !== -1) {
          this.setOpenState(true);
        }
      } else if (_KeyCode2['default'].ESC === keyCode) {
        this.setOpenState(false);
      } else if ([_KeyCode2['default'].UP, _KeyCode2['default'].DOWN, _KeyCode2['default'].LEFT, _KeyCode2['default'].RIGHT].indexOf(keyCode) !== -1) {
        // TODO: Handle `open` state
        event.stopPropagation();
      }
    },
    onDeselect: function onDeselect(wrappedValue, node, nodeEventInfo) {
      this.__emit('deselect', wrappedValue, node, nodeEventInfo);
    },
    onSelectorClear: function onSelectorClear(event) {
      var disabled = this.$props.disabled;

      if (disabled) return;

      this.triggerChange([], []);

      if (!this.isSearchValueControlled()) {
        this.setUncontrolledState({
          _searchValue: '',
          _filteredTreeNodes: null
        });
      }

      event.stopPropagation();
    },
    onMultipleSelectorRemove: function onMultipleSelectorRemove(event, removeValue) {
      event.stopPropagation();

      var _$data2 = this.$data,
          valueList = _$data2._valueList,
          missValueList = _$data2._missValueList,
          valueEntities = _$data2._valueEntities;
      var _$props3 = this.$props,
          treeCheckable = _$props3.treeCheckable,
          treeCheckStrictly = _$props3.treeCheckStrictly,
          treeNodeLabelProp = _$props3.treeNodeLabelProp,
          disabled = _$props3.disabled;

      if (disabled) return;

      // Find trigger entity
      var triggerEntity = valueEntities[removeValue];

      // Clean up value
      var newValueList = valueList;
      if (triggerEntity) {
        // If value is in tree
        if (treeCheckable && !treeCheckStrictly) {
          newValueList = valueList.filter(function (_ref2) {
            var value = _ref2.value;

            var entity = valueEntities[value];
            return !(0, _util.isPosRelated)(entity.pos, triggerEntity.pos);
          });
        } else {
          newValueList = valueList.filter(function (_ref3) {
            var value = _ref3.value;
            return value !== removeValue;
          });
        }
      }

      var triggerNode = triggerEntity ? triggerEntity.node : null;

      var extraInfo = {
        triggerValue: removeValue,
        triggerNode: triggerNode
      };
      var deselectInfo = {
        node: triggerNode
      };

      // [Legacy] Little hack on this to make same action as `onCheck` event.
      if (treeCheckable) {
        var filteredEntityList = newValueList.map(function (_ref4) {
          var value = _ref4.value;
          return valueEntities[value];
        });

        deselectInfo.event = 'check';
        deselectInfo.checked = false;
        deselectInfo.checkedNodes = filteredEntityList.map(function (_ref5) {
          var node = _ref5.node;
          return node;
        });
        deselectInfo.checkedNodesPositions = filteredEntityList.map(function (_ref6) {
          var node = _ref6.node,
              pos = _ref6.pos;
          return {
            node: node,
            pos: pos
          };
        });

        if (treeCheckStrictly) {
          extraInfo.allCheckedNodes = deselectInfo.checkedNodes;
        } else {
          // TODO: It's too expansive to get `halfCheckedKeys` in onDeselect. Not pass this.
          extraInfo.allCheckedNodes = (0, _util.flatToHierarchy)(filteredEntityList).map(function (_ref7) {
            var node = _ref7.node;
            return node;
          });
        }
      } else {
        deselectInfo.event = 'select';
        deselectInfo.selected = false;
        deselectInfo.selectedNodes = newValueList.map(function (_ref8) {
          var value = _ref8.value;
          return (valueEntities[value] || {}).node;
        });
      }

      // Some value user pass prop is not in the tree, we also need clean it
      var newMissValueList = missValueList.filter(function (_ref9) {
        var value = _ref9.value;
        return value !== removeValue;
      });
      var wrappedValue = void 0;
      if (this.isLabelInValue()) {
        wrappedValue = {
          label: triggerNode ? (0, _propsUtil.getPropsData)(triggerNode)[treeNodeLabelProp] : null,
          value: removeValue
        };
      } else {
        wrappedValue = removeValue;
      }

      this.onDeselect(wrappedValue, triggerNode, deselectInfo);

      this.triggerChange(newMissValueList, newValueList, extraInfo);
    },


    // ===================== Popup ======================
    onValueTrigger: function onValueTrigger(isAdd, nodeList, nodeEventInfo, nodeExtraInfo) {
      var node = nodeEventInfo.node;
      var value = node.$props.value;
      var _$data3 = this.$data,
          missValueList = _$data3._missValueList,
          valueEntities = _$data3._valueEntities,
          keyEntities = _$data3._keyEntities,
          searchValue = _$data3._searchValue;
      var _$props4 = this.$props,
          disabled = _$props4.disabled,
          inputValue = _$props4.inputValue,
          treeNodeLabelProp = _$props4.treeNodeLabelProp,
          multiple = _$props4.multiple,
          treeCheckable = _$props4.treeCheckable,
          treeCheckStrictly = _$props4.treeCheckStrictly,
          autoClearSearchValue = _$props4.autoClearSearchValue;

      var label = node.$props[treeNodeLabelProp];

      if (disabled) return;

      // Wrap the return value for user
      var wrappedValue = void 0;
      if (this.isLabelInValue()) {
        wrappedValue = {
          value: value,
          label: label
        };
      } else {
        wrappedValue = value;
      }

      // [Legacy] Origin code not trigger `onDeselect` every time. Let's align the behaviour.
      if (isAdd) {
        this.__emit('select', wrappedValue, node, nodeEventInfo);
      } else {
        this.__emit('deselect', wrappedValue, node, nodeEventInfo);
      }

      // Get wrapped value list.
      // This is a bit hack cause we use key to match the value.
      var newValueList = nodeList.map(function (node) {
        var props = (0, _propsUtil.getPropsData)(node);
        return {
          value: props.value,
          label: props[treeNodeLabelProp]
        };
      });

      // When is `treeCheckable` and with `searchValue`, `valueList` is not full filled.
      // We need calculate the missing nodes.
      if (treeCheckable && !treeCheckStrictly) {
        var keyList = newValueList.map(function (_ref10) {
          var val = _ref10.value;
          return valueEntities[val].key;
        });
        if (isAdd) {
          keyList = (0, _util.conductCheck)(keyList, true, keyEntities).checkedKeys;
        } else {
          keyList = (0, _util.conductCheck)([valueEntities[value].key], false, keyEntities, {
            checkedKeys: keyList
          }).checkedKeys;
        }
        newValueList = keyList.map(function (key) {
          var props = (0, _propsUtil.getPropsData)(keyEntities.get(key).node);
          return {
            value: props.value,
            label: props[treeNodeLabelProp]
          };
        });
      }

      // Clean up `searchValue` when this prop is set
      if (autoClearSearchValue || inputValue === null) {
        // Clean state `searchValue` if uncontrolled
        if (!this.isSearchValueControlled() && (multiple || treeCheckable)) {
          this.setUncontrolledState({
            _searchValue: '',
            _filteredTreeNodes: null
          });
        }

        // Trigger onSearch if `searchValue` to be empty.
        // We should also trigger onSearch with empty string here
        // since if user use `treeExpandedKeys`, it need user have the ability to reset it.
        if (searchValue && searchValue.length) {
          this.__emit('update:searchValue', '');
          this.__emit('search', '');
        }
      }

      // [Legacy] Provide extra info
      var extraInfo = (0, _extends3['default'])({}, nodeExtraInfo, {
        triggerValue: value,
        triggerNode: node
      });

      this.triggerChange(missValueList, newValueList, extraInfo);
    },
    onTreeNodeSelect: function onTreeNodeSelect(_, nodeEventInfo) {
      var _$data4 = this.$data,
          valueList = _$data4._valueList,
          valueEntities = _$data4._valueEntities;
      var _$props5 = this.$props,
          treeCheckable = _$props5.treeCheckable,
          multiple = _$props5.multiple;

      if (treeCheckable) return;

      if (!multiple) {
        this.setOpenState(false);
      }

      var isAdd = nodeEventInfo.selected;
      var selectedValue = nodeEventInfo.node.$props.value;


      var newValueList = void 0;

      if (!multiple) {
        newValueList = [{ value: selectedValue }];
      } else {
        newValueList = valueList.filter(function (_ref11) {
          var value = _ref11.value;
          return value !== selectedValue;
        });
        if (isAdd) {
          newValueList.push({ value: selectedValue });
        }
      }

      var selectedNodes = newValueList.map(function (_ref12) {
        var value = _ref12.value;
        return valueEntities[value];
      }).filter(function (entity) {
        return entity;
      }).map(function (_ref13) {
        var node = _ref13.node;
        return node;
      });

      this.onValueTrigger(isAdd, selectedNodes, nodeEventInfo, { selected: isAdd });
    },
    onTreeNodeCheck: function onTreeNodeCheck(_, nodeEventInfo) {
      var _$data5 = this.$data,
          searchValue = _$data5._searchValue,
          keyEntities = _$data5._keyEntities,
          valueEntities = _$data5._valueEntities,
          valueList = _$data5._valueList;
      var treeCheckStrictly = this.$props.treeCheckStrictly;
      var checkedNodes = nodeEventInfo.checkedNodes,
          checkedNodesPositions = nodeEventInfo.checkedNodesPositions;

      var isAdd = nodeEventInfo.checked;

      var extraInfo = {
        checked: isAdd
      };

      var checkedNodeList = checkedNodes;

      // [Legacy] Check event provide `allCheckedNodes`.
      // When `treeCheckStrictly` or internal `searchValue` is set, TreeNode will be unrelated:
      // - Related: Show the top checked nodes and has children prop.
      // - Unrelated: Show all the checked nodes.
      if (searchValue) {
        var oriKeyList = valueList.map(function (_ref14) {
          var value = _ref14.value;
          return valueEntities[value];
        }).filter(function (entity) {
          return entity;
        }).map(function (_ref15) {
          var key = _ref15.key;
          return key;
        });

        var keyList = void 0;
        if (isAdd) {
          keyList = Array.from(new Set([].concat((0, _toConsumableArray3['default'])(oriKeyList), (0, _toConsumableArray3['default'])(checkedNodeList.map(function (node) {
            var _getPropsData = (0, _propsUtil.getPropsData)(node),
                value = _getPropsData.value;

            return valueEntities[value].key;
          })))));
        } else {
          keyList = (0, _util.conductCheck)([(0, _propsUtil.getPropsData)(nodeEventInfo.node).eventKey], false, keyEntities, {
            checkedKeys: oriKeyList
          }).checkedKeys;
        }

        checkedNodeList = keyList.map(function (key) {
          return keyEntities.get(key).node;
        });

        // Let's follow as not `treeCheckStrictly` format
        extraInfo.allCheckedNodes = keyList.map(function (key) {
          return (0, _util.cleanEntity)(keyEntities.get(key));
        });
      } else if (treeCheckStrictly) {
        extraInfo.allCheckedNodes = nodeEventInfo.checkedNodes;
      } else {
        extraInfo.allCheckedNodes = (0, _util.flatToHierarchy)(checkedNodesPositions);
      }

      this.onValueTrigger(isAdd, checkedNodeList, nodeEventInfo, extraInfo);
    },


    // ==================== Trigger =====================

    onDropdownVisibleChange: function onDropdownVisibleChange(open) {
      var _$props6 = this.$props,
          multiple = _$props6.multiple,
          treeCheckable = _$props6.treeCheckable;
      var _searchValue = this.$data._searchValue;

      // When set open success and single mode,
      // we will reset the input content.

      if (open && !multiple && !treeCheckable && _searchValue) {
        this.setUncontrolledState({
          _searchValue: '',
          _filteredTreeNodes: null
        });
      }
      this.setOpenState(open, true);
    },
    onSearchInputChange: function onSearchInputChange(event) {
      var value = event.target.value;
      var _$data6 = this.$data,
          treeNodes = _$data6._treeNodes,
          valueEntities = _$data6._valueEntities;
      var _$props7 = this.$props,
          filterTreeNode = _$props7.filterTreeNode,
          treeNodeFilterProp = _$props7.treeNodeFilterProp;

      this.__emit('update:searchValue', value);
      this.__emit('search', value);

      var isSet = false;

      if (!this.isSearchValueControlled()) {
        isSet = this.setUncontrolledState({
          _searchValue: value
        });
        this.setOpenState(true);
      }

      if (isSet) {
        // Do the search logic
        var upperSearchValue = String(value).toUpperCase();

        var filterTreeNodeFn = filterTreeNode;
        if (filterTreeNode === false) {
          filterTreeNodeFn = function filterTreeNodeFn() {
            return true;
          };
        } else if (!filterTreeNodeFn) {
          filterTreeNodeFn = function filterTreeNodeFn(_, node) {
            var nodeValue = String((0, _propsUtil.getPropsData)(node)[treeNodeFilterProp]).toUpperCase();
            return nodeValue.indexOf(upperSearchValue) !== -1;
          };
        }

        this.setState({
          _filteredTreeNodes: (0, _util.getFilterTree)(this.$createElement, treeNodes, value, filterTreeNodeFn, valueEntities, _SelectNode2['default'])
        });
      }
    },
    onSearchInputKeyDown: function onSearchInputKeyDown(event) {
      var _$data7 = this.$data,
          searchValue = _$data7._searchValue,
          valueList = _$data7._valueList;
      var keyCode = event.keyCode;


      if (_KeyCode2['default'].BACKSPACE === keyCode && this.isMultiple() && !searchValue && valueList.length) {
        var lastValue = valueList[valueList.length - 1].value;
        this.onMultipleSelectorRemove(event, lastValue);
      }
    },
    onChoiceAnimationLeave: function onChoiceAnimationLeave() {
      var _this4 = this;

      (0, _raf2['default'])(function () {
        _this4.forcePopupAlign();
      });
    },
    setPopupRef: function setPopupRef(popup) {
      this.popup = popup;
    },


    /**
     * Only update the value which is not in props
     */
    setUncontrolledState: function setUncontrolledState(state) {
      var needSync = false;
      var newState = {};
      var props = (0, _propsUtil.getOptionProps)(this);
      Object.keys(state).forEach(function (name) {
        if (name.slice(1) in props) return;

        needSync = true;
        newState[name] = state[name];
      });

      if (needSync) {
        this.setState(newState);
      }

      return needSync;
    },


    // [Legacy] Origin provide `documentClickClose` which triggered by `Trigger`
    // Currently `TreeSelect` align the hide popup logic as `Select` which blur to hide.
    // `documentClickClose` is not accurate anymore. Let's just keep the key word.
    setOpenState: function setOpenState(open) {
      var byTrigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var dropdownVisibleChange = this.$props.dropdownVisibleChange;


      if (dropdownVisibleChange && dropdownVisibleChange(open, { documentClickClose: !open && byTrigger }) === false) {
        return;
      }

      this.setUncontrolledState({ _open: open });
    },


    // Tree checkable is also a multiple case
    isMultiple: function isMultiple() {
      var _$props8 = this.$props,
          multiple = _$props8.multiple,
          treeCheckable = _$props8.treeCheckable;

      return !!(multiple || treeCheckable);
    },
    isLabelInValue: function isLabelInValue() {
      return (0, _util.isLabelInValue)(this.$props);
    },


    // [Legacy] To align with `Select` component,
    // We use `searchValue` instead of `inputValue`
    // but currently still need support that.
    // Add this method the check if is controlled
    isSearchValueControlled: function isSearchValueControlled() {
      var props = (0, _propsUtil.getOptionProps)(this);
      var inputValue = props.inputValue;

      if ('searchValue' in props) return true;
      return 'inputValue' in props && inputValue !== null;
    },
    forcePopupAlign: function forcePopupAlign() {
      var $trigger = this.selectTriggerRef.current;
      if ($trigger) {
        $trigger.forcePopupAlign();
      }
    },
    delayForcePopupAlign: function delayForcePopupAlign() {
      var _this5 = this;

      // Wait 2 frame to avoid dom update & dom algin in the same time
      // https://github.com/ant-design/ant-design/issues/12031
      (0, _raf2['default'])(function () {
        (0, _raf2['default'])(_this5.forcePopupAlign);
      });
    },


    /**
     * 1. Update state valueList.
     * 2. Fire `onChange` event to user.
     */
    triggerChange: function triggerChange(missValueList, valueList) {
      var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _$data8 = this.$data,
          valueEntities = _$data8._valueEntities,
          searchValue = _$data8._searchValue,
          prevSelectorValueList = _$data8._selectorValueList;

      var props = (0, _propsUtil.getOptionProps)(this);
      var disabled = props.disabled,
          treeCheckable = props.treeCheckable,
          treeCheckStrictly = props.treeCheckStrictly;

      if (disabled) return;

      // Trigger
      var extra = (0, _extends3['default'])({
        // [Legacy] Always return as array contains label & value
        preValue: prevSelectorValueList.map(function (_ref16) {
          var label = _ref16.label,
              value = _ref16.value;
          return { label: label, value: value };
        })
      }, extraInfo);

      // Format value by `treeCheckStrictly`
      var selectorValueList = (0, _util.formatSelectorValue)(valueList, props, valueEntities);

      if (!('value' in props)) {
        var newState = {
          _missValueList: missValueList,
          _valueList: valueList,
          _selectorValueList: selectorValueList
        };

        if (searchValue && treeCheckable && !treeCheckStrictly) {
          newState._searchHalfCheckedKeys = (0, _util.getHalfCheckedKeys)(valueList, valueEntities);
        }

        this.setState(newState);
      }

      // Only do the logic when `onChange` function provided
      if ((0, _propsUtil.getListeners)(this).change) {
        var connectValueList = void 0;

        // Get value by mode
        if (this.isMultiple()) {
          connectValueList = [].concat((0, _toConsumableArray3['default'])(missValueList), (0, _toConsumableArray3['default'])(selectorValueList));
        } else {
          connectValueList = selectorValueList.slice(0, 1);
        }

        var labelList = null;
        var returnValue = void 0;

        if (this.isLabelInValue()) {
          returnValue = connectValueList.map(function (_ref17) {
            var label = _ref17.label,
                value = _ref17.value;
            return { label: label, value: value };
          });
        } else {
          labelList = [];
          returnValue = connectValueList.map(function (_ref18) {
            var label = _ref18.label,
                value = _ref18.value;

            labelList.push(label);
            return value;
          });
        }

        if (!this.isMultiple()) {
          returnValue = returnValue[0];
        }
        this.__emit('change', returnValue, labelList, extra);
      }
    },
    focus: function focus() {
      this.selectorRef.current.focus();
    },
    blur: function blur() {
      this.selectorRef.current.blur();
    }
  },

  // ===================== Render =====================

  render: function render() {
    var h = arguments[0];
    var _$data9 = this.$data,
        valueList = _$data9._valueList,
        missValueList = _$data9._missValueList,
        selectorValueList = _$data9._selectorValueList,
        searchHalfCheckedKeys = _$data9._searchHalfCheckedKeys,
        valueEntities = _$data9._valueEntities,
        keyEntities = _$data9._keyEntities,
        searchValue = _$data9._searchValue,
        open = _$data9._open,
        focused = _$data9._focused,
        treeNodes = _$data9._treeNodes,
        filteredTreeNodes = _$data9._filteredTreeNodes;

    var props = (0, _propsUtil.getOptionProps)(this);
    var prefixCls = props.prefixCls,
        treeExpandedKeys = props.treeExpandedKeys;

    var isMultiple = this.isMultiple();

    var passProps = {
      props: (0, _extends3['default'])({}, props, {
        isMultiple: isMultiple,
        valueList: valueList,
        searchHalfCheckedKeys: searchHalfCheckedKeys,
        selectorValueList: [].concat((0, _toConsumableArray3['default'])(missValueList), (0, _toConsumableArray3['default'])(selectorValueList)),
        valueEntities: valueEntities,
        keyEntities: keyEntities,
        searchValue: searchValue,
        upperSearchValue: (searchValue || '').toUpperCase(), // Perf save
        open: open,
        focused: focused,
        dropdownPrefixCls: prefixCls + '-dropdown',
        ariaId: this.ariaId
      }),
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
        choiceAnimationLeave: this.onChoiceAnimationLeave
      }),
      scopedSlots: this.$scopedSlots
    };
    var popupProps = (0, _propsUtil.mergeProps)(passProps, {
      props: {
        treeNodes: treeNodes,
        filteredTreeNodes: filteredTreeNodes,
        // Tree expanded control
        treeExpandedKeys: treeExpandedKeys,
        __propsSymbol__: Symbol()
      },
      on: {
        treeExpanded: this.delayForcePopupAlign
      },
      directives: [{
        name: 'ant-ref',
        value: this.setPopupRef
      }]
    });

    var Popup = isMultiple ? _MultiplePopup2['default'] : _SinglePopup2['default'];
    var $popup = h(Popup, popupProps);

    var Selector = isMultiple ? _MultipleSelector2['default'] : _SingleSelector2['default'];
    var $selector = h(Selector, (0, _babelHelperVueJsxMergeProps2['default'])([passProps, {
      directives: [{
        name: 'ant-ref',
        value: this.selectorRef
      }]
    }]));
    var selectTriggerProps = (0, _propsUtil.mergeProps)(passProps, {
      props: {
        popupElement: $popup,
        dropdownVisibleChange: this.onDropdownVisibleChange
      },
      directives: [{
        name: 'ant-ref',
        value: this.selectTriggerRef
      }]
    });
    return h(
      _SelectTrigger2['default'],
      selectTriggerProps,
      [$selector]
    );
  }
};

Select.TreeNode = _SelectNode2['default'];
Select.SHOW_ALL = _strategies.SHOW_ALL;
Select.SHOW_PARENT = _strategies.SHOW_PARENT;
Select.SHOW_CHILD = _strategies.SHOW_CHILD;

// Let warning show correct component name
Select.name = 'TreeSelect';

exports['default'] = Select;