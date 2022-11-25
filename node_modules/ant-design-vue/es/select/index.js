import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import warning from '../_util/warning';
import omit from 'omit.js';
import PropTypes from '../_util/vue-types';
import { Select as VcSelect, Option, OptGroup } from '../vc-select';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { getComponentFromProp, getOptionProps, filterEmpty, isValidElement, getListeners } from '../_util/props-util';
import Icon from '../icon';
import { cloneElement } from '../_util/vnode';
import Base from '../base';

var AbstractSelectProps = function AbstractSelectProps() {
  return {
    prefixCls: PropTypes.string,
    size: PropTypes.oneOf(['small', 'large', 'default']),
    showAction: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(String)]),
    notFoundContent: PropTypes.any,
    transitionName: PropTypes.string,
    choiceTransitionName: PropTypes.string,
    showSearch: PropTypes.bool,
    allowClear: PropTypes.bool,
    disabled: PropTypes.bool,
    tabIndex: PropTypes.number,
    placeholder: PropTypes.any,
    defaultActiveFirstOption: PropTypes.bool,
    dropdownClassName: PropTypes.string,
    dropdownStyle: PropTypes.any,
    dropdownMenuStyle: PropTypes.any,
    dropdownMatchSelectWidth: PropTypes.bool,
    // onSearch: (value: string) => any,
    filterOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    autoFocus: PropTypes.bool,
    backfill: PropTypes.bool,
    showArrow: PropTypes.bool,
    getPopupContainer: PropTypes.func,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    autoClearSearchValue: PropTypes.bool,
    dropdownRender: PropTypes.func,
    loading: PropTypes.bool
  };
};
var Value = PropTypes.shape({
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}).loose;

var SelectValue = PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.oneOfType([Value, PropTypes.string, PropTypes.number])), Value]);

var SelectProps = _extends({}, AbstractSelectProps(), {
  value: SelectValue,
  defaultValue: SelectValue,
  // mode: PropTypes.oneOf(['default', 'multiple', 'tags', 'combobox']),
  mode: PropTypes.string,
  optionLabelProp: PropTypes.string,
  firstActiveValue: PropTypes.oneOfType([String, PropTypes.arrayOf(String)]),
  maxTagCount: PropTypes.number,
  maxTagPlaceholder: PropTypes.any,
  maxTagTextLength: PropTypes.number,
  dropdownMatchSelectWidth: PropTypes.bool,
  optionFilterProp: PropTypes.string,
  labelInValue: PropTypes.boolean,
  getPopupContainer: PropTypes.func,
  tokenSeparators: PropTypes.arrayOf(PropTypes.string),
  getInputElement: PropTypes.func,
  options: PropTypes.array,
  suffixIcon: PropTypes.any,
  removeIcon: PropTypes.any,
  clearIcon: PropTypes.any,
  menuItemSelectedIcon: PropTypes.any
});

var SelectPropTypes = {
  prefixCls: PropTypes.string,
  size: PropTypes.oneOf(['default', 'large', 'small']),
  // combobox: PropTypes.bool,
  notFoundContent: PropTypes.any,
  showSearch: PropTypes.bool,
  optionLabelProp: PropTypes.string,
  transitionName: PropTypes.string,
  choiceTransitionName: PropTypes.string
};

export { AbstractSelectProps, SelectValue, SelectProps };
var SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
var Select = {
  SECRET_COMBOBOX_MODE_DO_NOT_USE: SECRET_COMBOBOX_MODE_DO_NOT_USE,
  Option: _extends({}, Option, { name: 'ASelectOption' }),
  OptGroup: _extends({}, OptGroup, { name: 'ASelectOptGroup' }),
  name: 'ASelect',
  props: _extends({}, SelectProps, {
    showSearch: PropTypes.bool.def(false),
    transitionName: PropTypes.string.def('slide-up'),
    choiceTransitionName: PropTypes.string.def('zoom')
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
        return ConfigConsumerProps;
      } }
  },
  created: function created() {
    warning(this.$props.mode !== 'combobox', 'Select', 'The combobox mode of Select is deprecated,' + 'it will be removed in next major version,' + 'please use AutoComplete instead');
  },

  methods: {
    getNotFoundContent: function getNotFoundContent(renderEmpty) {
      var h = this.$createElement;
      var notFoundContent = getComponentFromProp(this, 'notFoundContent');
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

      var suffixIcon = getComponentFromProp(this, 'suffixIcon');
      suffixIcon = Array.isArray(suffixIcon) ? suffixIcon[0] : suffixIcon;
      if (suffixIcon) {
        return isValidElement(suffixIcon) ? cloneElement(suffixIcon, { 'class': prefixCls + '-arrow-icon' }) : suffixIcon;
      }
      if (loading) {
        return h(Icon, {
          attrs: { type: 'loading' }
        });
      }
      return h(Icon, {
        attrs: { type: 'down' },
        'class': prefixCls + '-arrow-icon' });
    }
  },
  render: function render() {
    var _cls;

    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        size = _getOptionProps.size,
        mode = _getOptionProps.mode,
        options = _getOptionProps.options,
        getPopupContainer = _getOptionProps.getPopupContainer,
        showArrow = _getOptionProps.showArrow,
        restProps = _objectWithoutProperties(_getOptionProps, ['prefixCls', 'size', 'mode', 'options', 'getPopupContainer', 'showArrow']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var renderEmpty = this.configProvider.renderEmpty;
    var prefixCls = getPrefixCls('select', customizePrefixCls);

    var getContextPopupContainer = this.configProvider.getPopupContainer;

    var removeIcon = getComponentFromProp(this, 'removeIcon');
    removeIcon = Array.isArray(removeIcon) ? removeIcon[0] : removeIcon;
    var clearIcon = getComponentFromProp(this, 'clearIcon');
    clearIcon = Array.isArray(clearIcon) ? clearIcon[0] : clearIcon;
    var menuItemSelectedIcon = getComponentFromProp(this, 'menuItemSelectedIcon');
    menuItemSelectedIcon = Array.isArray(menuItemSelectedIcon) ? menuItemSelectedIcon[0] : menuItemSelectedIcon;
    var rest = omit(restProps, ['inputIcon', 'removeIcon', 'clearIcon', 'suffixIcon', 'menuItemSelectedIcon']);

    var cls = (_cls = {}, _defineProperty(_cls, prefixCls + '-lg', size === 'large'), _defineProperty(_cls, prefixCls + '-sm', size === 'small'), _defineProperty(_cls, prefixCls + '-show-arrow', showArrow), _cls);

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
    var finalRemoveIcon = removeIcon && (isValidElement(removeIcon) ? cloneElement(removeIcon, { 'class': prefixCls + '-remove-icon' }) : removeIcon) || h(Icon, {
      attrs: { type: 'close' },
      'class': prefixCls + '-remove-icon' });

    var finalClearIcon = clearIcon && (isValidElement(clearIcon) ? cloneElement(clearIcon, { 'class': prefixCls + '-clear-icon' }) : clearIcon) || h(Icon, {
      attrs: { type: 'close-circle', theme: 'filled' },
      'class': prefixCls + '-clear-icon' });

    var finalMenuItemSelectedIcon = menuItemSelectedIcon && (isValidElement(menuItemSelectedIcon) ? cloneElement(menuItemSelectedIcon, { 'class': prefixCls + '-selected-icon' }) : menuItemSelectedIcon) || h(Icon, {
      attrs: { type: 'check' },
      'class': prefixCls + '-selected-icon' });

    var selectProps = {
      props: _extends({
        inputIcon: this.renderSuffixIcon(prefixCls),
        removeIcon: finalRemoveIcon,
        clearIcon: finalClearIcon,
        menuItemSelectedIcon: finalMenuItemSelectedIcon,
        showArrow: showArrow
      }, rest, modeConfig, {
        prefixCls: prefixCls,
        optionLabelProp: optionLabelProp || 'children',
        notFoundContent: this.getNotFoundContent(renderEmpty),
        maxTagPlaceholder: getComponentFromProp(this, 'maxTagPlaceholder'),
        placeholder: getComponentFromProp(this, 'placeholder'),
        children: options ? options.map(function (option) {
          var key = option.key,
              _option$label = option.label,
              label = _option$label === undefined ? option.title : _option$label,
              on = option.on,
              cls = option['class'],
              style = option.style,
              restOption = _objectWithoutProperties(option, ['key', 'label', 'on', 'class', 'style']);

          return h(
            Option,
            _mergeJSXProps([{ key: key }, { props: restOption, on: on, 'class': cls, style: style }]),
            [label]
          );
        }) : filterEmpty(this.$slots['default']),
        __propsSymbol__: Symbol(),
        dropdownRender: getComponentFromProp(this, 'dropdownRender', {}, false),
        getPopupContainer: getPopupContainer || getContextPopupContainer
      }),
      on: getListeners(this),
      'class': cls,
      ref: 'vcSelect'
    };
    return h(VcSelect, selectProps);
  }
};

/* istanbul ignore next */
Select.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Select.name, Select);
  Vue.component(Select.Option.name, Select.Option);
  Vue.component(Select.OptGroup.name, Select.OptGroup);
};

export default Select;