import _defineProperty from 'babel-runtime/helpers/defineProperty';
import classNames from 'classnames';
import Icon from '../icon';
import { getInputClassName } from './Input';
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import { getComponentFromProp } from '../_util/props-util';

export function hasPrefixSuffix(instance) {
  return !!(getComponentFromProp(instance, 'prefix') || getComponentFromProp(instance, 'suffix') || instance.$props.allowClear);
}

var ClearableInputType = ['text', 'input'];

var ClearableLabeledInput = {
  props: {
    prefixCls: PropTypes.string,
    inputType: PropTypes.oneOf(ClearableInputType),
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    allowClear: PropTypes.bool,
    element: PropTypes.any,
    handleReset: PropTypes.func,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'large', 'default']),
    suffix: PropTypes.any,
    prefix: PropTypes.any,
    addonBefore: PropTypes.any,
    addonAfter: PropTypes.any,
    className: PropTypes.string,
    readOnly: PropTypes.bool
  },
  methods: {
    renderClearIcon: function renderClearIcon(prefixCls) {
      var h = this.$createElement;
      var _$props = this.$props,
          allowClear = _$props.allowClear,
          value = _$props.value,
          disabled = _$props.disabled,
          readOnly = _$props.readOnly,
          inputType = _$props.inputType,
          handleReset = _$props.handleReset;

      if (!allowClear || disabled || readOnly || value === undefined || value === null || value === '') {
        return null;
      }
      var className = inputType === ClearableInputType[0] ? prefixCls + '-textarea-clear-icon' : prefixCls + '-clear-icon';
      return h(Icon, {
        attrs: {
          type: 'close-circle',
          theme: 'filled',

          role: 'button'
        },
        on: {
          'click': handleReset
        },

        'class': className });
    },
    renderSuffix: function renderSuffix(prefixCls) {
      var h = this.$createElement;
      var _$props2 = this.$props,
          suffix = _$props2.suffix,
          allowClear = _$props2.allowClear;

      if (suffix || allowClear) {
        return h(
          'span',
          { 'class': prefixCls + '-suffix' },
          [this.renderClearIcon(prefixCls), suffix]
        );
      }
      return null;
    },
    renderLabeledIcon: function renderLabeledIcon(prefixCls, element) {
      var _classNames;

      var h = this.$createElement;

      var props = this.$props;
      var suffix = this.renderSuffix(prefixCls);
      if (!hasPrefixSuffix(this)) {
        return cloneElement(element, {
          props: { value: props.value }
        });
      }

      var prefix = props.prefix ? h(
        'span',
        { 'class': prefixCls + '-prefix' },
        [props.prefix]
      ) : null;

      var affixWrapperCls = classNames(props.className, prefixCls + '-affix-wrapper', (_classNames = {}, _defineProperty(_classNames, prefixCls + '-affix-wrapper-sm', props.size === 'small'), _defineProperty(_classNames, prefixCls + '-affix-wrapper-lg', props.size === 'large'), _defineProperty(_classNames, prefixCls + '-affix-wrapper-input-with-clear-btn', props.suffix && props.allowClear && this.$props.value), _classNames));

      return h(
        'span',
        { 'class': affixWrapperCls, style: props.style },
        [prefix, cloneElement(element, {
          style: null,
          props: { value: props.value },
          'class': getInputClassName(prefixCls, props.size, props.disabled)
        }), suffix]
      );
    },
    renderInputWithLabel: function renderInputWithLabel(prefixCls, labeledElement) {
      var _classNames3;

      var h = this.$createElement;
      var _$props3 = this.$props,
          addonBefore = _$props3.addonBefore,
          addonAfter = _$props3.addonAfter,
          style = _$props3.style,
          size = _$props3.size,
          className = _$props3.className;
      // Not wrap when there is not addons

      if (!addonBefore && !addonAfter) {
        return labeledElement;
      }

      var wrapperClassName = prefixCls + '-group';
      var addonClassName = wrapperClassName + '-addon';
      var addonBeforeNode = addonBefore ? h(
        'span',
        { 'class': addonClassName },
        [addonBefore]
      ) : null;
      var addonAfterNode = addonAfter ? h(
        'span',
        { 'class': addonClassName },
        [addonAfter]
      ) : null;

      var mergedWrapperClassName = classNames(prefixCls + '-wrapper', _defineProperty({}, wrapperClassName, addonBefore || addonAfter));

      var mergedGroupClassName = classNames(className, prefixCls + '-group-wrapper', (_classNames3 = {}, _defineProperty(_classNames3, prefixCls + '-group-wrapper-sm', size === 'small'), _defineProperty(_classNames3, prefixCls + '-group-wrapper-lg', size === 'large'), _classNames3));

      // Need another wrapper for changing display:table to display:inline-block
      // and put style prop in wrapper
      return h(
        'span',
        { 'class': mergedGroupClassName, style: style },
        [h(
          'span',
          { 'class': mergedWrapperClassName },
          [addonBeforeNode, cloneElement(labeledElement, { style: null }), addonAfterNode]
        )]
      );
    },
    renderTextAreaWithClearIcon: function renderTextAreaWithClearIcon(prefixCls, element) {
      var h = this.$createElement;
      var _$props4 = this.$props,
          value = _$props4.value,
          allowClear = _$props4.allowClear,
          className = _$props4.className,
          style = _$props4.style;

      if (!allowClear) {
        return cloneElement(element, {
          props: { value: value }
        });
      }
      var affixWrapperCls = classNames(className, prefixCls + '-affix-wrapper', prefixCls + '-affix-wrapper-textarea-with-clear-btn');
      return h(
        'span',
        { 'class': affixWrapperCls, style: style },
        [cloneElement(element, {
          style: null,
          props: { value: value }
        }), this.renderClearIcon(prefixCls)]
      );
    },
    renderClearableLabeledInput: function renderClearableLabeledInput() {
      var _$props5 = this.$props,
          prefixCls = _$props5.prefixCls,
          inputType = _$props5.inputType,
          element = _$props5.element;

      if (inputType === ClearableInputType[0]) {
        return this.renderTextAreaWithClearIcon(prefixCls, element);
      }
      return this.renderInputWithLabel(prefixCls, this.renderLabeledIcon(prefixCls, element));
    }
  },
  render: function render() {
    return this.renderClearableLabeledInput();
  }
};

export default ClearableLabeledInput;