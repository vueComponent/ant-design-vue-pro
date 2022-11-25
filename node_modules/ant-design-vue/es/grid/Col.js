import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import PropTypes from '../_util/vue-types';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import { getListeners } from '../_util/props-util';

var stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export var ColSize = PropTypes.shape({
  span: stringOrNumber,
  order: stringOrNumber,
  offset: stringOrNumber,
  push: stringOrNumber,
  pull: stringOrNumber
}).loose;

var objectOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number, ColSize]);

export var ColProps = {
  span: stringOrNumber,
  order: stringOrNumber,
  offset: stringOrNumber,
  push: stringOrNumber,
  pull: stringOrNumber,
  xs: objectOrNumber,
  sm: objectOrNumber,
  md: objectOrNumber,
  lg: objectOrNumber,
  xl: objectOrNumber,
  xxl: objectOrNumber,
  prefixCls: PropTypes.string,
  flex: stringOrNumber
};

export default {
  name: 'ACol',
  props: ColProps,
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } },
    rowContext: {
      'default': function _default() {
        return null;
      }
    }
  },
  methods: {
    parseFlex: function parseFlex(flex) {
      if (typeof flex === 'number') {
        return flex + ' ' + flex + ' auto';
      }
      if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
        return '0 0 ' + flex;
      }
      return flex;
    }
  },
  render: function render() {
    var _this = this,
        _extends3;

    var h = arguments[0];
    var span = this.span,
        order = this.order,
        offset = this.offset,
        push = this.push,
        pull = this.pull,
        flex = this.flex,
        customizePrefixCls = this.prefixCls,
        $slots = this.$slots,
        rowContext = this.rowContext;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('col', customizePrefixCls);

    var sizeClassObj = {};
    ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(function (size) {
      var _extends2;

      var sizeProps = {};
      var propSize = _this[size];
      if (typeof propSize === 'number') {
        sizeProps.span = propSize;
      } else if ((typeof propSize === 'undefined' ? 'undefined' : _typeof(propSize)) === 'object') {
        sizeProps = propSize || {};
      }

      sizeClassObj = _extends({}, sizeClassObj, (_extends2 = {}, _defineProperty(_extends2, prefixCls + '-' + size + '-' + sizeProps.span, sizeProps.span !== undefined), _defineProperty(_extends2, prefixCls + '-' + size + '-order-' + sizeProps.order, sizeProps.order || sizeProps.order === 0), _defineProperty(_extends2, prefixCls + '-' + size + '-offset-' + sizeProps.offset, sizeProps.offset || sizeProps.offset === 0), _defineProperty(_extends2, prefixCls + '-' + size + '-push-' + sizeProps.push, sizeProps.push || sizeProps.push === 0), _defineProperty(_extends2, prefixCls + '-' + size + '-pull-' + sizeProps.pull, sizeProps.pull || sizeProps.pull === 0), _extends2));
    });
    var classes = _extends((_extends3 = {}, _defineProperty(_extends3, '' + prefixCls, true), _defineProperty(_extends3, prefixCls + '-' + span, span !== undefined), _defineProperty(_extends3, prefixCls + '-order-' + order, order), _defineProperty(_extends3, prefixCls + '-offset-' + offset, offset), _defineProperty(_extends3, prefixCls + '-push-' + push, push), _defineProperty(_extends3, prefixCls + '-pull-' + pull, pull), _extends3), sizeClassObj);
    var divProps = {
      on: getListeners(this),
      'class': classes,
      style: {}
    };
    if (rowContext) {
      var gutter = rowContext.getGutter();
      if (gutter) {
        divProps.style = _extends({}, gutter[0] > 0 ? {
          paddingLeft: gutter[0] / 2 + 'px',
          paddingRight: gutter[0] / 2 + 'px'
        } : {}, gutter[1] > 0 ? {
          paddingTop: gutter[1] / 2 + 'px',
          paddingBottom: gutter[1] / 2 + 'px'
        } : {});
      }
    }

    if (flex) {
      divProps.style.flex = this.parseFlex(flex);
    }

    return h(
      'div',
      divProps,
      [$slots['default']]
    );
  }
};