'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkeletonTitleProps = undefined;

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var skeletonTitleProps = {
  prefixCls: _vueTypes2['default'].string,
  width: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string])
};

var SkeletonTitleProps = exports.SkeletonTitleProps = _vueTypes2['default'].shape(skeletonTitleProps);

var Title = {
  props: skeletonTitleProps,
  render: function render() {
    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        width = _$props.width;

    var zWidth = typeof width === 'number' ? width + 'px' : width;
    return h('h3', { 'class': prefixCls, style: { width: zWidth } });
  }
};

exports['default'] = Title;