'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ACardGrid',
  __ANT_CARD_GRID: true,
  props: {
    prefixCls: _vueTypes2['default'].string,
    hoverable: _vueTypes2['default'].bool
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
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

    var classString = (_classString = {}, (0, _defineProperty3['default'])(_classString, prefixCls + '-grid', true), (0, _defineProperty3['default'])(_classString, prefixCls + '-grid-hoverable', hoverable), _classString);
    return h(
      'div',
      (0, _babelHelperVueJsxMergeProps2['default'])([{ on: (0, _propsUtil.getListeners)(this) }, { 'class': classString }]),
      [this.$slots['default']]
    );
  }
};