'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.destroyFns = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _vcDialog = require('../vc-dialog');

var _vcDialog2 = _interopRequireDefault(_vcDialog);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _addEventListener = require('../vc-util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _locale = require('./locale');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

var _buttonTypes = require('../button/buttonTypes');

var _buttonTypes2 = _interopRequireDefault(_buttonTypes);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ButtonType = (0, _buttonTypes2['default'])().type;


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
  (0, _addEventListener2['default'])(document.documentElement, 'click', getClickPosition, true);
}

function noop() {}
var modalProps = function modalProps() {
  var defaultProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var props = {
    prefixCls: _vueTypes2['default'].string,
    /** 对话框是否可见*/
    visible: _vueTypes2['default'].bool,
    /** 确定按钮 loading*/
    confirmLoading: _vueTypes2['default'].bool,
    /** 标题*/
    title: _vueTypes2['default'].any,
    /** 是否显示右上角的关闭按钮*/
    closable: _vueTypes2['default'].bool,
    closeIcon: _vueTypes2['default'].any,
    /** 点击确定回调*/
    // onOk: (e: React.MouseEvent<any>) => void,
    /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
    // onCancel: (e: React.MouseEvent<any>) => void,
    afterClose: _vueTypes2['default'].func.def(noop),
    /** 垂直居中 */
    centered: _vueTypes2['default'].bool,
    /** 宽度*/
    width: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].number]),
    /** 底部内容*/
    footer: _vueTypes2['default'].any,
    /** 确认按钮文字*/
    okText: _vueTypes2['default'].any,
    /** 确认按钮类型*/
    okType: ButtonType,
    /** 取消按钮文字*/
    cancelText: _vueTypes2['default'].any,
    icon: _vueTypes2['default'].any,
    /** 点击蒙层是否允许关闭*/
    maskClosable: _vueTypes2['default'].bool,
    /** 强制渲染 Modal*/
    forceRender: _vueTypes2['default'].bool,
    okButtonProps: _vueTypes2['default'].object,
    cancelButtonProps: _vueTypes2['default'].object,
    destroyOnClose: _vueTypes2['default'].bool,
    wrapClassName: _vueTypes2['default'].string,
    maskTransitionName: _vueTypes2['default'].string,
    transitionName: _vueTypes2['default'].string,
    getContainer: _vueTypes2['default'].func,
    zIndex: _vueTypes2['default'].number,
    bodyStyle: _vueTypes2['default'].object,
    maskStyle: _vueTypes2['default'].object,
    mask: _vueTypes2['default'].bool,
    keyboard: _vueTypes2['default'].bool,
    wrapProps: _vueTypes2['default'].object,
    focusTriggerAfterClose: _vueTypes2['default'].bool,
    dialogStyle: _vueTypes2['default'].object.def(function () {
      return {};
    })
  };
  return (0, _propsUtil.initDefaultProps)(props, defaultProps);
};

var destroyFns = exports.destroyFns = [];

exports['default'] = {
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
        return _configConsumerProps.ConfigConsumerProps;
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

      var cancelBtnProps = (0, _propsUtil.mergeProps)({ on: { click: this.handleCancel } }, this.cancelButtonProps || {});
      var okBtnProps = (0, _propsUtil.mergeProps)({
        on: { click: this.handleOk },
        props: {
          type: okType,
          loading: confirmLoading
        }
      }, this.okButtonProps || {});
      return h('div', [h(
        _button2['default'],
        cancelBtnProps,
        [(0, _propsUtil.getComponentFromProp)(this, 'cancelText') || locale.cancelText]
      ), h(
        _button2['default'],
        okBtnProps,
        [(0, _propsUtil.getComponentFromProp)(this, 'okText') || locale.okText]
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

    var defaultFooter = h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Modal',
        defaultLocale: (0, _locale.getConfirmLocale)()
      },
      scopedSlots: { 'default': this.renderFooter }
    });
    var closeIcon = (0, _propsUtil.getComponentFromProp)(this, 'closeIcon');
    var closeIconToRender = h(
      'span',
      { 'class': prefixCls + '-close-x' },
      [closeIcon || h(_icon2['default'], { 'class': prefixCls + '-close-icon', attrs: { type: 'close' }
      })]
    );
    var footer = (0, _propsUtil.getComponentFromProp)(this, 'footer');
    var title = (0, _propsUtil.getComponentFromProp)(this, 'title');
    var dialogProps = {
      props: (0, _extends3['default'])({}, this.$props, {
        getContainer: getContainer === undefined ? getContextPopupContainer : getContainer,
        prefixCls: prefixCls,
        wrapClassName: (0, _classnames2['default'])((0, _defineProperty3['default'])({}, prefixCls + '-centered', !!centered), wrapClassName),
        title: title,
        footer: footer === undefined ? defaultFooter : footer,
        visible: visible,
        mousePosition: mousePosition,
        closeIcon: closeIconToRender
      }),
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
        close: this.handleCancel
      }),
      'class': (0, _propsUtil.getClass)(this),
      style: (0, _propsUtil.getStyle)(this),
      attrs: $attrs
    };
    return h(
      _vcDialog2['default'],
      dialogProps,
      [children]
    );
  }
};