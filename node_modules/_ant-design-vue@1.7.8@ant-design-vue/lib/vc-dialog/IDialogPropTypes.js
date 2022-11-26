'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function IDialogPropTypes() {
  return {
    keyboard: _vueTypes2['default'].bool,
    mask: _vueTypes2['default'].bool,
    afterClose: _vueTypes2['default'].func,
    // onClose: PropTypes. (e: SyntheticEvent<HTMLDivElement>) =>any,
    closable: _vueTypes2['default'].bool,
    maskClosable: _vueTypes2['default'].bool,
    visible: _vueTypes2['default'].bool,
    destroyOnClose: _vueTypes2['default'].bool,
    mousePosition: _vueTypes2['default'].shape({
      x: _vueTypes2['default'].number,
      y: _vueTypes2['default'].number
    }).loose,
    title: _vueTypes2['default'].any,
    footer: _vueTypes2['default'].any,
    transitionName: _vueTypes2['default'].string,
    maskTransitionName: _vueTypes2['default'].string,
    animation: _vueTypes2['default'].any,
    maskAnimation: _vueTypes2['default'].any,
    wrapStyle: _vueTypes2['default'].object,
    bodyStyle: _vueTypes2['default'].object,
    maskStyle: _vueTypes2['default'].object,
    prefixCls: _vueTypes2['default'].string,
    wrapClassName: _vueTypes2['default'].string,
    width: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    height: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    zIndex: _vueTypes2['default'].number,
    bodyProps: _vueTypes2['default'].any,
    maskProps: _vueTypes2['default'].any,
    wrapProps: _vueTypes2['default'].any,
    getContainer: _vueTypes2['default'].any,
    dialogStyle: _vueTypes2['default'].object.def(function () {
      return {};
    }),
    dialogClass: _vueTypes2['default'].string.def(''),
    closeIcon: _vueTypes2['default'].any,
    forceRender: _vueTypes2['default'].bool,
    getOpenCount: _vueTypes2['default'].func,
    // https://github.com/ant-design/ant-design/issues/19771
    // https://github.com/react-component/dialog/issues/95
    focusTriggerAfterClose: _vueTypes2['default'].bool
  };
}

exports['default'] = IDialogPropTypes;