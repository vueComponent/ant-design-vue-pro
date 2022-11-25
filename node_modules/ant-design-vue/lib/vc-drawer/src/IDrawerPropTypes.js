'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IDrawerChildProps = exports.IDrawerProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var IProps = {
  width: _vueTypes2['default'].any,
  height: _vueTypes2['default'].any,
  defaultOpen: _vueTypes2['default'].bool,
  firstEnter: _vueTypes2['default'].bool,
  open: _vueTypes2['default'].bool,
  prefixCls: _vueTypes2['default'].string,
  placement: _vueTypes2['default'].string,
  level: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].array]),
  levelMove: _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].func, _vueTypes2['default'].array]),
  ease: _vueTypes2['default'].string,
  duration: _vueTypes2['default'].string,
  handler: _vueTypes2['default'].any,
  showMask: _vueTypes2['default'].bool,
  maskStyle: _vueTypes2['default'].object,
  className: _vueTypes2['default'].string,
  wrapStyle: _vueTypes2['default'].object,
  maskClosable: _vueTypes2['default'].bool,
  afterVisibleChange: _vueTypes2['default'].func,
  keyboard: _vueTypes2['default'].bool
};

var IDrawerProps = (0, _extends3['default'])({}, IProps, {
  wrapperClassName: _vueTypes2['default'].string,
  forceRender: _vueTypes2['default'].bool,
  getContainer: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].func, _vueTypes2['default'].object, _vueTypes2['default'].bool])
});

var IDrawerChildProps = (0, _extends3['default'])({}, IProps, {
  getContainer: _vueTypes2['default'].func,
  getOpenCount: _vueTypes2['default'].func,
  switchScrollingEffect: _vueTypes2['default'].func
});

exports.IDrawerProps = IDrawerProps;
exports.IDrawerChildProps = IDrawerChildProps;