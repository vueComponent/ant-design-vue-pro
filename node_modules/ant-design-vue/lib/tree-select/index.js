'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeSelectProps = exports.TreeData = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _interface = require('./interface');

Object.defineProperty(exports, 'TreeData', {
  enumerable: true,
  get: function get() {
    return _interface.TreeData;
  }
});
Object.defineProperty(exports, 'TreeSelectProps', {
  enumerable: true,
  get: function get() {
    return _interface.TreeSelectProps;
  }
});

var _vcTreeSelect = require('../vc-tree-select');

var _vcTreeSelect2 = _interopRequireDefault(_vcTreeSelect);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TreeSelect = {
  TreeNode: (0, _extends3['default'])({}, _vcTreeSelect.TreeNode, { name: 'ATreeSelectNode' }),
  SHOW_ALL: _vcTreeSelect.SHOW_ALL,
  SHOW_PARENT: _vcTreeSelect.SHOW_PARENT,
  SHOW_CHILD: _vcTreeSelect.SHOW_CHILD,
  name: 'ATreeSelect',
  props: (0, _propsUtil.initDefaultProps)((0, _interface.TreeSelectProps)(), {
    transitionName: 'slide-up',
    choiceTransitionName: 'zoom',
    showSearch: false
  }),
  model: {
    prop: 'value',
    event: 'change'
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  created: function created() {
    (0, _warning2['default'])(this.multiple !== false || !this.treeCheckable, 'TreeSelect', '`multiple` will alway be `true` when `treeCheckable` is true');
  },

  methods: {
    focus: function focus() {
      this.$refs.vcTreeSelect.focus();
    },
    blur: function blur() {
      this.$refs.vcTreeSelect.blur();
    },
    renderSwitcherIcon: function renderSwitcherIcon(prefixCls, _ref) {
      var isLeaf = _ref.isLeaf,
          loading = _ref.loading;
      var h = this.$createElement;

      if (loading) {
        return h(_icon2['default'], {
          attrs: { type: 'loading' },
          'class': prefixCls + '-switcher-loading-icon' });
      }
      if (isLeaf) {
        return null;
      }
      return h(_icon2['default'], {
        attrs: { type: 'caret-down' },
        'class': prefixCls + '-switcher-icon' });
    },
    onChange: function onChange() {
      this.$emit.apply(this, ['change'].concat(Array.prototype.slice.call(arguments)));
    },
    updateTreeData: function updateTreeData(treeData) {
      var _this = this;

      var $scopedSlots = this.$scopedSlots;

      var defaultFields = {
        children: 'children',
        title: 'title',
        key: 'key',
        label: 'label',
        value: 'value'
      };
      var replaceFields = (0, _extends3['default'])({}, defaultFields, this.$props.replaceFields);
      return treeData.map(function (item) {
        var _item$scopedSlots = item.scopedSlots,
            scopedSlots = _item$scopedSlots === undefined ? {} : _item$scopedSlots;

        var label = item[replaceFields.label];
        var title = item[replaceFields.title];
        var value = item[replaceFields.value];
        var key = item[replaceFields.key];
        var children = item[replaceFields.children];
        var newLabel = typeof label === 'function' ? label(_this.$createElement) : label;
        var newTitle = typeof title === 'function' ? title(_this.$createElement) : title;
        if (!newLabel && scopedSlots.label && $scopedSlots[scopedSlots.label]) {
          newLabel = $scopedSlots[scopedSlots.label](item);
        }
        if (!newTitle && scopedSlots.title && $scopedSlots[scopedSlots.title]) {
          newTitle = $scopedSlots[scopedSlots.title](item);
        }
        var treeNodeProps = (0, _extends3['default'])({}, item, {
          title: newTitle || newLabel,
          value: value,
          dataRef: item,
          key: key
        });
        if (children) {
          return (0, _extends3['default'])({}, treeNodeProps, { children: _this.updateTreeData(children) });
        }
        return treeNodeProps;
      });
    }
  },

  render: function render(h) {
    var _cls,
        _this2 = this;

    var props = (0, _propsUtil.getOptionProps)(this);
    var customizePrefixCls = props.prefixCls,
        size = props.size,
        dropdownStyle = props.dropdownStyle,
        dropdownClassName = props.dropdownClassName,
        getPopupContainer = props.getPopupContainer,
        restProps = (0, _objectWithoutProperties3['default'])(props, ['prefixCls', 'size', 'dropdownStyle', 'dropdownClassName', 'getPopupContainer']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('select', customizePrefixCls);

    var renderEmpty = this.configProvider.renderEmpty;
    var notFoundContent = (0, _propsUtil.getComponentFromProp)(this, 'notFoundContent');
    var removeIcon = (0, _propsUtil.getComponentFromProp)(this, 'removeIcon');
    var clearIcon = (0, _propsUtil.getComponentFromProp)(this, 'clearIcon');
    var getContextPopupContainer = this.configProvider.getPopupContainer;

    var rest = (0, _omit2['default'])(restProps, ['inputIcon', 'removeIcon', 'clearIcon', 'switcherIcon', 'suffixIcon']);
    var suffixIcon = (0, _propsUtil.getComponentFromProp)(this, 'suffixIcon');
    suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
    var treeData = props.treeData;
    if (treeData) {
      treeData = this.updateTreeData(treeData);
    }
    var cls = (_cls = {}, (0, _defineProperty3['default'])(_cls, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_cls, prefixCls + '-sm', size === 'small'), _cls);

    // showSearch: single - false, multiple - true
    var showSearch = restProps.showSearch;

    if (!('showSearch' in restProps)) {
      showSearch = !!(restProps.multiple || restProps.treeCheckable);
    }

    var checkable = (0, _propsUtil.getComponentFromProp)(this, 'treeCheckable');
    if (checkable) {
      checkable = h('span', { 'class': prefixCls + '-tree-checkbox-inner' });
    }

    var inputIcon = suffixIcon || h(_icon2['default'], {
      attrs: { type: 'down' },
      'class': prefixCls + '-arrow-icon' });

    var finalRemoveIcon = removeIcon || h(_icon2['default'], {
      attrs: { type: 'close' },
      'class': prefixCls + '-remove-icon' });

    var finalClearIcon = clearIcon || h(_icon2['default'], {
      attrs: { type: 'close-circle', theme: 'filled' },
      'class': prefixCls + '-clear-icon' });
    var VcTreeSelectProps = {
      props: (0, _extends3['default'])((0, _extends3['default'])({
        switcherIcon: function switcherIcon(nodeProps) {
          return _this2.renderSwitcherIcon(prefixCls, nodeProps);
        },
        inputIcon: inputIcon,
        removeIcon: finalRemoveIcon,
        clearIcon: finalClearIcon
      }, rest, {
        showSearch: showSearch,
        getPopupContainer: getPopupContainer || getContextPopupContainer,
        dropdownClassName: (0, _classnames2['default'])(dropdownClassName, prefixCls + '-tree-dropdown'),
        prefixCls: prefixCls,
        dropdownStyle: (0, _extends3['default'])({ maxHeight: '100vh', overflow: 'auto' }, dropdownStyle),
        treeCheckable: checkable,
        notFoundContent: notFoundContent || renderEmpty(h, 'Select'),
        __propsSymbol__: Symbol()
      }), treeData ? { treeData: treeData } : {}),
      'class': cls,
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), { change: this.onChange }),
      ref: 'vcTreeSelect',
      scopedSlots: this.$scopedSlots
    };
    return h(
      _vcTreeSelect2['default'],
      VcTreeSelectProps,
      [(0, _propsUtil.filterEmpty)(this.$slots['default'])]
    );
  }
};

/* istanbul ignore next */
TreeSelect.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(TreeSelect.name, TreeSelect);
  Vue.component(TreeSelect.TreeNode.name, TreeSelect.TreeNode);
};

exports['default'] = TreeSelect;