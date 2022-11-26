import _extends from 'babel-runtime/helpers/extends';
import Modal, { destroyFns } from './Modal';
import modalConfirm from './confirm';
import Icon from '../icon';
import Base from '../base';

// export { ActionButtonProps } from './ActionButton'
// export { ModalProps, ModalFuncProps } from './Modal'

var info = function info(props) {
  var config = _extends({
    type: 'info',
    icon: function icon(h) {
      return h(Icon, {
        attrs: { type: 'info-circle' }
      });
    },
    okCancel: false
  }, props);
  return modalConfirm(config);
};

var success = function success(props) {
  var config = _extends({
    type: 'success',
    icon: function icon(h) {
      return h(Icon, {
        attrs: { type: 'check-circle' }
      });
    },
    okCancel: false
  }, props);
  return modalConfirm(config);
};

var error = function error(props) {
  var config = _extends({
    type: 'error',
    icon: function icon(h) {
      return h(Icon, {
        attrs: { type: 'close-circle' }
      });
    },
    okCancel: false
  }, props);
  return modalConfirm(config);
};

var warning = function warning(props) {
  var config = _extends({
    type: 'warning',
    icon: function icon(h) {
      return h(Icon, {
        attrs: { type: 'exclamation-circle' }
      });
    },
    okCancel: false
  }, props);
  return modalConfirm(config);
};
var warn = warning;

var confirm = function confirmFn(props) {
  var config = _extends({
    type: 'confirm',
    okCancel: true
  }, props);
  return modalConfirm(config);
};
Modal.info = info;
Modal.success = success;
Modal.error = error;
Modal.warning = warning;
Modal.warn = warn;
Modal.confirm = confirm;

Modal.destroyAll = function destroyAllFn() {
  while (destroyFns.length) {
    var close = destroyFns.pop();
    if (close) {
      close();
    }
  }
};

/* istanbul ignore next */
Modal.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Modal.name, Modal);
};

export default Modal;