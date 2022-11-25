'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.hasPrefixSuffix = hasPrefixSuffix;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _Input = require('./Input');

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vnode = require('../_util/vnode');

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function hasPrefixSuffix(instance) {
  return !!((0, _propsUtil.getComponentFromProp)(instance, 'prefix') || (0, _propsUtil.getComponentFromProp)(instance, 'suffix') || instance.$props.allowClear);
}

var ClearableInputType = ['text', 'input'];

var ClearableLabeledInput = {
  props: {
    prefixCls: _vueTypes2['default'].string,
    inputType: _vueTypes2['default'].oneOf(ClearableInputType),
    value: _vueTypes2['default'].any,
    defaultValue: _vueTypes2['default'].any,
    allowClear: _vueTypes2['default'].bool,
    element: _vueTypes2['default'].any,
    handleReset: _vueTypes2['default'].func,
    disabled: _vueTypes2['default'].bool,
    size: _vueTypes2['default'].oneOf(['small', 'large', 'default']),
    suffix: _vueTypes2['default'].any,
    prefix: _vueTypes2['default'].any,
    addonBefore: _vueTypes2['default'].any,
    addonAfter: _vueTypes2['default'].any,
    className: _vueTypes2['default'].string,
    readOnly: _vueTypes2['default'].bool
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
      return h(_icon2['default'], {
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
        return (0, _vnode.cloneElement)(element, {
          props: { value: props.value }
        });
      }

      var prefix = props.prefix ? h(
        'span',
        { 'class': prefixCls + '-prefix' },
        [props.prefix]
      ) : null;

      var affixWrapperCls = (0, _classnames2['default'])(props.className, prefixCls + '-affix-wrapper', (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-affix-wrapper-sm', props.size === 'small'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-affix-wrapper-lg', props.size === 'large'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-affix-wrapper-input-with-clear-btn', props.suffix && props.allowClear && this.$props.value), _classNames));

      return h(
        'span',
        { 'class': affixWrapperCls, style: props.style },
        [prefix, (0, _vnode.cloneElement)(element, {
          style: null,
          props: { value: props.value },
          'class': (0, _Input.getInputClassName)(prefixCls, props.size, props.disabled)
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

      var mergedWrapperClassName = (0, _classnames2['default'])(prefixCls + '-wrapper', (0, _defineProperty3['default'])({}, wrapperClassName, addonBefore || addonAfter));

      var mergedGroupClassName = (0, _classnames2['default'])(className, prefixCls + '-group-wrapper', (_classNames3 = {}, (0, _defineProperty3['default'])(_classNames3, prefixCls + '-group-wrapper-sm', size === 'small'), (0, _defineProperty3['default'])(_classNames3, prefixCls + '-group-wrapper-lg', size === 'large'), _classNames3));

      // Need another wrapper for changing display:table to display:inline-block
      // and put style prop in wrapper
      return h(
        'span',
        { 'class': mergedGroupClassName, style: style },
        [h(
          'span',
          { 'class': mergedWrapperClassName },
          [addonBeforeNode, (0, _vnode.cloneElement)(labeledElement, { style: null }), addonAfterNode]
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
        return (0, _vnode.cloneElement)(element, {
          props: { value: value }
        });
      }
      var affixWrapperCls = (0, _classnames2['default'])(className, prefixCls + '-affix-wrapper', prefixCls + '-affix-wrapper-textarea-with-clear-btn');
      return h(
        'span',
        { 'class': affixWrapperCls, style: style },
        [(0, _vnode.cloneElement)(element, {
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

exports['default'] = ClearableLabeledInput;