import _extends from 'babel-runtime/helpers/extends';
import Vue from 'vue';
import ConfirmDialog from './ConfirmDialog';
import { destroyFns } from './Modal';
import Base from '../base';
import Omit from 'omit.js';

export default function confirm(config) {
  var div = document.createElement('div');
  var el = document.createElement('div');
  div.appendChild(el);
  document.body.appendChild(div);
  var currentConfig = _extends({}, Omit(config, ['parentContext']), { close: close, visible: true });

  var confirmDialogInstance = null;
  var confirmDialogProps = { props: {} };
  function close() {
    destroy.apply(undefined, arguments);
  }
  function update(newConfig) {
    currentConfig = _extends({}, currentConfig, newConfig);
    confirmDialogProps.props = currentConfig;
  }
  function destroy() {
    if (confirmDialogInstance && div.parentNode) {
      confirmDialogInstance.$destroy();
      confirmDialogInstance = null;
      div.parentNode.removeChild(div);
    }

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var triggerCancel = args.some(function (param) {
      return param && param.triggerCancel;
    });
    if (config.onCancel && triggerCancel) {
      config.onCancel.apply(config, args);
    }
    for (var i = 0; i < destroyFns.length; i++) {
      var fn = destroyFns[i];
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }
  }

  function render(props) {
    confirmDialogProps.props = props;
    var V = Base.Vue || Vue;
    return new V({
      el: el,
      parent: config.parentContext,
      data: function data() {
        return { confirmDialogProps: confirmDialogProps };
      },
      render: function render() {
        var h = arguments[0];

        // 先解构，避免报错，原因不详
        var cdProps = _extends({}, this.confirmDialogProps);
        return h(ConfirmDialog, cdProps);
      }
    });
  }

  confirmDialogInstance = render(currentConfig);
  destroyFns.push(close);
  return {
    destroy: close,
    update: update
  };
}