'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _confirm = require('./confirm');

var _confirm2 = _interopRequireDefault(_confirm);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// export { ActionButtonProps } from './ActionButton'
// export { ModalProps, ModalFuncProps } from './Modal'

var info = function info(props) {
  var config = (0, _extends3['default'])({
    type: 'info',
    icon: function icon(h) {
      return h(_icon2['default'], {
        attrs: { type: 'info-circle' }
      });
    },
    okCancel: false
  }, props);
  return (0, _confirm2['default'])(config);
};

var success = function success(props) {
  var config = (0, _extends3['default'])({
    type: 'success',
    icon: function icon(h) {
      return h(_icon2['default'], {
        attrs: { type: 'check-circle' }
      });
    },
    okCancel: false
  }, props);
  return (0, _confirm2['default'])(config);
};

var error = function error(props) {
  var config = (0, _extends3['default'])({
    type: 'error',
    icon: function icon(h) {
      return h(_icon2['default'], {
        attrs: { type: 'close-circle' }
      });
    },
    okCancel: false
  }, props);
  return (0, _confirm2['default'])(config);
};

var warning = function warning(props) {
  var config = (0, _extends3['default'])({
    type: 'warning',
    icon: function icon(h) {
      return h(_icon2['default'], {
        attrs: { type: 'exclamation-circle' }
      });
    },
    okCancel: false
  }, props);
  return (0, _confirm2['default'])(config);
};
var warn = warning;

var confirm = function confirmFn(props) {
  var config = (0, _extends3['default'])({
    type: 'confirm',
    okCancel: true
  }, props);
  return (0, _confirm2['default'])(config);
};
_Modal2['default'].info = info;
_Modal2['default'].success = success;
_Modal2['default'].error = error;
_Modal2['default'].warning = warning;
_Modal2['default'].warn = warn;
_Modal2['default'].confirm = confirm;

_Modal2['default'].destroyAll = function destroyAllFn() {
  while (_Modal.destroyFns.length) {
    var close = _Modal.destroyFns.pop();
    if (close) {
      close();
    }
  }
};

/* istanbul ignore next */
_Modal2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Modal2['default'].name, _Modal2['default']);
};

exports['default'] = _Modal2['default'];