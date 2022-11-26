import _extends from 'babel-runtime/helpers/extends';
import { SubMenu as VcSubMenu } from '../vc-menu';
import { getListeners } from '../_util/props-util';
import classNames from 'classnames';

export default {
  name: 'ASubMenu',
  isSubMenu: true,
  props: _extends({}, VcSubMenu.props),
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
      props: _extends({}, this.$props, {
        popupClassName: classNames(rootPrefixCls + '-' + antdMenuTheme, popupClassName)
      }),
      ref: 'subMenu',
      on: getListeners(this),
      scopedSlots: $scopedSlots
    };
    var slotsKey = Object.keys($slots);
    return h(
      VcSubMenu,
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