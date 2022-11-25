'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputNumberProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _src = require('../vc-input-number/src');

var _src2 = _interopRequireDefault(_src);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var InputNumberProps = exports.InputNumberProps = {
  prefixCls: _vueTypes2['default'].string,
  min: _vueTypes2['default'].number,
  max: _vueTypes2['default'].number,
  value: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]),
  step: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]),
  defaultValue: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]),
  tabIndex: _vueTypes2['default'].number,
  disabled: _vueTypes2['default'].bool,
  size: _vueTypes2['default'].oneOf(['large', 'small', 'default']),
  formatter: _vueTypes2['default'].func,
  parser: _vueTypes2['default'].func,
  decimalSeparator: _vueTypes2['default'].string,
  placeholder: _vueTypes2['default'].string,
  name: _vueTypes2['default'].string,
  id: _vueTypes2['default'].string,
  precision: _vueTypes2['default'].number,
  autoFocus: _vueTypes2['default'].bool
};

var InputNumber = {
  name: 'AInputNumber',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: (0, _propsUtil.initDefaultProps)(InputNumberProps, {
    step: 1
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    focus: function focus() {
      this.$refs.inputNumberRef.focus();
    },
    blur: function blur() {
      this.$refs.inputNumberRef.blur();
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];

    var _getOptionProps$$attr = (0, _extends3['default'])({}, (0, _propsUtil.getOptionProps)(this), this.$attrs),
        customizePrefixCls = _getOptionProps$$attr.prefixCls,
        size = _getOptionProps$$attr.size,
        others = (0, _objectWithoutProperties3['default'])(_getOptionProps$$attr, ['prefixCls', 'size']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('input-number', customizePrefixCls);

    var inputNumberClass = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-sm', size === 'small'), _classNames));
    var upIcon = h(_icon2['default'], {
      attrs: { type: 'up' },
      'class': prefixCls + '-handler-up-inner' });
    var downIcon = h(_icon2['default'], {
      attrs: { type: 'down' },
      'class': prefixCls + '-handler-down-inner' });

    var vcInputNumberprops = {
      props: (0, _extends3['default'])({
        prefixCls: prefixCls,
        upHandler: upIcon,
        downHandler: downIcon
      }, others),
      'class': inputNumberClass,
      ref: 'inputNumberRef',
      on: (0, _propsUtil.getListeners)(this)
    };
    return h(_src2['default'], vcInputNumberprops);
  }
};

/* istanbul ignore next */
InputNumber.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(InputNumber.name, InputNumber);
};

exports['default'] = InputNumber;