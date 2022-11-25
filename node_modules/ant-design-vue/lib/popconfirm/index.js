'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _abstractTooltipProps = require('../tooltip/abstractTooltipProps');

var _abstractTooltipProps2 = _interopRequireDefault(_abstractTooltipProps);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

var _buttonTypes = require('../button/buttonTypes');

var _buttonTypes2 = _interopRequireDefault(_buttonTypes);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _default2 = require('../locale-provider/default');

var _default3 = _interopRequireDefault(_default2);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var tooltipProps = (0, _abstractTooltipProps2['default'])();
var btnProps = (0, _buttonTypes2['default'])();
var Popconfirm = {
  name: 'APopconfirm',
  props: (0, _extends3['default'])({}, tooltipProps, {
    prefixCls: _vueTypes2['default'].string,
    transitionName: _vueTypes2['default'].string.def('zoom-big'),
    content: _vueTypes2['default'].any,
    title: _vueTypes2['default'].any,
    trigger: tooltipProps.trigger.def('click'),
    okType: btnProps.type.def('primary'),
    disabled: _vueTypes2['default'].bool.def(false),
    okText: _vueTypes2['default'].any,
    cancelText: _vueTypes2['default'].any,
    icon: _vueTypes2['default'].any,
    okButtonProps: _vueTypes2['default'].object,
    cancelButtonProps: _vueTypes2['default'].object
  }),
  mixins: [_BaseMixin2['default']],
  model: {
    prop: 'visible',
    event: 'visibleChange'
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
  data: function data() {
    var props = (0, _propsUtil.getOptionProps)(this);
    var state = { sVisible: false };
    if ('visible' in props) {
      state.sVisible = props.visible;
    }
    if ('defaultVisible' in props) {
      state.sVisible = props.defaultVisible;
    }
    return state;
  },

  methods: {
    onConfirm: function onConfirm(e) {
      this.setVisible(false, e);
      this.$emit('confirm', e);
    },
    onCancel: function onCancel(e) {
      this.setVisible(false, e);
      this.$emit('cancel', e);
    },
    onVisibleChange: function onVisibleChange(sVisible) {
      var disabled = this.$props.disabled;

      if (disabled) {
        return;
      }
      this.setVisible(sVisible);
    },
    setVisible: function setVisible(sVisible, e) {
      if (!(0, _propsUtil.hasProp)(this, 'visible')) {
        this.setState({ sVisible: sVisible });
      }
      this.$emit('visibleChange', sVisible, e);
    },
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    },
    renderOverlay: function renderOverlay(prefixCls, popconfirmLocale) {
      var h = this.$createElement;
      var okType = this.okType,
          okButtonProps = this.okButtonProps,
          cancelButtonProps = this.cancelButtonProps;

      var icon = (0, _propsUtil.getComponentFromProp)(this, 'icon') || h(_icon2['default'], {
        attrs: { type: 'exclamation-circle', theme: 'filled' }
      });
      var cancelBtnProps = (0, _propsUtil.mergeProps)({
        props: {
          size: 'small'
        },
        on: {
          click: this.onCancel
        }
      }, cancelButtonProps);
      var okBtnProps = (0, _propsUtil.mergeProps)({
        props: {
          type: okType,
          size: 'small'
        },
        on: {
          click: this.onConfirm
        }
      }, okButtonProps);
      return h(
        'div',
        { 'class': prefixCls + '-inner-content' },
        [h(
          'div',
          { 'class': prefixCls + '-message' },
          [icon, h(
            'div',
            { 'class': prefixCls + '-message-title' },
            [(0, _propsUtil.getComponentFromProp)(this, 'title')]
          )]
        ), h(
          'div',
          { 'class': prefixCls + '-buttons' },
          [h(
            _button2['default'],
            cancelBtnProps,
            [(0, _propsUtil.getComponentFromProp)(this, 'cancelText') || popconfirmLocale.cancelText]
          ), h(
            _button2['default'],
            okBtnProps,
            [(0, _propsUtil.getComponentFromProp)(this, 'okText') || popconfirmLocale.okText]
          )]
        )]
      );
    }
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];

    var props = (0, _propsUtil.getOptionProps)(this);
    var customizePrefixCls = props.prefixCls;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('popover', customizePrefixCls);

    var otherProps = (0, _omit2['default'])(props, ['title', 'content', 'cancelText', 'okText']);
    var tooltipProps = {
      props: (0, _extends3['default'])({}, otherProps, {
        prefixCls: prefixCls,
        visible: this.sVisible
      }),
      ref: 'tooltip',
      on: {
        visibleChange: this.onVisibleChange
      }
    };
    var overlay = h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Popconfirm',
        defaultLocale: _default3['default'].Popconfirm
      },
      scopedSlots: {
        'default': function _default(popconfirmLocale) {
          return _this.renderOverlay(prefixCls, popconfirmLocale);
        }
      }
    });
    return h(
      _tooltip2['default'],
      tooltipProps,
      [h(
        'template',
        { slot: 'title' },
        [overlay]
      ), this.$slots['default']]
    );
  }
};

/* istanbul ignore next */
Popconfirm.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(Popconfirm.name, Popconfirm);
};

exports['default'] = Popconfirm;