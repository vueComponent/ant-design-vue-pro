import { getComponentFromProp } from '../_util/props-util';
import PropTypes from '../_util/vue-types';
import arrayTreeFilter from 'array-tree-filter';
import BaseMixin from '../_util/BaseMixin';

export default {
  name: 'CascaderMenus',
  mixins: [BaseMixin],
  props: {
    value: PropTypes.array.def([]),
    activeValue: PropTypes.array.def([]),
    options: PropTypes.array,
    prefixCls: PropTypes.string.def('rc-cascader-menus'),
    expandTrigger: PropTypes.string.def('click'),
    // onSelect: PropTypes.func,
    visible: PropTypes.bool.def(false),
    dropdownMenuColumnStyle: PropTypes.object,
    defaultFieldNames: PropTypes.object,
    fieldNames: PropTypes.object,
    expandIcon: PropTypes.any,
    loadingIcon: PropTypes.any
  },
  data: function data() {
    this.menuItems = {};
    return {};
  },

  watch: {
    visible: function visible(val) {
      var _this = this;

      if (val) {
        this.$nextTick(function () {
          _this.scrollActiveItemToView();
        });
      }
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.scrollActiveItemToView();
    });
  },

  methods: {
    getFieldName: function getFieldName(name) {
      var _$props = this.$props,
          fieldNames = _$props.fieldNames,
          defaultFieldNames = _$props.defaultFieldNames;
      // 防止只设置单个属性的名字

      return fieldNames[name] || defaultFieldNames[name];
    },
    getOption: function getOption(option, menuIndex) {
      var _this3 = this;

      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          expandTrigger = this.expandTrigger;

      var loadingIcon = getComponentFromProp(this, 'loadingIcon');
      var expandIcon = getComponentFromProp(this, 'expandIcon');
      var onSelect = function onSelect(e) {
        _this3.__emit('select', option, menuIndex, e);
      };
      var onItemDoubleClick = function onItemDoubleClick(e) {
        _this3.__emit('itemDoubleClick', option, menuIndex, e);
      };
      var key = option[this.getFieldName('value')];
      var expandProps = {
        attrs: {
          role: 'menuitem'
        },
        on: {
          click: onSelect,
          dblclick: onItemDoubleClick,
          mousedown: function mousedown(e) {
            return e.preventDefault();
          }
        },
        key: Array.isArray(key) ? key.join('__ant__') : key
      };
      var menuItemCls = prefixCls + '-menu-item';
      var expandIconNode = null;
      var hasChildren = option[this.getFieldName('children')] && option[this.getFieldName('children')].length > 0;
      if (hasChildren || option.isLeaf === false) {
        menuItemCls += ' ' + prefixCls + '-menu-item-expand';
        if (!option.loading) {
          expandIconNode = h(
            'span',
            { 'class': prefixCls + '-menu-item-expand-icon' },
            [expandIcon]
          );
        }
      }
      if (expandTrigger === 'hover' && (hasChildren || option.isLeaf === false)) {
        expandProps.on = {
          mouseenter: this.delayOnSelect.bind(this, onSelect),
          mouseleave: this.delayOnSelect.bind(this),
          click: onSelect
        };
      }
      if (this.isActiveOption(option, menuIndex)) {
        menuItemCls += ' ' + prefixCls + '-menu-item-active';
        expandProps.ref = this.getMenuItemRef(menuIndex);
      }
      if (option.disabled) {
        menuItemCls += ' ' + prefixCls + '-menu-item-disabled';
      }
      var loadingIconNode = null;
      if (option.loading) {
        menuItemCls += ' ' + prefixCls + '-menu-item-loading';
        loadingIconNode = loadingIcon || null;
      }
      var title = '';
      if (option.title) {
        title = option.title;
      } else if (typeof option[this.getFieldName('label')] === 'string') {
        title = option[this.getFieldName('label')];
      }
      expandProps.attrs.title = title;
      expandProps['class'] = menuItemCls;
      return h(
        'li',
        expandProps,
        [option[this.getFieldName('label')], expandIconNode, loadingIconNode]
      );
    },
    getActiveOptions: function getActiveOptions(values) {
      var _this4 = this;

      var activeValue = values || this.activeValue;
      var options = this.options;
      return arrayTreeFilter(options, function (o, level) {
        return o[_this4.getFieldName('value')] === activeValue[level];
      }, { childrenKeyName: this.getFieldName('children') });
    },
    getShowOptions: function getShowOptions() {
      var _this5 = this;

      var options = this.options;

      var result = this.getActiveOptions().map(function (activeOption) {
        return activeOption[_this5.getFieldName('children')];
      }).filter(function (activeOption) {
        return !!activeOption;
      });
      result.unshift(options);
      return result;
    },
    delayOnSelect: function delayOnSelect(onSelect) {
      var _this6 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }
      if (typeof onSelect === 'function') {
        this.delayTimer = setTimeout(function () {
          onSelect(args);
          _this6.delayTimer = null;
        }, 150);
      }
    },
    scrollActiveItemToView: function scrollActiveItemToView() {
      // scroll into view
      var optionsLength = this.getShowOptions().length;
      for (var i = 0; i < optionsLength; i++) {
        var itemComponent = this.$refs['menuItems_' + i];
        if (itemComponent) {
          var target = itemComponent;
          target.parentNode.scrollTop = target.offsetTop;
        }
      }
    },
    isActiveOption: function isActiveOption(option, menuIndex) {
      var _activeValue = this.activeValue,
          activeValue = _activeValue === undefined ? [] : _activeValue;

      return activeValue[menuIndex] === option[this.getFieldName('value')];
    },
    getMenuItemRef: function getMenuItemRef(index) {
      return 'menuItems_' + index;
    }
  },

  render: function render() {
    var _this7 = this;

    var h = arguments[0];
    var prefixCls = this.prefixCls,
        dropdownMenuColumnStyle = this.dropdownMenuColumnStyle;

    return h('div', [this.getShowOptions().map(function (options, menuIndex) {
      return h(
        'ul',
        { 'class': prefixCls + '-menu', key: menuIndex, style: dropdownMenuColumnStyle },
        [options.map(function (option) {
          return _this7.getOption(option, menuIndex);
        })]
      );
    })]);
  }
};