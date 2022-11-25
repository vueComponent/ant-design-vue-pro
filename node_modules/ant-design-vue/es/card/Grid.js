import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { getListeners } from '../_util/props-util';

export default {
  name: 'ACardGrid',
  __ANT_CARD_GRID: true,
  props: {
    prefixCls: PropTypes.string,
    hoverable: PropTypes.bool
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  render: function render() {
    var _classString;

    var h = arguments[0];
    var _$props = this.$props,
        customizePrefixCls = _$props.prefixCls,
        _$props$hoverable = _$props.hoverable,
        hoverable = _$props$hoverable === undefined ? true : _$props$hoverable;


    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('card', customizePrefixCls);

    var classString = (_classString = {}, _defineProperty(_classString, prefixCls + '-grid', true), _defineProperty(_classString, prefixCls + '-grid-hoverable', hoverable), _classString);
    return h(
      'div',
      _mergeJSXProps([{ on: getListeners(this) }, { 'class': classString }]),
      [this.$slots['default']]
    );
  }
};