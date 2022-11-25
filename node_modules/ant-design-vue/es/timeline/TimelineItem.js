import _defineProperty from 'babel-runtime/helpers/defineProperty';
import classNames from 'classnames';
import PropTypes from '../_util/vue-types';
import { getOptionProps, initDefaultProps, getComponentFromProp, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

export var TimeLineItemProps = {
  prefixCls: PropTypes.string,
  color: PropTypes.string,
  dot: PropTypes.any,
  pending: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right', '']).def('')
};

export default {
  name: 'ATimelineItem',
  props: initDefaultProps(TimeLineItemProps, {
    color: 'blue',
    pending: false
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  render: function render() {
    var _classNames, _classNames2;

    var h = arguments[0];

    var _getOptionProps = getOptionProps(this),
        customizePrefixCls = _getOptionProps.prefixCls,
        _getOptionProps$color = _getOptionProps.color,
        color = _getOptionProps$color === undefined ? '' : _getOptionProps$color,
        pending = _getOptionProps.pending;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('timeline', customizePrefixCls);

    var dot = getComponentFromProp(this, 'dot');
    var itemClassName = classNames((_classNames = {}, _defineProperty(_classNames, prefixCls + '-item', true), _defineProperty(_classNames, prefixCls + '-item-pending', pending), _classNames));

    var dotClassName = classNames((_classNames2 = {}, _defineProperty(_classNames2, prefixCls + '-item-head', true), _defineProperty(_classNames2, prefixCls + '-item-head-custom', dot), _defineProperty(_classNames2, prefixCls + '-item-head-' + color, true), _classNames2));
    var liProps = {
      'class': itemClassName,
      on: getListeners(this)
    };
    return h(
      'li',
      liProps,
      [h('div', { 'class': prefixCls + '-item-tail' }), h(
        'div',
        {
          'class': dotClassName,
          style: { borderColor: /blue|red|green|gray/.test(color) ? undefined : color }
        },
        [dot]
      ), h(
        'div',
        { 'class': prefixCls + '-item-content' },
        [this.$slots['default']]
      )]
    );
  }
};