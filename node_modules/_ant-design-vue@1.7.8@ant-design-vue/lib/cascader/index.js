'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcCascader = require('../vc-cascader');

var _vcCascader2 = _interopRequireDefault(_vcCascader);

var _arrayTreeFilter = require('array-tree-filter');

var _arrayTreeFilter2 = _interopRequireDefault(_arrayTreeFilter);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _KeyCode = require('../_util/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _input = require('../input');

var _input2 = _interopRequireDefault(_input);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vnode = require('../_util/vnode');

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var CascaderOptionType = _vueTypes2['default'].shape({
  value: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
  label: _vueTypes2['default'].any,
  disabled: _vueTypes2['default'].bool,
  children: _vueTypes2['default'].array,
  key: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number])
}).loose;

var FieldNamesType = _vueTypes2['default'].shape({
  value: _vueTypes2['default'].string.isRequired,
  label: _vueTypes2['default'].string.isRequired,
  children: _vueTypes2['default'].string
}).loose;

var CascaderExpandTrigger = _vueTypes2['default'].oneOf(['click', 'hover']);

var ShowSearchType = _vueTypes2['default'].shape({
  filter: _vueTypes2['default'].func,
  render: _vueTypes2['default'].func,
  sort: _vueTypes2['default'].func,
  matchInputWidth: _vueTypes2['default'].bool,
  limit: _vueTypes2['default'].oneOfType([Boolean, Number])
}).loose;
function noop() {}

var CascaderProps = {
  /** 可选项数据源 */
  options: _vueTypes2['default'].arrayOf(CascaderOptionType).def([]),
  /** 默认的选中项 */
  defaultValue: _vueTypes2['default'].array,
  /** 指定选中项 */
  value: _vueTypes2['default'].array,
  /** 选择完成后的回调 */
  // onChange?: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
  /** 选择后展示的渲染函数 */
  displayRender: _vueTypes2['default'].func,
  transitionName: _vueTypes2['default'].string.def('slide-up'),
  popupStyle: _vueTypes2['default'].object.def(function () {
    return {};
  }),
  /** 自定义浮层类名 */
  popupClassName: _vueTypes2['default'].string,
  /** 浮层预设位置：`bottomLeft` `bottomRight` `topLeft` `topRight` */
  popupPlacement: _vueTypes2['default'].oneOf(['bottomLeft', 'bottomRight', 'topLeft', 'topRight']).def('bottomLeft'),
  /** 输入框占位文本*/
  placeholder: _vueTypes2['default'].string.def('Please select'),
  /** 输入框大小，可选 `large` `default` `small` */
  size: _vueTypes2['default'].oneOf(['large', 'default', 'small']),
  /** 禁用*/
  disabled: _vueTypes2['default'].bool.def(false),
  /** 是否支持清除*/
  allowClear: _vueTypes2['default'].bool.def(true),
  showSearch: _vueTypes2['default'].oneOfType([Boolean, ShowSearchType]),
  notFoundContent: _vueTypes2['default'].any,
  loadData: _vueTypes2['default'].func,
  /** 次级菜单的展开方式，可选 'click' 和 'hover' */
  expandTrigger: CascaderExpandTrigger,
  /** 当此项为 true 时，点选每级菜单选项值都会发生变化 */
  changeOnSelect: _vueTypes2['default'].bool,
  /** 浮层可见变化时回调 */
  // onPopupVisibleChange?: (popupVisible: boolean) => void;
  prefixCls: _vueTypes2['default'].string,
  inputPrefixCls: _vueTypes2['default'].string,
  getPopupContainer: _vueTypes2['default'].func,
  popupVisible: _vueTypes2['default'].bool,
  fieldNames: FieldNamesType,
  autoFocus: _vueTypes2['default'].bool,
  suffixIcon: _vueTypes2['default'].any
};

// We limit the filtered item count by default
var defaultLimit = 50;

function defaultFilterOption(inputValue, path, names) {
  return path.some(function (option) {
    return option[names.label].indexOf(inputValue) > -1;
  });
}

function defaultSortFilteredOption(a, b, inputValue, names) {
  function callback(elem) {
    return elem[names.label].indexOf(inputValue) > -1;
  }

  return a.findIndex(callback) - b.findIndex(callback);
}

function getFilledFieldNames(_ref) {
  var _ref$fieldNames = _ref.fieldNames,
      fieldNames = _ref$fieldNames === undefined ? {} : _ref$fieldNames;

  var names = {
    children: fieldNames.children || 'children',
    label: fieldNames.label || 'label',
    value: fieldNames.value || 'value'
  };
  return names;
}

function flattenTree() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var props = arguments[1];
  var ancestor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var names = getFilledFieldNames(props);
  var flattenOptions = [];
  var childrenName = names.children;
  options.forEach(function (option) {
    var path = ancestor.concat(option);
    if (props.changeOnSelect || !option[childrenName] || !option[childrenName].length) {
      flattenOptions.push(path);
    }
    if (option[childrenName]) {
      flattenOptions = flattenOptions.concat(flattenTree(option[childrenName], props, path));
    }
  });
  return flattenOptions;
}

var defaultDisplayRender = function defaultDisplayRender(_ref2) {
  var labels = _ref2.labels;
  return labels.join(' / ');
};

var Cascader = {
  inheritAttrs: false,
  name: 'ACascader',
  mixins: [_BaseMixin2['default']],
  props: CascaderProps,
  model: {
    prop: 'value',
    event: 'change'
  },
  provide: function provide() {
    return {
      savePopupRef: this.savePopupRef
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } },
    localeData: { 'default': function _default() {
        return {};
      } }
  },
  data: function data() {
    this.cachedOptions = [];
    var value = this.value,
        defaultValue = this.defaultValue,
        popupVisible = this.popupVisible,
        showSearch = this.showSearch,
        options = this.options;

    return {
      sValue: value || defaultValue || [],
      inputValue: '',
      inputFocused: false,
      sPopupVisible: popupVisible,
      flattenOptions: showSearch ? flattenTree(options, this.$props) : undefined
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      if (_this.autoFocus && !_this.showSearch && !_this.disabled) {
        _this.$refs.picker.focus();
      }
    });
  },

  watch: {
    value: function value(val) {
      this.setState({ sValue: val || [] });
    },
    popupVisible: function popupVisible(val) {
      this.setState({ sPopupVisible: val });
    },
    options: function options(val) {
      if (this.showSearch) {
        this.setState({ flattenOptions: flattenTree(val, this.$props) });
      }
    }
  },
  methods: {
    savePopupRef: function savePopupRef(ref) {
      this.popupRef = ref;
    },
    highlightKeyword: function highlightKeyword(str, keyword, prefixCls) {
      var h = this.$createElement;

      return str.split(keyword).map(function (node, index) {
        return index === 0 ? node : [h(
          'span',
          { 'class': prefixCls + '-menu-item-keyword' },
          [keyword]
        ), node];
      });
    },
    defaultRenderFilteredOption: function defaultRenderFilteredOption(_ref3) {
      var _this2 = this;

      var inputValue = _ref3.inputValue,
          path = _ref3.path,
          prefixCls = _ref3.prefixCls,
          names = _ref3.names;

      return path.map(function (option, index) {
        var label = option[names.label];
        var node = label.indexOf(inputValue) > -1 ? _this2.highlightKeyword(label, inputValue, prefixCls) : label;
        return index === 0 ? node : [' / ', node];
      });
    },
    handleChange: function handleChange(value, selectedOptions) {
      this.setState({ inputValue: '' });
      if (selectedOptions[0].__IS_FILTERED_OPTION) {
        var unwrappedValue = value[0];
        var unwrappedSelectedOptions = selectedOptions[0].path;
        this.setValue(unwrappedValue, unwrappedSelectedOptions);
        return;
      }
      this.setValue(value, selectedOptions);
    },
    handlePopupVisibleChange: function handlePopupVisibleChange(popupVisible) {
      if (!(0, _propsUtil.hasProp)(this, 'popupVisible')) {
        this.setState(function (state) {
          return {
            sPopupVisible: popupVisible,
            inputFocused: popupVisible,
            inputValue: popupVisible ? state.inputValue : ''
          };
        });
      }
      this.$emit('popupVisibleChange', popupVisible);
    },
    handleInputFocus: function handleInputFocus(e) {
      this.$emit('focus', e);
    },
    handleInputBlur: function handleInputBlur(e) {
      this.setState({
        inputFocused: false
      });
      this.$emit('blur', e);
    },
    handleInputClick: function handleInputClick(e) {
      var inputFocused = this.inputFocused,
          sPopupVisible = this.sPopupVisible;
      // Prevent `Trigger` behaviour.

      if (inputFocused || sPopupVisible) {
        e.stopPropagation();
        if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
          e.nativeEvent.stopImmediatePropagation();
        }
      }
    },
    handleKeyDown: function handleKeyDown(e) {
      if (e.keyCode === _KeyCode2['default'].BACKSPACE || e.keyCode === _KeyCode2['default'].SPACE) {
        e.stopPropagation();
      }
    },
    handleInputChange: function handleInputChange(e) {
      var inputValue = e.target.value;
      this.setState({ inputValue: inputValue });
      this.$emit('search', inputValue);
    },
    setValue: function setValue(value, selectedOptions) {
      if (!(0, _propsUtil.hasProp)(this, 'value')) {
        this.setState({ sValue: value });
      }
      this.$emit('change', value, selectedOptions);
    },
    getLabel: function getLabel() {
      var options = this.options,
          $scopedSlots = this.$scopedSlots;

      var names = getFilledFieldNames(this.$props);
      var displayRender = this.displayRender || $scopedSlots.displayRender || defaultDisplayRender;
      var value = this.sValue;
      var unwrappedValue = Array.isArray(value[0]) ? value[0] : value;
      var selectedOptions = (0, _arrayTreeFilter2['default'])(options, function (o, level) {
        return o[names.value] === unwrappedValue[level];
      }, { childrenKeyName: names.children });
      var labels = selectedOptions.map(function (o) {
        return o[names.label];
      });
      return displayRender({ labels: labels, selectedOptions: selectedOptions });
    },
    clearSelection: function clearSelection(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!this.inputValue) {
        this.setValue([]);
        this.handlePopupVisibleChange(false);
      } else {
        this.setState({ inputValue: '' });
      }
    },
    generateFilteredOptions: function generateFilteredOptions(prefixCls, renderEmpty) {
      var _ref5;

      var h = this.$createElement;
      var showSearch = this.showSearch,
          notFoundContent = this.notFoundContent,
          $scopedSlots = this.$scopedSlots;

      var names = getFilledFieldNames(this.$props);
      var _showSearch$filter = showSearch.filter,
          filter = _showSearch$filter === undefined ? defaultFilterOption : _showSearch$filter,
          _showSearch$sort = showSearch.sort,
          sort = _showSearch$sort === undefined ? defaultSortFilteredOption : _showSearch$sort,
          _showSearch$limit = showSearch.limit,
          limit = _showSearch$limit === undefined ? defaultLimit : _showSearch$limit;

      var render = showSearch.render || $scopedSlots.showSearchRender || this.defaultRenderFilteredOption;
      var _$data = this.$data,
          _$data$flattenOptions = _$data.flattenOptions,
          flattenOptions = _$data$flattenOptions === undefined ? [] : _$data$flattenOptions,
          inputValue = _$data.inputValue;

      // Limit the filter if needed

      var filtered = void 0;
      if (limit > 0) {
        filtered = [];
        var matchCount = 0;

        // Perf optimization to filter items only below the limit
        flattenOptions.some(function (path) {
          var match = filter(inputValue, path, names);
          if (match) {
            filtered.push(path);
            matchCount += 1;
          }
          return matchCount >= limit;
        });
      } else {
        (0, _warning2['default'])(typeof limit !== 'number', 'Cascader', "'limit' of showSearch in Cascader should be positive number or false.");
        filtered = flattenOptions.filter(function (path) {
          return filter(inputValue, path, names);
        });
      }

      filtered.sort(function (a, b) {
        return sort(a, b, inputValue, names);
      });

      if (filtered.length > 0) {
        return filtered.map(function (path) {
          var _ref4;

          return _ref4 = {
            __IS_FILTERED_OPTION: true,
            path: path
          }, (0, _defineProperty3['default'])(_ref4, names.label, render({ inputValue: inputValue, path: path, prefixCls: prefixCls, names: names })), (0, _defineProperty3['default'])(_ref4, names.value, path.map(function (o) {
            return o[names.value];
          })), (0, _defineProperty3['default'])(_ref4, 'disabled', path.some(function (o) {
            return !!o.disabled;
          })), _ref4;
        });
      }
      return [(_ref5 = {}, (0, _defineProperty3['default'])(_ref5, names.label, notFoundContent || renderEmpty(h, 'Cascader')), (0, _defineProperty3['default'])(_ref5, names.value, 'ANT_CASCADER_NOT_FOUND'), (0, _defineProperty3['default'])(_ref5, 'disabled', true), _ref5)];
    },
    focus: function focus() {
      if (this.showSearch) {
        this.$refs.input.focus();
      } else {
        this.$refs.picker.focus();
      }
    },
    blur: function blur() {
      if (this.showSearch) {
        this.$refs.input.blur();
      } else {
        this.$refs.picker.blur();
      }
    }
  },

  render: function render() {
    var _classNames, _classNames2, _classNames3;

    var h = arguments[0];
    var $slots = this.$slots,
        sPopupVisible = this.sPopupVisible,
        inputValue = this.inputValue,
        configProvider = this.configProvider,
        localeData = this.localeData;
    var _$data2 = this.$data,
        value = _$data2.sValue,
        inputFocused = _$data2.inputFocused;

    var props = (0, _propsUtil.getOptionProps)(this);
    var suffixIcon = (0, _propsUtil.getComponentFromProp)(this, 'suffixIcon');
    suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
    var getContextPopupContainer = configProvider.getPopupContainer;
    var customizePrefixCls = props.prefixCls,
        customizeInputPrefixCls = props.inputPrefixCls,
        _props$placeholder = props.placeholder,
        placeholder = _props$placeholder === undefined ? localeData.placeholder : _props$placeholder,
        size = props.size,
        disabled = props.disabled,
        allowClear = props.allowClear,
        _props$showSearch = props.showSearch,
        showSearch = _props$showSearch === undefined ? false : _props$showSearch,
        notFoundContent = props.notFoundContent,
        otherProps = (0, _objectWithoutProperties3['default'])(props, ['prefixCls', 'inputPrefixCls', 'placeholder', 'size', 'disabled', 'allowClear', 'showSearch', 'notFoundContent']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var renderEmpty = this.configProvider.renderEmpty;
    var prefixCls = getPrefixCls('cascader', customizePrefixCls);
    var inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);

    var sizeCls = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, inputPrefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_classNames, inputPrefixCls + '-sm', size === 'small'), _classNames));
    var clearIcon = allowClear && !disabled && value.length > 0 || inputValue ? h(_icon2['default'], {
      attrs: {
        type: 'close-circle',
        theme: 'filled'
      },
      'class': prefixCls + '-picker-clear',
      on: {
        'click': this.clearSelection
      },

      key: 'clear-icon'
    }) : null;
    var arrowCls = (0, _classnames2['default'])((_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, prefixCls + '-picker-arrow', true), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-picker-arrow-expand', sPopupVisible), _classNames2));
    var pickerCls = (0, _classnames2['default'])((0, _propsUtil.getClass)(this), prefixCls + '-picker', (_classNames3 = {}, (0, _defineProperty3['default'])(_classNames3, prefixCls + '-picker-with-value', inputValue), (0, _defineProperty3['default'])(_classNames3, prefixCls + '-picker-disabled', disabled), (0, _defineProperty3['default'])(_classNames3, prefixCls + '-picker-' + size, !!size), (0, _defineProperty3['default'])(_classNames3, prefixCls + '-picker-show-search', !!showSearch), (0, _defineProperty3['default'])(_classNames3, prefixCls + '-picker-focused', inputFocused), _classNames3));

    // Fix bug of https://github.com/facebook/react/pull/5004
    // and https://fb.me/react-unknown-prop
    var tempInputProps = (0, _omit2['default'])(otherProps, ['options', 'popupPlacement', 'transitionName', 'displayRender', 'changeOnSelect', 'expandTrigger', 'popupVisible', 'getPopupContainer', 'loadData', 'popupClassName', 'filterOption', 'renderFilteredOption', 'sortFilteredOption', 'notFoundContent', 'defaultValue', 'fieldNames']);

    var options = props.options;
    var names = getFilledFieldNames(this.$props);
    if (options && options.length > 0) {
      if (inputValue) {
        options = this.generateFilteredOptions(prefixCls, renderEmpty);
      }
    } else {
      var _ref6;

      options = [(_ref6 = {}, (0, _defineProperty3['default'])(_ref6, names.label, notFoundContent || renderEmpty(h, 'Cascader')), (0, _defineProperty3['default'])(_ref6, names.value, 'ANT_CASCADER_NOT_FOUND'), (0, _defineProperty3['default'])(_ref6, 'disabled', true), _ref6)];
    }

    // Dropdown menu should keep previous status until it is fully closed.
    if (!sPopupVisible) {
      options = this.cachedOptions;
    } else {
      this.cachedOptions = options;
    }

    var dropdownMenuColumnStyle = {};
    var isNotFound = (options || []).length === 1 && options[0].value === 'ANT_CASCADER_NOT_FOUND';
    if (isNotFound) {
      dropdownMenuColumnStyle.height = 'auto'; // Height of one row.
    }
    // The default value of `matchInputWidth` is `true`
    var resultListMatchInputWidth = showSearch.matchInputWidth !== false;
    if (resultListMatchInputWidth && (inputValue || isNotFound) && this.$refs.input) {
      dropdownMenuColumnStyle.width = this.$refs.input.$el.offsetWidth + 'px';
    }
    // showSearch时，focus、blur在input上触发，反之在ref='picker'上触发
    var inputProps = {
      props: (0, _extends3['default'])({}, tempInputProps, {
        prefixCls: inputPrefixCls,
        placeholder: value && value.length > 0 ? undefined : placeholder,
        value: inputValue,
        disabled: disabled,
        readOnly: !showSearch,
        autoComplete: 'off'
      }),
      'class': prefixCls + '-input ' + sizeCls,
      ref: 'input',
      on: {
        focus: showSearch ? this.handleInputFocus : noop,
        click: showSearch ? this.handleInputClick : noop,
        blur: showSearch ? this.handleInputBlur : noop,
        keydown: this.handleKeyDown,
        change: showSearch ? this.handleInputChange : noop
      },
      attrs: (0, _propsUtil.getAttrs)(this)
    };
    var children = (0, _propsUtil.filterEmpty)($slots['default']);
    var inputIcon = suffixIcon && ((0, _propsUtil.isValidElement)(suffixIcon) ? (0, _vnode.cloneElement)(suffixIcon, {
      'class': (0, _defineProperty3['default'])({}, prefixCls + '-picker-arrow', true)
    }) : h(
      'span',
      { 'class': prefixCls + '-picker-arrow' },
      [suffixIcon]
    )) || h(_icon2['default'], {
      attrs: { type: 'down' },
      'class': arrowCls });

    var input = children.length ? children : h(
      'span',
      { 'class': pickerCls, style: (0, _propsUtil.getStyle)(this), ref: 'picker' },
      [showSearch ? h(
        'span',
        { 'class': prefixCls + '-picker-label' },
        [this.getLabel()]
      ) : null, h(_input2['default'], inputProps), !showSearch ? h(
        'span',
        { 'class': prefixCls + '-picker-label' },
        [this.getLabel()]
      ) : null, clearIcon, inputIcon]
    );

    var expandIcon = h(_icon2['default'], {
      attrs: { type: 'right' }
    });

    var loadingIcon = h(
      'span',
      { 'class': prefixCls + '-menu-item-loading-icon' },
      [h(_icon2['default'], {
        attrs: { type: 'redo', spin: true }
      })]
    );
    var getPopupContainer = props.getPopupContainer || getContextPopupContainer;
    var cascaderProps = {
      props: (0, _extends3['default'])({}, props, {
        getPopupContainer: getPopupContainer,
        options: options,
        prefixCls: prefixCls,
        value: value,
        popupVisible: sPopupVisible,
        dropdownMenuColumnStyle: dropdownMenuColumnStyle,
        expandIcon: expandIcon,
        loadingIcon: loadingIcon
      }),
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
        popupVisibleChange: this.handlePopupVisibleChange,
        change: this.handleChange
      })
    };
    return h(
      _vcCascader2['default'],
      cascaderProps,
      [input]
    );
  }
};

/* istanbul ignore next */
Cascader.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Cascader.name, Cascader);
};

exports['default'] = Cascader;