import PropTypes from '../_util/vue-types';

var skeletonTitleProps = {
  prefixCls: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export var SkeletonTitleProps = PropTypes.shape(skeletonTitleProps);

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

export default Title;