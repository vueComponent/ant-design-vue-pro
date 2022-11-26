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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vcCheckbox = require('../vc-checkbox');

var _vcCheckbox2 = _interopRequireDefault(_vcCheckbox);

var _propsUtil = require('../_util/props-util');

var _propsUtil2 = _interopRequireDefault(_propsUtil);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _warning = require('../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

exports['default'] = {
  name: 'ACheckbox',
  inheritAttrs: false,
  __ANT_CHECKBOX: true,
  model: {
    prop: 'checked'
  },
  props: {
    prefixCls: _vueTypes2['default'].string,
    defaultChecked: _vueTypes2['default'].bool,
    checked: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    isGroup: _vueTypes2['default'].bool,
    value: _vueTypes2['default'].any,
    name: _vueTypes2['default'].string,
    id: _vueTypes2['default'].string,
    indeterminate: _vueTypes2['default'].bool,
    type: _vueTypes2['default'].string.def('checkbox'),
    autoFocus: _vueTypes2['default'].bool
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } },
    checkboxGroupContext: { 'default': function _default() {
        return undefined;
      } }
  },
  watch: {
    value: function value(_value, prevValue) {
      var _this = this;

      this.$nextTick(function () {
        var _checkboxGroupContext = _this.checkboxGroupContext,
            checkboxGroup = _checkboxGroupContext === undefined ? {} : _checkboxGroupContext;

        if (checkboxGroup.registerValue && checkboxGroup.cancelValue) {
          checkboxGroup.cancelValue(prevValue);
          checkboxGroup.registerValue(_value);
        }
      });
    }
  },
  mounted: function mounted() {
    var value = this.value,
        _checkboxGroupContext2 = this.checkboxGroupContext,
        checkboxGroup = _checkboxGroupContext2 === undefined ? {} : _checkboxGroupContext2;

    if (checkboxGroup.registerValue) {
      checkboxGroup.registerValue(value);
    }

    (0, _warning2['default'])((0, _propsUtil2['default'])(this, 'checked') || this.checkboxGroupContext || !(0, _propsUtil2['default'])(this, 'value'), 'Checkbox', '`value` is not validate prop, do you mean `checked`?');
  },
  beforeDestroy: function beforeDestroy() {
    var value = this.value,
        _checkboxGroupContext3 = this.checkboxGroupContext,
        checkboxGroup = _checkboxGroupContext3 === undefined ? {} : _checkboxGroupContext3;

    if (checkboxGroup.cancelValue) {
      checkboxGroup.cancelValue(value);
    }
  },

  methods: {
    handleChange: function handleChange(event) {
      var targetChecked = event.target.checked;
      this.$emit('input', targetChecked);
      this.$emit('change', event);
    },
    focus: function focus() {
      this.$refs.vcCheckbox.focus();
    },
    blur: function blur() {
      this.$refs.vcCheckbox.blur();
    }
  },

  render: function render() {
    var _this2 = this,
        _classNames;

    var h = arguments[0];
    var checkboxGroup = this.checkboxGroupContext,
        $slots = this.$slots;

    var props = (0, _propsUtil.getOptionProps)(this);
    var children = $slots['default'];

    var _getListeners = (0, _propsUtil.getListeners)(this),
        _getListeners$mouseen = _getListeners.mouseenter,
        mouseenter = _getListeners$mouseen === undefined ? noop : _getListeners$mouseen,
        _getListeners$mousele = _getListeners.mouseleave,
        mouseleave = _getListeners$mousele === undefined ? noop : _getListeners$mousele,
        input = _getListeners.input,
        restListeners = (0, _objectWithoutProperties3['default'])(_getListeners, ['mouseenter', 'mouseleave', 'input']);

    var customizePrefixCls = props.prefixCls,
        indeterminate = props.indeterminate,
        restProps = (0, _objectWithoutProperties3['default'])(props, ['prefixCls', 'indeterminate']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('checkbox', customizePrefixCls);

    var checkboxProps = {
      props: (0, _extends3['default'])({}, restProps, { prefixCls: prefixCls }),
      on: restListeners,
      attrs: (0, _propsUtil.getAttrs)(this)
    };
    if (checkboxGroup) {
      checkboxProps.on.change = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this2.$emit.apply(_this2, ['change'].concat(args));
        checkboxGroup.toggleOption({ label: children, value: props.value });
      };
      checkboxProps.props.name = checkboxGroup.name;
      checkboxProps.props.checked = checkboxGroup.sValue.indexOf(props.value) !== -1;
      checkboxProps.props.disabled = props.disabled || checkboxGroup.disabled;
      checkboxProps.props.indeterminate = indeterminate;
    } else {
      checkboxProps.on.change = this.handleChange;
    }
    var classString = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-wrapper', true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-wrapper-checked', checkboxProps.props.checked), (0, _defineProperty3['default'])(_classNames, prefixCls + '-wrapper-disabled', checkboxProps.props.disabled), _classNames));
    var checkboxClass = (0, _classnames2['default'])((0, _defineProperty3['default'])({}, prefixCls + '-indeterminate', indeterminate));
    return h(
      'label',
      { 'class': classString, on: {
          'mouseenter': mouseenter,
          'mouseleave': mouseleave
        }
      },
      [h(_vcCheckbox2['default'], (0, _babelHelperVueJsxMergeProps2['default'])([checkboxProps, { 'class': checkboxClass, ref: 'vcCheckbox' }])), children !== undefined && h('span', [children])]
    );
  }
};