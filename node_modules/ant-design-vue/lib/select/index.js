'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectProps = exports.SelectValue = exports.AbstractSelectProps = undefined;

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcSelect = require('../vc-select');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _propsUtil = require('../_util/props-util');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _vnode = require('../_util/vnode');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var AbstractSelectProps = function AbstractSelectProps() {
  return {
    prefixCls: _vueTypes2['default'].string,
    size: _vueTypes2['default'].oneOf(['small', 'large', 'default']),
    showAction: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].arrayOf(String)]),
    notFoundContent: _vueTypes2['default'].any,
    transitionName: _vueTypes2['default'].string,
    choiceTransitionName: _vueTypes2['default'].string,
    showSearch: _vueTypes2['default'].bool,
    allowClear: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    tabIndex: _vueTypes2['default'].number,
    placeholder: _vueTypes2['default'].any,
    defaultActiveFirstOption: _vueTypes2['default'].bool,
    dropdownClassName: _vueTypes2['default'].string,
    dropdownStyle: _vueTypes2['default'].any,
    dropdownMenuStyle: _vueTypes2['default'].any,
    dropdownMatchSelectWidth: _vueTypes2['default'].bool,
    // onSearch: (value: string) => any,
    filterOption: _vueTypes2['default'].oneOfType([_vueTypes2['default'].bool, _vueTypes2['default'].func]),
    autoFocus: _vueTypes2['default'].bool,
    backfill: _vueTypes2['default'].bool,
    showArrow: _vueTypes2['default'].bool,
    getPopupContainer: _vueTypes2['default'].func,
    open: _vueTypes2['default'].bool,
    defaultOpen: _vueTypes2['default'].bool,
    autoClearSearchValue: _vueTypes2['default'].bool,
    dropdownRender: _vueTypes2['default'].func,
    loading: _vueTypes2['default'].bool
  };
};
var Value = _vueTypes2['default'].shape({
  key: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number])
}).loose;

var SelectValue = _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number, _vueTypes2['default'].arrayOf(_vueTypes2['default'].oneOfType([Value, _vueTypes2['default'].string, _vueTypes2['default'].number])), Value]);

var SelectProps = (0, _extends3['default'])({}, AbstractSelectProps(), {
  value: SelectValue,
  defaultValue: SelectValue,
  // mode: PropTypes.oneOf(['default', 'multiple', 'tags', 'combobox']),
  mode: _vueTypes2['default'].string,
  optionLabelProp: _vueTypes2['default'].string,
  firstActiveValue: _vueTypes2['default'].oneOfType([String, _vueTypes2['default'].arrayOf(String)]),
  maxTagCount: _vueTypes2['default'].number,
  maxTagPlaceholder: _vueTypes2['default'].any,
  maxTagTextLength: _vueTypes2['default'].number,
  dropdownMatchSelectWidth: _vueTypes2['default'].bool,
  optionFilterProp: _vueTypes2['default'].string,
  labelInValue: _vueTypes2['default'].boolean,
  getPopupContainer: _vueTypes2['default'].func,
  tokenSeparators: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
  getInputElement: _vueTypes2['default'].func,
  options: _vueTypes2['default'].array,
  suffixIcon: _vueTypes2['default'].any,
  removeIcon: _vueTypes2['default'].any,
  clearIcon: _vueTypes2['default'].any,
  menuItemSelectedIcon: _vueTypes2['default'].any
});

var SelectPropTypes = {
  prefixCls: _vueTypes2['default'].string,
  size: _vueTypes2['default'].oneOf(['default', 'large', 'small']),
  // combobox: PropTypes.bool,
  notFoundContent: _vueTypes2['default'].any,
  showSearch: _vueTypes2['default'].bool,
  optionLabelProp: _vueTypes2['default'].string,
  transitionName: _vueTypes2['default'].string,
  choiceTransitionName: _vueTypes2['default'].string
};

exports.AbstractSelectProps = AbstractSelectProps;
exports.SelectValue = SelectValue;
exports.SelectProps = SelectProps;

var SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
var Select = {
  SECRET_COMBOBOX_MODE_DO_NOT_USE: SECRET_COMBOBOX_MODE_DO_NOT_USE,
  Option: (0, _extends3['default'])({}, _vcSelect.Option, { name: 'ASelectOption' }),
  OptGroup: (0, _extends3['default'])({}, _vcSelect.OptGroup, { name: 'ASelectOptGroup' }),
  name: 'ASelect',
  props: (0, _extends3['default'])({}, SelectProps, {
    showSearch: _vueTypes2['default'].bool.def(false),
    transitionName: _vueTypes2['default'].string.def('slide-up'),
    choiceTransitionName: _vueTypes2['default'].string.def('zoom')
  }),
  propTypes: SelectPropTypes,
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
      } }
  },
  created: function created() {
    (0, _warning2['default'])(this.$props.mode !== 'combobox', 'Select', 'The combobox mode of Select is deprecated,' + 'it will be removed in next major version,' + 'please use AutoComplete instead');
  },

  methods: {
    getNotFoundContent: function getNotFoundContent(renderEmpty) {
      var h = this.$createElement;
      var notFoundContent = (0, _propsUtil.getComponentFromProp)(this, 'notFoundContent');
      if (notFoundContent !== undefined) {
        return notFoundContent;
      }
      if (this.isCombobox()) {
        return null;
      }
      return renderEmpty(h, 'Select');
    },
    savePopupRef: function savePopupRef(ref) {
      this.popupRef = ref;
    },
    focus: function focus() {
      this.$refs.vcSelect.focus();
    },
    blur: function blur() {
      this.$refs.vcSelect.blur();
    },
    isCombobox: function isCombobox() {
      var mode = this.mode;

      return mode === 'combobox' || mode === SECRET_COMBOBOX_MODE_DO_NOT_USE;
    },
    renderSuffixIcon: function renderSuffixIcon(prefixCls) {
      var h = this.$createElement;
      var loading = this.$props.loading;

      var suffixIcon = (0, _propsUtil.getComponentFromProp)(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      if (suffixIcon) {
        return (0, _propsUtil.isValidElement)(suffixIcon) ? (0, _vnode.cloneElement)(suffixIcon, { 'class': prefixCls + '-arrow-icon' }) : suffixIcon;
      }
      if (loading) {
        return h(_icon2['default'], {
          attrs: { type: 'loading' }
        });
      }
      return h(_icon2['default'], {
        attrs: { type: 'down' },
        'class': prefixCls + '-arrow-icon' });
    }
  },
  render: function render() {
    var _cls;

    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        size = _getOptionProps.size,
        mode = _getOptionProps.mode,
        options = _getOptionProps.options,
        getPopupContainer = _getOptionProps.getPopupContainer,
        showArrow = _getOptionProps.showArrow,
        restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls', 'size', 'mode', 'options', 'getPopupContainer', 'showArrow']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var renderEmpty = this.configProvider.renderEmpty;
    var prefixCls = getPrefixCls('select', customizePrefixCls);

    var getContextPopupContainer = this.configProvider.getPopupContainer;

    var removeIcon = (0, _propsUtil.getComponentFromProp)(this, 'removeIcon');
    removeIcon = Array.isArray(removeIcon) ? removeIcon[0] : removeIcon;
    var clearIcon = (0, _propsUtil.getComponentFromProp)(this, 'clearIcon');
    clearIcon = Array.isArray(clearIcon) ? clearIcon[0] : clearIcon;
    var menuItemSelectedIcon = (0, _propsUtil.getComponentFromProp)(this, 'menuItemSelectedIcon');
    menuItemSelectedIcon = Array.isArray(menuItemSelectedIcon) ? menuItemSelectedIcon[0] : menuItemSelectedIcon;
    var rest = (0, _omit2['default'])(restProps, ['inputIcon', 'removeIcon', 'clearIcon', 'suffixIcon', 'menuItemSelectedIcon']);

    var cls = (_cls = {}, (0, _defineProperty3['default'])(_cls, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_cls, prefixCls + '-sm', size === 'small'), (0, _defineProperty3['default'])(_cls, prefixCls + '-show-arrow', showArrow), _cls);

    var optionLabelProp = this.$props.optionLabelProp;

    if (this.isCombobox()) {
      // children 带 dom 结构时，无法填入输入框
      optionLabelProp = optionLabelProp || 'value';
    }

    var modeConfig = {
      multiple: mode === 'multiple',
      tags: mode === 'tags',
      combobox: this.isCombobox()
    };
    var finalRemoveIcon = removeIcon && ((0, _propsUtil.isValidElement)(removeIcon) ? (0, _vnode.cloneElement)(removeIcon, { 'class': prefixCls + '-remove-icon' }) : removeIcon) || h(_icon2['default'], {
      attrs: { type: 'close' },
      'class': prefixCls + '-remove-icon' });

    var finalClearIcon = clearIcon && ((0, _propsUtil.isValidElement)(clearIcon) ? (0, _vnode.cloneElement)(clearIcon, { 'class': prefixCls + '-clear-icon' }) : clearIcon) || h(_icon2['default'], {
      attrs: { type: 'close-circle', theme: 'filled' },
      'class': prefixCls + '-clear-icon' });

    var finalMenuItemSelectedIcon = menuItemSelectedIcon && ((0, _propsUtil.isValidElement)(menuItemSelectedIcon) ? (0, _vnode.cloneElement)(menuItemSelectedIcon, { 'class': prefixCls + '-selected-icon' }) : menuItemSelectedIcon) || h(_icon2['default'], {
      attrs: { type: 'check' },
      'class': prefixCls + '-selected-icon' });

    var selectProps = {
      props: (0, _extends3['default'])({
        inputIcon: this.renderSuffixIcon(prefixCls),
        removeIcon: finalRemoveIcon,
        clearIcon: finalClearIcon,
        menuItemSelectedIcon: finalMenuItemSelectedIcon,
        showArrow: showArrow
      }, rest, modeConfig, {
        prefixCls: prefixCls,
        optionLabelProp: optionLabelProp || 'children',
        notFoundContent: this.getNotFoundContent(renderEmpty),
        maxTagPlaceholder: (0, _propsUtil.getComponentFromProp)(this, 'maxTagPlaceholder'),
        placeholder: (0, _propsUtil.getComponentFromProp)(this, 'placeholder'),
        children: options ? options.map(function (option) {
          var key = option.key,
              _option$label = option.label,
              label = _option$label === undefined ? option.title : _option$label,
              on = option.on,
              cls = option['class'],
              style = option.style,
              restOption = (0, _objectWithoutProperties3['default'])(option, ['key', 'label', 'on', 'class', 'style']);

          return h(
            _vcSelect.Option,
            (0, _babelHelperVueJsxMergeProps2['default'])([{ key: key }, { props: restOption, on: on, 'class': cls, style: style }]),
            [label]
          );
        }) : (0, _propsUtil.filterEmpty)(this.$slots['default']),
        __propsSymbol__: Symbol(),
        dropdownRender: (0, _propsUtil.getComponentFromProp)(this, 'dropdownRender', {}, false),
        getPopupContainer: getPopupContainer || getContextPopupContainer
      }),
      on: (0, _propsUtil.getListeners)(this),
      'class': cls,
      ref: 'vcSelect'
    };
    return h(_vcSelect.Select, selectProps);
  }
};

/* istanbul ignore next */
Select.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Select.name, Select);
  Vue.component(Select.Option.name, Select.Option);
  Vue.component(Select.OptGroup.name, Select.OptGroup);
};

exports['default'] = Select;