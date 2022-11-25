'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigConsumerProps = undefined;

var _renderEmpty = require('./renderEmpty');

var _renderEmpty2 = _interopRequireDefault(_renderEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ConfigConsumerProps = exports.ConfigConsumerProps = {
  getPrefixCls: function getPrefixCls(suffixCls, customizePrefixCls) {
    if (customizePrefixCls) return customizePrefixCls;
    return 'ant-' + suffixCls;
  },
  renderEmpty: _renderEmpty2['default']
};