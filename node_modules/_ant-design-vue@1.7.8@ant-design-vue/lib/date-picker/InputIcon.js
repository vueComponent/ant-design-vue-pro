'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  functional: true,
  render: function render(h, context) {
    var props = context.props;
    var suffixIcon = props.suffixIcon,
        prefixCls = props.prefixCls;

    return (suffixIcon && (0, _propsUtil.isValidElement)(suffixIcon) ? (0, _vnode.cloneElement)(suffixIcon, {
      'class': prefixCls + '-picker-icon'
    }) : h(
      'span',
      { 'class': prefixCls + '-picker-icon' },
      [suffixIcon]
    )) || h(_icon2['default'], {
      attrs: { type: 'calendar' },
      'class': prefixCls + '-picker-icon' });
  }
};