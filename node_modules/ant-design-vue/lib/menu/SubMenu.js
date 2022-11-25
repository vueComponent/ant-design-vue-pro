'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vcMenu = require('../vc-menu');

var _propsUtil = require('../_util/props-util');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ASubMenu',
  isSubMenu: true,
  props: (0, _extends3['default'])({}, _vcMenu.SubMenu.props),
  inject: {
    menuPropsContext: { 'default': function _default() {
        return {};
      } }
  },
  methods: {
    onKeyDown: function onKeyDown(e) {
      this.$refs.subMenu.onKeyDown(e);
    }
  },

  render: function render() {
    var h = arguments[0];
    var $slots = this.$slots,
        $scopedSlots = this.$scopedSlots;
    var _$props = this.$props,
        rootPrefixCls = _$props.rootPrefixCls,
        popupClassName = _$props.popupClassName;
    var antdMenuTheme = this.menuPropsContext.theme;

    var props = {
      props: (0, _extends3['default'])({}, this.$props, {
        popupClassName: (0, _classnames2['default'])(rootPrefixCls + '-' + antdMenuTheme, popupClassName)
      }),
      ref: 'subMenu',
      on: (0, _propsUtil.getListeners)(this),
      scopedSlots: $scopedSlots
    };
    var slotsKey = Object.keys($slots);
    return h(
      _vcMenu.SubMenu,
      props,
      [slotsKey.length ? slotsKey.map(function (name) {
        return h(
          'template',
          { slot: name },
          [$slots[name]]
        );
      }) : null]
    );
  }
};