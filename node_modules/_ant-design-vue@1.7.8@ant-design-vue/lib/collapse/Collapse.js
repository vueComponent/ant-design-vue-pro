'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _openAnimation = require('../_util/openAnimation');

var _openAnimation2 = _interopRequireDefault(_openAnimation);

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

var _vcCollapse = require('../vc-collapse');

var _vcCollapse2 = _interopRequireDefault(_vcCollapse);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _configConsumerProps = require('../config-provider/configConsumerProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ACollapse',
  model: {
    prop: 'activeKey',
    event: 'change'
  },
  props: (0, _propsUtil.initDefaultProps)((0, _vcCollapse.collapseProps)(), {
    bordered: true,
    openAnimation: _openAnimation2['default'],
    expandIconPosition: 'left'
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    renderExpandIcon: function renderExpandIcon(panelProps, prefixCls) {
      var h = this.$createElement;

      var expandIcon = (0, _propsUtil.getComponentFromProp)(this, 'expandIcon', panelProps);
      var icon = expandIcon || h(_icon2['default'], {
        attrs: { type: 'right', rotate: panelProps.isActive ? 90 : undefined }
      });
      return (0, _propsUtil.isValidElement)(Array.isArray(expandIcon) ? icon[0] : icon) ? (0, _vnode.cloneElement)(icon, {
        'class': prefixCls + '-arrow'
      }) : icon;
    }
  },
  render: function render() {
    var _collapseClassName,
        _this = this;

    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        bordered = this.bordered,
        expandIconPosition = this.expandIconPosition;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('collapse', customizePrefixCls);

    var collapseClassName = (_collapseClassName = {}, (0, _defineProperty3['default'])(_collapseClassName, prefixCls + '-borderless', !bordered), (0, _defineProperty3['default'])(_collapseClassName, prefixCls + '-icon-position-' + expandIconPosition, true), _collapseClassName);
    var rcCollapeProps = {
      props: (0, _extends3['default'])({}, (0, _propsUtil.getOptionProps)(this), {
        prefixCls: prefixCls,
        expandIcon: function expandIcon(panelProps) {
          return _this.renderExpandIcon(panelProps, prefixCls);
        }
      }),
      'class': collapseClassName,
      on: (0, _propsUtil.getListeners)(this)
    };
    return h(
      _vcCollapse2['default'],
      rcCollapeProps,
      [this.$slots['default']]
    );
  }
};