'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _Radio = require('./Radio');

var _Radio2 = _interopRequireDefault(_Radio);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ARadioButton',
  props: (0, _extends3['default'])({}, _Radio2['default'].props),
  inject: {
    radioGroupContext: { 'default': undefined },
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  render: function render() {
    var h = arguments[0];

    var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        otherProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['prefixCls']);

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('radio-button', customizePrefixCls);

    var radioProps = {
      props: (0, _extends3['default'])({}, otherProps, {
        prefixCls: prefixCls
      }),
      on: (0, _propsUtil.getListeners)(this)
    };
    if (this.radioGroupContext) {
      radioProps.on.change = this.radioGroupContext.onRadioChange;
      radioProps.props.checked = this.$props.value === this.radioGroupContext.stateValue;
      radioProps.props.disabled = this.$props.disabled || this.radioGroupContext.disabled;
    }
    return h(
      _Radio2['default'],
      radioProps,
      [this.$slots['default']]
    );
  }
};