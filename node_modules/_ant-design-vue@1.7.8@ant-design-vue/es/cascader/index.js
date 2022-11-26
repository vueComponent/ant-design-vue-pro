import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import VcCascader from '../vc-cascader';
import arrayTreeFilter from 'array-tree-filter';
import classNames from 'classnames';
import omit from 'omit.js';
import KeyCode from '../_util/KeyCode';
import Input from '../input';
import Icon from '../icon';
import { hasProp, filterEmpty, getOptionProps, getStyle, getClass, getAttrs, getComponentFromProp, isValidElement, getListeners } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import { cloneElement } from '../_util/vnode';
import warning from '../_util/warning';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';

var CascaderOptionType = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.any,
  disabled: PropTypes.bool,
  children: PropTypes.array,
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}).loose;

var FieldNamesType = PropTypes.shape({
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.string
}).loose;

var CascaderExpandTrigger = PropTypes.oneOf(['click', 'hover']);

var ShowSearchType = PropTypes.shape({
  filter: PropTypes.func,
  render: PropTypes.func,
  sort: PropTypes.func,
  matchInputWidth: PropTypes.bool,
  limit: PropTypes.oneOfType([Boolean, Number])
}).loose;
function noop() {}

var CascaderProps = {
  /** 可选项数据源 */
  options: PropTypes.arrayOf(CascaderOptionType).def([]),
  /** 默认的选中项 */
  defaultValue: PropTypes.array,
  /** 指定选中项 */
  value: PropTypes.array,
  /** 选择完成后的回调 */
  // onChange?: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
  /** 选择后展示的渲染函数 */
  displayRender: PropTypes.func,
  transitionName: PropTypes.string.def('slide-up'),
  popupStyle: PropTypes.object.def(function () {
    return {};
  }),
  /** 自定义浮层类名 */
  popupClassName: PropTypes.string,
  /** 浮层预设位置：`bottomLeft` `bottomRight` `topLeft` `topRight` */
  popupPlacement: PropTypes.oneOf(['bottomLeft', 'bottomRight', 'topLeft', 'topRight']).def('bottomLeft'),
  /** 输入框占位文本*/
  placeholder: PropTypes.string.def('Please select'),
  /** 输入框大小，可选 `large` `default` `small` */
  size: PropTypes.oneOf(['large', 'default', 'small']),
  /** 禁用*/
  disabled: PropTypes.bool.def(false),
  /** 是否支持清除*/
  allowClear: PropTypes.bool.def(true),
  showSearch: PropTypes.oneOfType([Boolean, ShowSearchType]),
  notFoundContent: PropTypes.any,
  loadData: PropTypes.func,
  /** 次级菜单的展开方式，可选 'click' 和 'hover' */
  expandTrigger: CascaderExpandTrigger,
  /** 当此项为 true 时，点选每级菜单选项值都会发生变化 */
  changeOnSelect: PropTypes.bool,
  /** 浮层可见变化时回调 */
  // onPopupVisibleChange?: (popupVisible: boolean) => void;
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  getPopupContainer: PropTypes.func,
  popupVisible: PropTypes.bool,
  fieldNames: FieldNamesType,
  autoFocus: PropTypes.bool,
  suffixIcon: PropTypes.any
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
  mixins: [BaseMixin],
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
        return ConfigConsumerProps;
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
      if (!hasProp(this, 'popupVisible')) {
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
      if (e.keyCode === KeyCode.BACKSPACE || e.keyCode === KeyCode.SPACE) {
        e.stopPropagation();
      }
    },
    handleInputChange: function handleInputChange(e) {
      var inputValue = e.target.value;
      this.setState({ inputValue: inputValue });
      this.$emit('search', inputValue);
    },
    setValue: function setValue(value, selectedOptions) {
      if (!hasProp(this, 'value')) {
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
      var selectedOptions = arrayTreeFilter(options, function (o, level) {
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
        warning(typeof limit !== 'number', 'Cascader', "'limit' of showSearch in Cascader should be positive number or false.");
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
          }, _defineProperty(_ref4, names.label, render({ inputValue: inputValue, path: path, prefixCls: prefixCls, names: names })), _defineProperty(_ref4, names.value, path.map(function (o) {
            return o[names.value];
          })), _defineProperty(_ref4, 'disabled', path.some(function (o) {
            return !!o.disabled;
          })), _ref4;
        });
      }
      return [(_ref5 = {}, _defineProperty(_ref5, names.label, notFoundContent || renderEmpty(h, 'Cascader')), _defineProperty(_ref5, names.value, 'ANT_CASCADER_NOT_FOUND'), _defineProperty(_ref5, 'disabled', true), _ref5)];
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

    var props = getOptionProps(this);
    var suffixIcon = getComponentFromProp(this, 'suffixIcon');
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
        otherProps = _objectWithoutProperties(props, ['prefixCls', 'inputPrefixCls', 'placeholder', 'size', 'disabled', 'allowClear', 'showSearch', 'notFoundContent']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var renderEmpty = this.configProvider.renderEmpty;
    var prefixCls = getPrefixCls('cascader', customizePrefixCls);
    var inputPrefixCls = getPrefixCls('input', customizeInputPrefixCls);

    var sizeCls = classNames((_classNames = {}, _defineProperty(_classNames, inputPrefixCls + '-lg', size === 'large'), _defineProperty(_classNames, inputPrefixCls + '-sm', size === 'small'), _classNames));
    var clearIcon = allowClear && !disabled && value.length > 0 || inputValue ? h(Icon, {
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
    var arrowCls = classNames((_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-picker-arrow', true), _defineProperty(_classNames2, prefixCls + '-picker-arrow-expand', sPopupVisible), _classNames2));
    var pickerCls = classNames(getClass(this), prefixCls + '-picker', (_classNames3 = {}, _defineProperty(_classNames3, prefixCls + '-picker-with-value', inputValue), _defineProperty(_classNames3, prefixCls + '-picker-disabled', disabled), _defineProperty(_classNames3, prefixCls + '-picker-' + size, !!size), _defineProperty(_classNames3, prefixCls + '-picker-show-search', !!showSearch), _defineProperty(_classNames3, prefixCls + '-picker-focused', inputFocused), _classNames3));

    // Fix bug of https://github.com/facebook/react/pull/5004
    // and https://fb.me/react-unknown-prop
    var tempInputProps = omit(otherProps, ['options', 'popupPlacement', 'transitionName', 'displayRender', 'changeOnSelect', 'expandTrigger', 'popupVisible', 'getPopupContainer', 'loadData', 'popupClassName', 'filterOption', 'renderFilteredOption', 'sortFilteredOption', 'notFoundContent', 'defaultValue', 'fieldNames']);

    var options = props.options;
    var names = getFilledFieldNames(this.$props);
    if (options && options.length > 0) {
      if (inputValue) {
        options = this.generateFilteredOptions(prefixCls, renderEmpty);
      }
    } else {
      var _ref6;

      options = [(_ref6 = {}, _defineProperty(_ref6, names.label, notFoundContent || renderEmpty(h, 'Cascader')), _defineProperty(_ref6, names.value, 'ANT_CASCADER_NOT_FOUND'), _defineProperty(_ref6, 'disabled', true), _ref6)];
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
      props: _extends({}, tempInputProps, {
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
      attrs: getAttrs(this)
    };
    var children = filterEmpty($slots['default']);
    var inputIcon = suffixIcon && (isValidElement(suffixIcon) ? cloneElement(suffixIcon, {
      'class': _defineProperty({}, prefixCls + '-picker-arrow', true)
    }) : h(
      'span',
      { 'class': prefixCls + '-picker-arrow' },
      [suffixIcon]
    )) || h(Icon, {
      attrs: { type: 'down' },
      'class': arrowCls });

    var input = children.length ? children : h(
      'span',
      { 'class': pickerCls, style: getStyle(this), ref: 'picker' },
      [showSearch ? h(
        'span',
        { 'class': prefixCls + '-picker-label' },
        [this.getLabel()]
      ) : null, h(Input, inputProps), !showSearch ? h(
        'span',
        { 'class': prefixCls + '-picker-label' },
        [this.getLabel()]
      ) : null, clearIcon, inputIcon]
    );

    var expandIcon = h(Icon, {
      attrs: { type: 'right' }
    });

    var loadingIcon = h(
      'span',
      { 'class': prefixCls + '-menu-item-loading-icon' },
      [h(Icon, {
        attrs: { type: 'redo', spin: true }
      })]
    );
    var getPopupContainer = props.getPopupContainer || getContextPopupContainer;
    var cascaderProps = {
      props: _extends({}, props, {
        getPopupContainer: getPopupContainer,
        options: options,
        prefixCls: prefixCls,
        value: value,
        popupVisible: sPopupVisible,
        dropdownMenuColumnStyle: dropdownMenuColumnStyle,
        expandIcon: expandIcon,
        loadingIcon: loadingIcon
      }),
      on: _extends({}, getListeners(this), {
        popupVisibleChange: this.handlePopupVisibleChange,
        change: this.handleChange
      })
    };
    return h(
      VcCascader,
      cascaderProps,
      [input]
    );
  }
};

/* istanbul ignore next */
Cascader.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Cascader.name, Cascader);
};

export default Cascader;