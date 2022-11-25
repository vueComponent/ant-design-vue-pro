import _defineProperty from 'babel-runtime/helpers/defineProperty';
import Icon from '../icon';
import classNames from 'classnames';
import BaseMixin from '../_util/BaseMixin';
import PropTypes from '../_util/vue-types';
import getTransitionProps from '../_util/getTransitionProps';
import { getComponentFromProp, isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';

function noop() {}
export var AlertProps = {
  /**
   * Type of Alert styles, options:`success`, `info`, `warning`, `error`
   */
  type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  /** Whether Alert can be closed */
  closable: PropTypes.bool,
  /** Close text to show */
  closeText: PropTypes.any,
  /** Content of Alert */
  message: PropTypes.any,
  /** Additional content of Alert */
  description: PropTypes.any,
  /** Callback when close Alert */
  // onClose?: React.MouseEventHandler<HTMLAnchorElement>;
  /** Trigger when animation ending of Alert */
  afterClose: PropTypes.func.def(noop),
  /** Whether to show icon */
  showIcon: PropTypes.bool,
  iconType: PropTypes.string,
  prefixCls: PropTypes.string,
  banner: PropTypes.bool,
  icon: PropTypes.any
};

var Alert = {
  name: 'AAlert',
  props: AlertProps,
  mixins: [BaseMixin],
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
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

    var closeText = getComponentFromProp(this, 'closeText');
    var description = getComponentFromProp(this, 'description');
    var message = getComponentFromProp(this, 'message');
    var icon = getComponentFromProp(this, 'icon');
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

    var alertCls = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-' + type, true), _defineProperty(_classNames, prefixCls + '-closing', closing), _defineProperty(_classNames, prefixCls + '-with-description', !!description), _defineProperty(_classNames, prefixCls + '-no-icon', !showIcon), _defineProperty(_classNames, prefixCls + '-banner', !!banner), _defineProperty(_classNames, prefixCls + '-closable', closable), _classNames));

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
      ) : h(Icon, {
        attrs: { type: 'close' }
      })]
    ) : null;

    var iconNode = icon && (isValidElement(icon) ? cloneElement(icon, {
      'class': prefixCls + '-icon'
    }) : h(
      'span',
      { 'class': prefixCls + '-icon' },
      [icon]
    )) || h(Icon, { 'class': prefixCls + '-icon', attrs: { type: iconType, theme: iconTheme }
    });

    var transitionProps = getTransitionProps(prefixCls + '-slide-up', {
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
  Vue.use(Base);
  Vue.component(Alert.name, Alert);
};

export default Alert;