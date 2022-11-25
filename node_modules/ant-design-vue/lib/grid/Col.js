'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColProps = exports.ColSize = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var stringOrNumber = _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]);

var ColSize = exports.ColSize = _vueTypes2['default'].shape({
  span: stringOrNumber,
  order: stringOrNumber,
  offset: stringOrNumber,
  push: stringOrNumber,
  pull: stringOrNumber
}).loose;

var objectOrNumber = _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number, ColSize]);

var ColProps = exports.ColProps = {
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
  prefixCls: _vueTypes2['default'].string,
  flex: stringOrNumber
};

exports['default'] = {
  name: 'ACol',
  props: ColProps,
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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
      } else if ((typeof propSize === 'undefined' ? 'undefined' : (0, _typeof3['default'])(propSize)) === 'object') {
        sizeProps = propSize || {};
      }

      sizeClassObj = (0, _extends5['default'])({}, sizeClassObj, (_extends2 = {}, (0, _defineProperty3['default'])(_extends2, prefixCls + '-' + size + '-' + sizeProps.span, sizeProps.span !== undefined), (0, _defineProperty3['default'])(_extends2, prefixCls + '-' + size + '-order-' + sizeProps.order, sizeProps.order || sizeProps.order === 0), (0, _defineProperty3['default'])(_extends2, prefixCls + '-' + size + '-offset-' + sizeProps.offset, sizeProps.offset || sizeProps.offset === 0), (0, _defineProperty3['default'])(_extends2, prefixCls + '-' + size + '-push-' + sizeProps.push, sizeProps.push || sizeProps.push === 0), (0, _defineProperty3['default'])(_extends2, prefixCls + '-' + size + '-pull-' + sizeProps.pull, sizeProps.pull || sizeProps.pull === 0), _extends2));
    });
    var classes = (0, _extends5['default'])((_extends3 = {}, (0, _defineProperty3['default'])(_extends3, '' + prefixCls, true), (0, _defineProperty3['default'])(_extends3, prefixCls + '-' + span, span !== undefined), (0, _defineProperty3['default'])(_extends3, prefixCls + '-order-' + order, order), (0, _defineProperty3['default'])(_extends3, prefixCls + '-offset-' + offset, offset), (0, _defineProperty3['default'])(_extends3, prefixCls + '-push-' + push, push), (0, _defineProperty3['default'])(_extends3, prefixCls + '-pull-' + pull, pull), _extends3), sizeClassObj);
    var divProps = {
      on: (0, _propsUtil.getListeners)(this),
      'class': classes,
      style: {}
    };
    if (rowContext) {
      var gutter = rowContext.getGutter();
      if (gutter) {
        divProps.style = (0, _extends5['default'])({}, gutter[0] > 0 ? {
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