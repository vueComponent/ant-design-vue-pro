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

var notificationInstance = {};
var defaultDuration = 4.5;
var defaultTop = '24px';
var defaultBottom = '24px';
var defaultPlacement = 'topRight';
var defaultGetContainer = function defaultGetContainer() {
  return document.body;
};
var defaultCloseIcon = null;

function setNotificationConfig(options) {
  var duration = options.duration,
      placement = options.placement,
      bottom = options.bottom,
      top = options.top,
      getContainer = options.getContainer,
      closeIcon = options.closeIcon;

  if (duration !== undefined) {
    defaultDuration = duration;
  }
  if (placement !== undefined) {
    defaultPlacement = placement;
  }
  if (bottom !== undefined) {
    defaultBottom = typeof bottom === 'number' ? bottom + 'px' : bottom;
  }
  if (top !== undefined) {
    defaultTop = typeof top === 'number' ? top + 'px' : top;
  }
  if (getContainer !== undefined) {
    defaultGetContainer = getContainer;
  }
  if (closeIcon !== undefined) {
    defaultCloseIcon = closeIcon;
  }
}

function getPlacementStyle(placement) {
  var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultTop;
  var bottom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultBottom;

  var style = void 0;
  switch (placement) {
    case 'topLeft':
      style = {
        left: 0,
        top: top,
        bottom: 'auto'
      };
      break;
    case 'topRight':
      style = {
        right: 0,
        top: top,
        bottom: 'auto'
      };
      break;
    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom: bottom
      };
      break;
    default:
      style = {
        right: 0,
        top: 'auto',
        bottom: bottom
      };
      break;
  }
  return style;
}

function getNotificationInstance(_ref, callback) {
  var prefixCls = _ref.prefixCls,
      _ref$placement = _ref.placement,
      placement = _ref$placement === undefined ? defaultPlacement : _ref$placement,
      _ref$getContainer = _ref.getContainer,
      getContainer = _ref$getContainer === undefined ? defaultGetContainer : _ref$getContainer,
      top = _ref.top,
      bottom = _ref.bottom,
      _ref$closeIcon = _ref.closeIcon,
      _closeIcon = _ref$closeIcon === undefined ? defaultCloseIcon : _ref$closeIcon;

  var cacheKey = prefixCls + '-' + placement;
  if (notificationInstance[cacheKey]) {
    callback(notificationInstance[cacheKey]);
    return;
  }
  _vcNotification2['default'].newInstance({
    prefixCls: prefixCls,
    'class': prefixCls + '-' + placement,
    style: getPlacementStyle(placement, top, bottom),
    getContainer: getContainer,
    closeIcon: function closeIcon(h) {
      var icon = typeof _closeIcon === 'function' ? _closeIcon(h) : _closeIcon;
      var closeIconToRender = h(
        'span',
        { 'class': prefixCls + '-close-x' },
        [icon || h(_icon2['default'], { 'class': prefixCls + '-close-icon', attrs: { type: 'close' }
        })]
      );
      return closeIconToRender;
    }
  }, function (notification) {
    notificationInstance[cacheKey] = notification;
    callback(notification);
  });
}

var typeToIcon = {
  success: 'check-circle-o',
  info: 'info-circle-o',
  error: 'close-circle-o',
  warning: 'exclamation-circle-o'
};

function notice(args) {
  var icon = args.icon,
      type = args.type,
      description = args.description,
      message = args.message,
      btn = args.btn;

  var outerPrefixCls = args.prefixCls || 'ant-notification';
  var prefixCls = outerPrefixCls + '-notice';
  var duration = args.duration === undefined ? defaultDuration : args.duration;

  var iconNode = null;
  if (icon) {
    iconNode = function iconNode(h) {
      return h(
        'span',
        { 'class': prefixCls + '-icon' },
        [typeof icon === 'function' ? icon(h) : icon]
      );
    };
  } else if (type) {
    var iconType = typeToIcon[type];
    iconNode = function iconNode(h) {
      return h(_icon2['default'], { 'class': prefixCls + '-icon ' + prefixCls + '-icon-' + type, attrs: { type: iconType }
      });
    }; // eslint-disable-line
  }
  var placement = args.placement,
      top = args.top,
      bottom = args.bottom,
      getContainer = args.getContainer,
      closeIcon = args.closeIcon;

  getNotificationInstance({
    prefixCls: outerPrefixCls,
    placement: placement,
    top: top,
    bottom: bottom,
    getContainer: getContainer,
    closeIcon: closeIcon
  }, function (notification) {
    notification.notice({
      content: function content(h) {
        return h(
          'div',
          { 'class': iconNode ? prefixCls + '-with-icon' : '' },
          [iconNode && iconNode(h), h(
            'div',
            { 'class': prefixCls + '-message' },
            [!description && iconNode ? h('span', { 'class': prefixCls + '-message-single-line-auto-margin' }) : null, typeof message === 'function' ? message(h) : message]
          ), h(
            'div',
            { 'class': prefixCls + '-description' },
            [typeof description === 'function' ? description(h) : description]
          ), btn ? h(
            'span',
            { 'class': prefixCls + '-btn' },
            [typeof btn === 'function' ? btn(h) : btn]
          ) : null]
        );
      },
      duration: duration,
      closable: true,
      onClose: args.onClose,
      onClick: args.onClick,
      key: args.key,
      style: args.style || {},
      'class': args['class']
    });
  });
}

var api = {
  open: notice,
  close: function close(key) {
    Object.keys(notificationInstance).forEach(function (cacheKey) {
      return notificationInstance[cacheKey].removeNotice(key);
    });
  },

  config: setNotificationConfig,
  destroy: function destroy() {
    Object.keys(notificationInstance).forEach(function (cacheKey) {
      notificationInstance[cacheKey].destroy();
      delete notificationInstance[cacheKey];
    });
  }
};

['success', 'info', 'warning', 'error'].forEach(function (type) {
  api[type] = function (args) {
    return api.open((0, _extends3['default'])({}, args, {
      type: type
    }));
  };
});

api.warn = api.warning;
exports['default'] = api;