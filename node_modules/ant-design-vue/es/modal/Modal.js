import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
import Dialog from '../vc-dialog';
import PropTypes from '../_util/vue-types';
import addEventListener from '../vc-util/Dom/addEventListener';
import { getConfirmLocale } from './locale';
import Icon from '../icon';
import Button from '../button';
import buttonTypes from '../button/buttonTypes';
var ButtonType = buttonTypes().type;
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { initDefaultProps, getComponentFromProp, getClass, getStyle, mergeProps, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';

var mousePosition = null;
// ref: https://github.com/ant-design/ant-design/issues/15795
var getClickPosition = function getClickPosition(e) {
  mousePosition = {
    x: e.pageX,
    y: e.pageY
  };
  // 100ms 内发生过点击事件，则从点击位置动画展示
  // 否则直接 zoom 展示
  // 这样可以兼容非点击方式展开
  setTimeout(function () {
    return mousePosition = null;
  }, 100);
};

// 只有点击事件支持从鼠标位置动画展开
if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
  addEventListener(document.documentElement, 'click', getClickPosition, true);
}

function noop() {}
var modalProps = function modalProps() {
  var defaultProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var props = {
    prefixCls: PropTypes.string,
    /** 对话框是否可见*/
    visible: PropTypes.bool,
    /** 确定按钮 loading*/
    confirmLoading: PropTypes.bool,
    /** 标题*/
    title: PropTypes.any,
    /** 是否显示右上角的关闭按钮*/
    closable: PropTypes.bool,
    closeIcon: PropTypes.any,
    /** 点击确定回调*/
    // onOk: (e: React.MouseEvent<any>) => void,
    /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
    // onCancel: (e: React.MouseEvent<any>) => void,
    afterClose: PropTypes.func.def(noop),
    /** 垂直居中 */
    centered: PropTypes.bool,
    /** 宽度*/
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** 底部内容*/
    footer: PropTypes.any,
    /** 确认按钮文字*/
    okText: PropTypes.any,
    /** 确认按钮类型*/
    okType: ButtonType,
    /** 取消按钮文字*/
    cancelText: PropTypes.any,
    icon: PropTypes.any,
    /** 点击蒙层是否允许关闭*/
    maskClosable: PropTypes.bool,
    /** 强制渲染 Modal*/
    forceRender: PropTypes.bool,
    okButtonProps: PropTypes.object,
    cancelButtonProps: PropTypes.object,
    destroyOnClose: PropTypes.bool,
    wrapClassName: PropTypes.string,
    maskTransitionName: PropTypes.string,
    transitionName: PropTypes.string,
    getContainer: PropTypes.func,
    zIndex: PropTypes.number,
    bodyStyle: PropTypes.object,
    maskStyle: PropTypes.object,
    mask: PropTypes.bool,
    keyboard: PropTypes.bool,
    wrapProps: PropTypes.object,
    focusTriggerAfterClose: PropTypes.bool,
    dialogStyle: PropTypes.object.def(function () {
      return {};
    })
  };
  return initDefaultProps(props, defaultProps);
};

export var destroyFns = [];

export default {
  name: 'AModal',
  inheritAttrs: false,
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: modalProps({
    width: 520,
    transitionName: 'zoom',
    maskTransitionName: 'fade',
    confirmLoading: false,
    visible: false,
    okType: 'primary'
  }),
  data: function data() {
    return {
      sVisible: !!this.visible
    };
  },

  watch: {
    visible: function visible(val) {
      this.sVisible = val;
    }
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  // static info: ModalFunc;
  // static success: ModalFunc;
  // static error: ModalFunc;
  // static warn: ModalFunc;
  // static warning: ModalFunc;
  // static confirm: ModalFunc;
  methods: {
    handleCancel: function handleCancel(e) {
      this.$emit('cancel', e);
      this.$emit('change', false);
    },
    handleOk: function handleOk(e) {
      this.$emit('ok', e);
    },
    renderFooter: function renderFooter(locale) {
      var h = this.$createElement;
      var okType = this.okType,
          confirmLoading = this.confirmLoading;

      var cancelBtnProps = mergeProps({ on: { click: this.handleCancel } }, this.cancelButtonProps || {});
      var okBtnProps = mergeProps({
        on: { click: this.handleOk },
        props: {
          type: okType,
          loading: confirmLoading
        }
      }, this.okButtonProps || {});
      return h('div', [h(
        Button,
        cancelBtnProps,
        [getComponentFromProp(this, 'cancelText') || locale.cancelText]
      ), h(
        Button,
        okBtnProps,
        [getComponentFromProp(this, 'okText') || locale.okText]
      )]);
    }
  },

  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        visible = this.sVisible,
        wrapClassName = this.wrapClassName,
        centered = this.centered,
        getContainer = this.getContainer,
        $slots = this.$slots,
        $scopedSlots = this.$scopedSlots,
        $attrs = this.$attrs;

    var children = $scopedSlots['default'] ? $scopedSlots['default']() : $slots['default'];
    var _configProvider = this.configProvider,
        getPrefixCls = _configProvider.getPrefixCls,
        getContextPopupContainer = _configProvider.getPopupContainer;

    var prefixCls = getPrefixCls('modal', customizePrefixCls);

    var defaultFooter = h(LocaleReceiver, {
      attrs: {
        componentName: 'Modal',
        defaultLocale: getConfirmLocale()
      },
      scopedSlots: { 'default': this.renderFooter }
    });
    var closeIcon = getComponentFromProp(this, 'closeIcon');
    var closeIconToRender = h(
      'span',
      { 'class': prefixCls + '-close-x' },
      [closeIcon || h(Icon, { 'class': prefixCls + '-close-icon', attrs: { type: 'close' }
      })]
    );
    var footer = getComponentFromProp(this, 'footer');
    var title = getComponentFromProp(this, 'title');
    var dialogProps = {
      props: _extends({}, this.$props, {
        getContainer: getContainer === undefined ? getContextPopupContainer : getContainer,
        prefixCls: prefixCls,
        wrapClassName: classNames(_defineProperty({}, prefixCls + '-centered', !!centered), wrapClassName),
        title: title,
        footer: footer === undefined ? defaultFooter : footer,
        visible: visible,
        mousePosition: mousePosition,
        closeIcon: closeIconToRender
      }),
      on: _extends({}, getListeners(this), {
        close: this.handleCancel
      }),
      'class': getClass(this),
      style: getStyle(this),
      attrs: $attrs
    };
    return h(
      Dialog,
      dialogProps,
      [children]
    );
  }
};