'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vcNotification = require('../vc-notification');

var _vcNotification2 = _interopRequireDefault(_vcNotification);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var defaultDuration = 3;
var defaultTop = void 0;
var messageInstance = void 0;
var key = 1;
var prefixCls = 'ant-message';
var transitionName = 'move-up';
var getContainer = function getContainer() {
  return document.body;
};
var maxCount = void 0;

function getMessageInstance(callback) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  _vcNotification2['default'].newInstance({
    prefixCls: prefixCls,
    transitionName: transitionName,
    style: { top: defaultTop }, // 覆盖原来的样式
    getContainer: getContainer,
    maxCount: maxCount
  }, function (instance) {
    if (messageInstance) {
      callback(messageInstance);
      return;
    }
    messageInstance = instance;
    callback(instance);
  });
}

// type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

function notice(args) {
  var duration = args.duration !== undefined ? args.duration : defaultDuration;
  var iconType = {
    info: 'info-circle',
    success: 'check-circle',
    error: 'close-circle',
    warning: 'exclamation-circle',
    loading: 'loading'
  }[args.type];

  var target = args.key || key++;
  var closePromise = new Promise(function (resolve) {
    var callback = function callback() {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }
      return resolve(true);
    };
    getMessageInstance(function (instance) {
      instance.notice({
        key: target,
        duration: duration,
        style: {},
        content: function content(h) {
          var iconNode = h(_icon2['default'], {
            attrs: { type: iconType, theme: iconType === 'loading' ? 'outlined' : 'filled' }
          });
          var switchIconNode = iconType ? iconNode : '';
          return h(
            'div',
            {
              'class': prefixCls + '-custom-content' + (args.type ? ' ' + prefixCls + '-' + args.type : '')
            },
            [args.icon ? typeof args.icon === 'function' ? args.icon(h) : args.icon : switchIconNode, h('span', [typeof args.content === 'function' ? args.content(h) : args.content])]
          );
        },
        onClose: callback
      });
    });
  });
  var result = function result() {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };
  result.then = function (filled, rejected) {
    return closePromise.then(filled, rejected);
  };
  result.promise = closePromise;
  return result;
}

// type ConfigContent = React.ReactNode | string;
// type ConfigDuration = number | (() => void);
// export type ConfigOnClose = () => void;

function isArgsProps(content) {
  return Object.prototype.toString.call(content) === '[object Object]' && !!content.content;
}

// export interface ConfigOptions {
//   top?: number;
//   duration?: number;
//   prefixCls?: string;
//   getContainer?: () => HTMLElement;
//   transitionName?: string;
// }

var api = {
  open: notice,
  config: function config(options) {
    if (options.top !== undefined) {
      defaultTop = options.top;
      messageInstance = null; // delete messageInstance for new defaultTop
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }
    if (options.prefixCls !== undefined) {
      prefixCls = options.prefixCls;
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer;
    }
    if (options.transitionName !== undefined) {
      transitionName = options.transitionName;
      messageInstance = null; // delete messageInstance for new transitionName
    }
    if (options.maxCount !== undefined) {
      maxCount = options.maxCount;
      messageInstance = null;
    }
  },
  destroy: function destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  }
};

['success', 'info', 'warning', 'error', 'loading'].forEach(function (type) {
  api[type] = function (content, duration, onClose) {
    if (isArgsProps(content)) {
      return api.open((0, _extends3['default'])({}, content, { type: type }));
    }
    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }
    return api.open({ content: content, duration: duration, type: type, onClose: onClose });
  };
});

api.warn = api.warning;

exports['default'] = api;