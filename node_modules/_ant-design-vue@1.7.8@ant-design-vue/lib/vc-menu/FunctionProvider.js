'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectExtraPropsKey = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var injectExtraPropsKey = exports.injectExtraPropsKey = 'ANT_MENU_PROVIDER_PROPS_KEY';
var FunctionProvider = {
  inheritAttrs: false,
  provide: function provide() {
    return (0, _defineProperty3['default'])({}, injectExtraPropsKey, this);
  },
  render: function render() {
    var slots = this.$slots;

    return slots['default'][0];
  }
};

exports['default'] = FunctionProvider;