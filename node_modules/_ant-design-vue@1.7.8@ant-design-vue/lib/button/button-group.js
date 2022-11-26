'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonGroupProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _propsUtil = require('../_util/props-util');

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ButtonGroupProps = {
  prefixCls: _vueTypes2['default'].string,
  size: {
    validator: function validator(value) {
      return ['small', 'large', 'default'].includes(value);
    }
  }
};
exports.ButtonGroupProps = ButtonGroupProps;
exports['default'] = {
  name: 'AButtonGroup',
  props: ButtonGroupProps,
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      sizeMap: {
        large: 'lg',
        small: 'sm'
      }
    };
  },
  render: function render() {
    var _classes;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        size = this.size,
        $slots = this.$slots;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('btn-group', customizePrefixCls);

    // large => lg
    // small => sm
    var sizeCls = '';
    switch (size) {
      case 'large':
        sizeCls = 'lg';
        break;
      case 'small':
        sizeCls = 'sm';
        break;
      default:
        break;
    }
    var classes = (_classes = {}, (0, _defineProperty3['default'])(_classes, '' + prefixCls, true), (0, _defineProperty3['default'])(_classes, prefixCls + '-' + sizeCls, sizeCls), _classes);
    return h(
      'div',
      { 'class': classes },
      [(0, _propsUtil.filterEmpty)($slots['default'])]
    );
  }
};