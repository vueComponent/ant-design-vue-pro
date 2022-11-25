import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../../_util/vue-types';

var IProps = {
  width: PropTypes.any,
  height: PropTypes.any,
  defaultOpen: PropTypes.bool,
  firstEnter: PropTypes.bool,
  open: PropTypes.bool,
  prefixCls: PropTypes.string,
  placement: PropTypes.string,
  level: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  levelMove: PropTypes.oneOfType([PropTypes.number, PropTypes.func, PropTypes.array]),
  ease: PropTypes.string,
  duration: PropTypes.string,
  handler: PropTypes.any,
  showMask: PropTypes.bool,
  maskStyle: PropTypes.object,
  className: PropTypes.string,
  wrapStyle: PropTypes.object,
  maskClosable: PropTypes.bool,
  afterVisibleChange: PropTypes.func,
  keyboard: PropTypes.bool
};

var IDrawerProps = _extends({}, IProps, {
  wrapperClassName: PropTypes.string,
  forceRender: PropTypes.bool,
  getContainer: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object, PropTypes.bool])
});

var IDrawerChildProps = _extends({}, IProps, {
  getContainer: PropTypes.func,
  getOpenCount: PropTypes.func,
  switchScrollingEffect: PropTypes.func
});

export { IDrawerProps, IDrawerChildProps };