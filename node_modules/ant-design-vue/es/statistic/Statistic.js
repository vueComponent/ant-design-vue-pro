import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import { getComponentFromProp, initDefaultProps } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import StatisticNumber from './Number';

export var StatisticProps = {
  prefixCls: PropTypes.string,
  decimalSeparator: PropTypes.string,
  groupSeparator: PropTypes.string,
  format: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  valueStyle: PropTypes.any,
  valueRender: PropTypes.any,
  formatter: PropTypes.any,
  precision: PropTypes.number,
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  title: PropTypes.any
};

export default {
  name: 'AStatistic',
  props: initDefaultProps(StatisticProps, {
    decimalSeparator: '.',
    groupSeparator: ','
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
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

    var title = getComponentFromProp(this, 'title');
    var prefix = getComponentFromProp(this, 'prefix');
    var suffix = getComponentFromProp(this, 'suffix');
    var formatter = getComponentFromProp(this, 'formatter', {}, false);
    var valueNode = h(StatisticNumber, { props: _extends({}, this.$props, { prefixCls: prefixCls, value: value, formatter: formatter }) });
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