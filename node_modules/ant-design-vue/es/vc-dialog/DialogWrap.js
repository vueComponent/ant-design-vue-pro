import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import Dialog from './Dialog';
import getDialogPropTypes from './IDialogPropTypes';
import { getListeners } from '../_util/props-util';
import Portal from '../_util/PortalWrapper';
var IDialogPropTypes = getDialogPropTypes();
var DialogWrap = {
  inheritAttrs: false,
  props: _extends({}, IDialogPropTypes, {
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
      on: getListeners(this)
    };
    // 渲染在当前 dom 里；
    if (getContainer === false) {
      return h(
        Dialog,
        _mergeJSXProps([dialogProps, {
          attrs: {
            getOpenCount: function getOpenCount() {
              return 2;
            } // 不对 body 做任何操作。。
          }
        }]),
        [this.$slots['default']]
      );
    }
    return h(Portal, {
      attrs: {
        visible: visible,
        forceRender: forceRender,
        getContainer: getContainer,
        children: function children(childProps) {
          dialogProps.props = _extends({}, dialogProps.props, childProps);
          return h(
            Dialog,
            dialogProps,
            [_this.$slots['default']]
          );
        }
      }
    });
  }
};

export default DialogWrap;