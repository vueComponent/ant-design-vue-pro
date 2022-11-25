'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatisticProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _Number = require('./Number');

var _Number2 = _interopRequireDefault(_Number);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var StatisticProps = exports.StatisticProps = {
  prefixCls: _vueTypes2['default'].string,
  decimalSeparator: _vueTypes2['default'].string,
  groupSeparator: _vueTypes2['default'].string,
  format: _vueTypes2['default'].string,
  value: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number, _vueTypes2['default'].object]),
  valueStyle: _vueTypes2['default'].any,
  valueRender: _vueTypes2['default'].any,
  formatter: _vueTypes2['default'].any,
  precision: _vueTypes2['default'].number,
  prefix: _vueTypes2['default'].any,
  suffix: _vueTypes2['default'].any,
  title: _vueTypes2['default'].any
};

exports['default'] = {
  name: 'AStatistic',
  props: (0, _propsUtil.initDefaultProps)(StatisticProps, {
    decimalSeparator: '.',
    groupSeparator: ','
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },

  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        customizePrefixCls = _$props.prefixCls,
        _$props$value = _$props.value,
        value = _$props$value === undefined ? 0 : _$props$value,
        valueStyle = _$props.valueStyle,
        valueRender = _$props.valueRender;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('statistic', customizePrefixCls);

    var title = (0, _propsUtil.getComponentFromProp)(this, 'title');
    var prefix = (0, _propsUtil.getComponentFromProp)(this, 'prefix');
    var suffix = (0, _propsUtil.getComponentFromProp)(this, 'suffix');
    var formatter = (0, _propsUtil.getComponentFromProp)(this, 'formatter', {}, false);
    var valueNode = h(_Number2['default'], { props: (0, _extends3['default'])({}, this.$props, { prefixCls: prefixCls, value: value, formatter: formatter }) });
    if (valueRender) {
      valueNode = valueRender(valueNode);
    }

    return h(
      'div',
      { 'class': prefixCls },
      [title && h(
        'div',
        { 'class': prefixCls + '-title' },
        [title]
      ), h(
        'div',
        { style: valueStyle, 'class': prefixCls + '-content' },
        [prefix && h(
          'span',
          { 'class': prefixCls + '-content-prefix' },
          [prefix]
        ), valueNode, suffix && h(
          'span',
          { 'class': prefixCls + '-content-suffix' },
          [suffix]
        )]
      )]
    );
  }
};