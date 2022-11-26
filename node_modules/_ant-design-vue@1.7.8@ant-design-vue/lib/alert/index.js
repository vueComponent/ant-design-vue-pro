'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertProps = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _getTransitionProps = require('../_util/getTransitionProps');

var _getTransitionProps2 = _interopRequireDefault(_getTransitionProps);

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
var AlertProps = exports.AlertProps = {
  /**
   * Type of Alert styles, options:`success`, `info`, `warning`, `error`
   */
  type: _vueTypes2['default'].oneOf(['success', 'info', 'warning', 'error']),
  /** Whether Alert can be closed */
  closable: _vueTypes2['default'].bool,
  /** Close text to show */
  closeText: _vueTypes2['default'].any,
  /** Content of Alert */
  message: _vueTypes2['default'].any,
  /** Additional content of Alert */
  description: _vueTypes2['default'].any,
  /** Callback when close Alert */
  // onClose?: React.MouseEventHandler<HTMLAnchorElement>;
  /** Trigger when animation ending of Alert */
  afterClose: _vueTypes2['default'].func.def(noop),
  /** Whether to show icon */
  showIcon: _vueTypes2['default'].bool,
  iconType: _vueTypes2['default'].string,
  prefixCls: _vueTypes2['default'].string,
  banner: _vueTypes2['default'].bool,
  icon: _vueTypes2['default'].any
};

var Alert = {
  name: 'AAlert',
  props: AlertProps,
  mixins: [_BaseMixin2['default']],
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      closing: false,
      closed: false
    };
  },

  methods: {
    handleClose: function handleClose(e) {
      e.preventDefault();
      var dom = this.$el;
      dom.style.height = dom.offsetHeight + 'px';
      // Magic code
      // 重复一次后才能正确设置 height
      dom.style.height = dom.offsetHeight + 'px';

      this.setState({
        closing: true
      });
      this.$emit('close', e);
    },
    animationEnd: function animationEnd() {
      this.setState({
        closing: false,
        closed: true
      });
      this.afterClose();
    }
  },

  render: function render() {
    var _classNames;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        banner = this.banner,
        closing = this.closing,
        closed = this.closed;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('alert', customizePrefixCls);

    var closable = this.closable,
        type = this.type,
        showIcon = this.showIcon,
        iconType = this.iconType;

    var closeText = (0, _propsUtil.getComponentFromProp)(this, 'closeText');
    var description = (0, _propsUtil.getComponentFromProp)(this, 'description');
    var message = (0, _propsUtil.getComponentFromProp)(this, 'message');
    var icon = (0, _propsUtil.getComponentFromProp)(this, 'icon');
    // banner模式默认有 Icon
    showIcon = banner && showIcon === undefined ? true : showIcon;
    // banner模式默认为警告
    type = banner && type === undefined ? 'warning' : type || 'info';
    var iconTheme = 'filled';

    if (!iconType) {
      switch (type) {
        case 'success':
          iconType = 'check-circle';
          break;
        case 'info':
          iconType = 'info-circle';
          break;
        case 'error':
          iconType = 'close-circle';
          break;
        case 'warning':
          iconType = 'exclamation-circle';
          break;
        default:
          iconType = 'default';
      }

      // use outline icon in alert with description
      if (description) {
        iconTheme = 'outlined';
      }
    }

    // closeable when closeText is assigned
    if (closeText) {
      closable = true;
    }

    var alertCls = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-' + type, true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-closing', closing), (0, _defineProperty3['default'])(_classNames, prefixCls + '-with-description', !!description), (0, _defineProperty3['default'])(_classNames, prefixCls + '-no-icon', !showIcon), (0, _defineProperty3['default'])(_classNames, prefixCls + '-banner', !!banner), (0, _defineProperty3['default'])(_classNames, prefixCls + '-closable', closable), _classNames));

    var closeIcon = closable ? h(
      'button',
      {
        attrs: {
          type: 'button',

          tabIndex: 0
        },
        on: {
          'click': this.handleClose
        },

        'class': prefixCls + '-close-icon' },
      [closeText ? h(
        'span',
        { 'class': prefixCls + '-close-text' },
        [closeText]
      ) : h(_icon2['default'], {
        attrs: { type: 'close' }
      })]
    ) : null;

    var iconNode = icon && ((0, _propsUtil.isValidElement)(icon) ? (0, _vnode.cloneElement)(icon, {
      'class': prefixCls + '-icon'
    }) : h(
      'span',
      { 'class': prefixCls + '-icon' },
      [icon]
    )) || h(_icon2['default'], { 'class': prefixCls + '-icon', attrs: { type: iconType, theme: iconTheme }
    });

    var transitionProps = (0, _getTransitionProps2['default'])(prefixCls + '-slide-up', {
      appear: false,
      afterLeave: this.animationEnd
    });
    return closed ? null : h(
      'transition',
      transitionProps,
      [h(
        'div',
        {
          directives: [{
            name: 'show',
            value: !closing
          }],
          'class': alertCls, attrs: { 'data-show': !closing }
        },
        [showIcon ? iconNode : null, h(
          'span',
          { 'class': prefixCls + '-message' },
          [message]
        ), h(
          'span',
          { 'class': prefixCls + '-description' },
          [description]
        ), closeIcon]
      )]
    );
  }
};

/* istanbul ignore next */
Alert.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Alert.name, Alert);
};

exports['default'] = Alert;