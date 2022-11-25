'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _Dialog = require('./Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _IDialogPropTypes = require('./IDialogPropTypes');

var _IDialogPropTypes2 = _interopRequireDefault(_IDialogPropTypes);

var _propsUtil = require('../_util/props-util');

var _PortalWrapper = require('../_util/PortalWrapper');

var _PortalWrapper2 = _interopRequireDefault(_PortalWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var IDialogPropTypes = (0, _IDialogPropTypes2['default'])();
var DialogWrap = {
  inheritAttrs: false,
  props: (0, _extends3['default'])({}, IDialogPropTypes, {
    visible: IDialogPropTypes.visible.def(false)
  }),

  render: function render() {
    var _this = this;

    var h = arguments[0];
    var _$props = this.$props,
        visible = _$props.visible,
        getContainer = _$props.getContainer,
        forceRender = _$props.forceRender;

    var dialogProps = {
      props: this.$props,
      attrs: this.$attrs,
      ref: '_component',
      key: 'dialog',
      on: (0, _propsUtil.getListeners)(this)
    };
    // 渲染在当前 dom 里；
    if (getContainer === false) {
      return h(
        _Dialog2['default'],
        (0, _babelHelperVueJsxMergeProps2['default'])([dialogProps, {
          attrs: {
            getOpenCount: function getOpenCount() {
              return 2;
            } // 不对 body 做任何操作。。
          }
        }]),
        [this.$slots['default']]
      );
    }
    return h(_PortalWrapper2['default'], {
      attrs: {
        visible: visible,
        forceRender: forceRender,
        getContainer: getContainer,
        children: function children(childProps) {
          dialogProps.props = (0, _extends3['default'])({}, dialogProps.props, childProps);
          return h(
            _Dialog2['default'],
            dialogProps,
            [_this.$slots['default']]
          );
        }
      }
    });
  }
};

exports['default'] = DialogWrap;