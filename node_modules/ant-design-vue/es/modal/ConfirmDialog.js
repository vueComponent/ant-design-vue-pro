import _defineProperty from 'babel-runtime/helpers/defineProperty';
import classNames from 'classnames';
import Icon from '../icon';
import Dialog from './Modal';
import ActionButton from './ActionButton';
import { getConfirmLocale } from './locale';
import warning from '../_util/warning';

export default {
  functional: true,
  render: function render(h, context) {
    var props = context.props;
    var onCancel = props.onCancel,
        onOk = props.onOk,
        close = props.close,
        zIndex = props.zIndex,
        afterClose = props.afterClose,
        visible = props.visible,
        keyboard = props.keyboard,
        centered = props.centered,
        getContainer = props.getContainer,
        maskStyle = props.maskStyle,
        okButtonProps = props.okButtonProps,
        cancelButtonProps = props.cancelButtonProps,
        _props$iconType = props.iconType,
        iconType = _props$iconType === undefined ? 'question-circle' : _props$iconType,
        _props$closable = props.closable,
        closable = _props$closable === undefined ? false : _props$closable;

    warning(!('iconType' in props), 'Modal', 'The property \'iconType\' is deprecated. Use the property \'icon\' instead.');
    var icon = props.icon ? props.icon : iconType;
    var okType = props.okType || 'primary';
    var prefixCls = props.prefixCls || 'ant-modal';
    var contentPrefixCls = prefixCls + '-confirm';
    // 默认为 true，保持向下兼容
    var okCancel = 'okCancel' in props ? props.okCancel : true;
    var width = props.width || 416;
    var style = props.style || {};
    var mask = props.mask === undefined ? true : props.mask;
    // 默认为 false，保持旧版默认行为
    var maskClosable = props.maskClosable === undefined ? false : props.maskClosable;
    var runtimeLocale = getConfirmLocale();
    var okText = props.okText || (okCancel ? runtimeLocale.okText : runtimeLocale.justOkText);
    var cancelText = props.cancelText || runtimeLocale.cancelText;
    var autoFocusButton = props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';
    var transitionName = props.transitionName || 'zoom';
    var maskTransitionName = props.maskTransitionName || 'fade';

    var classString = classNames(contentPrefixCls, contentPrefixCls + '-' + props.type, prefixCls + '-' + props.type, props['class']);

    var cancelButton = okCancel && h(
      ActionButton,
      {
        attrs: {
          actionFn: onCancel,
          closeModal: close,
          autoFocus: autoFocusButton === 'cancel',
          buttonProps: cancelButtonProps
        }
      },
      [cancelText]
    );
    var iconNode = typeof icon === 'string' ? h(Icon, {
      attrs: { type: icon }
    }) : icon(h);

    return h(
      Dialog,
      {
        attrs: {
          prefixCls: prefixCls,

          wrapClassName: classNames(_defineProperty({}, contentPrefixCls + '-centered', !!centered)),

          visible: visible,
          closable: closable,
          title: '',
          transitionName: transitionName,
          footer: '',
          maskTransitionName: maskTransitionName,
          mask: mask,
          maskClosable: maskClosable,
          maskStyle: maskStyle,

          width: width,
          zIndex: zIndex,
          afterClose: afterClose,
          keyboard: keyboard,
          centered: centered,
          getContainer: getContainer
        },
        'class': classString, on: {
          'cancel': function cancel(e) {
            return close({ triggerCancel: true }, e);
          }
        },
        style: style },
      [h(
        'div',
        { 'class': contentPrefixCls + '-body-wrapper' },
        [h(
          'div',
          { 'class': contentPrefixCls + '-body' },
          [iconNode, props.title === undefined ? null : h(
            'span',
            { 'class': contentPrefixCls + '-title' },
            [typeof props.title === 'function' ? props.title(h) : props.title]
          ), h(
            'div',
            { 'class': contentPrefixCls + '-content' },
            [typeof props.content === 'function' ? props.content(h) : props.content]
          )]
        ), h(
          'div',
          { 'class': contentPrefixCls + '-btns' },
          [cancelButton, h(
            ActionButton,
            {
              attrs: {
                type: okType,
                actionFn: onOk,
                closeModal: close,
                autoFocus: autoFocusButton === 'ok',
                buttonProps: okButtonProps
              }
            },
            [okText]
          )]
        )]
      )]
    );
  }
};