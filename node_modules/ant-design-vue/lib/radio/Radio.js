'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vcCheckbox = require('../vc-checkbox');

var _vcCheckbox2 = _interopRequireDefault(_vcCheckbox);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

exports['default'] = {
  name: 'ARadio',
  model: {
    prop: 'checked'
  },
  props: {
    prefixCls: _vueTypes2['default'].string,
    defaultChecked: Boolean,
    checked: { type: Boolean, 'default': undefined },
    disabled: Boolean,
    isGroup: Boolean,
    value: _vueTypes2['default'].any,
    name: String,
    id: String,
    autoFocus: Boolean,
    type: _vueTypes2['default'].string.def('radio')
  },
  inject: {
    radioGroupContext: { 'default': undefined },
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    focus: function focus() {
      this.$refs.vcCheckbox.focus();
    },
    blur: function blur() {
      this.$refs.vcCheckbox.blur();
    },
    handleChange: function handleChange(event) {
      var targetChecked = event.target.checked;
      this.$emit('input', targetChecked);
      this.$emit('change', event);
    },
    onChange: function onChange(e) {
      this.$emit('change', e);
      if (this.radioGroupContext && this.radioGroupContext.onRadioChange) {
        this.radioGroupContext.onRadioChange(e);
      }
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];
    var $slots = this.$slots,
        radioGroup = this.radioGroupContext;

    var props = (0, _propsUtil.getOptionProps)(this);
    var children = $slots['default'];

    var _getListeners = (0, _propsUtil.getListeners)(this),
        _getListeners$mouseen = _getListeners.mouseenter,
        mouseenter = _getListeners$mouseen === undefined ? noop : _getListeners$mouseen,
        _getListeners$mousele = _getListeners.mouseleave,
        mouseleave = _getListeners$mousele === undefined ? noop : _getListeners$mousele,
        restListeners = (0, _objectWithoutProperties3['default'])(_getListeners, ['mouseenter', 'mouseleave']);

    var customizePrefixCls = props.prefixCls,
        restProps = (0, _objectWithoutProperties3['default'])(props, ['prefixCls']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('radio', customizePrefixCls);

    var radioProps = {
      props: (0, _extends3['default'])({}, restProps, { prefixCls: prefixCls }),
      on: restListeners,
      attrs: (0, _propsUtil.getAttrs)(this)
    };

    if (radioGroup) {
      radioProps.props.name = radioGroup.name;
      radioProps.on.change = this.onChange;
      radioProps.props.checked = props.value === radioGroup.stateValue;
      radioProps.props.disabled = props.disabled || radioGroup.disabled;
    } else {
      radioProps.on.change = this.handleChange;
    }
    var wrapperClassString = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-wrapper', true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-wrapper-checked', radioProps.props.checked), (0, _defineProperty3['default'])(_classNames, prefixCls + '-wrapper-disabled', radioProps.props.disabled), _classNames));

    return h(
      'label',
      { 'class': wrapperClassString, on: {
          'mouseenter': mouseenter,
          'mouseleave': mouseleave
        }
      },
      [h(_vcCheckbox2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([radioProps, { ref: 'vcCheckbox' }])), children !== undefined ? h('span', [children]) : null]
    );
  }
};