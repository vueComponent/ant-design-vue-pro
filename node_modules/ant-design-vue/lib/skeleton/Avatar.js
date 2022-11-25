'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkeletonAvatarProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var skeletonAvatarProps = {
  prefixCls: _vueTypes2['default'].string,
  size: _vueTypes2['default'].oneOfType([_vueTypes2['default'].oneOf(['large', 'small', 'default']), _vueTypes2['default'].number]),
  shape: _vueTypes2['default'].oneOf(['circle', 'square'])
};

var SkeletonAvatarProps = exports.SkeletonAvatarProps = _vueTypes2['default'].shape(skeletonAvatarProps).loose;

var Avatar = {
  props: (0, _propsUtil.initDefaultProps)(skeletonAvatarProps, {
    size: 'large'
  }),
  render: function render() {
    var _classNames, _classNames2;

    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        size = _$props.size,
        shape = _$props.shape;


    var sizeCls = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-lg', size === 'large'), (0, _defineProperty3['default'])(_classNames, prefixCls + '-sm', size === 'small'), _classNames));

    var shapeCls = (0, _classnames2['default'])((_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, prefixCls + '-circle', shape === 'circle'), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-square', shape === 'square'), _classNames2));

    var sizeStyle = typeof size === 'number' ? {
      width: size + 'px',
      height: size + 'px',
      lineHeight: size + 'px'
    } : {};

    return h('span', { 'class': (0, _classnames2['default'])(prefixCls, sizeCls, shapeCls), style: sizeStyle });
  }
};

exports['default'] = Avatar;