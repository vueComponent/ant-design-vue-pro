import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _extends from 'babel-runtime/helpers/extends';
import { Item, itemProps } from '../vc-menu';
import { getOptionProps, getListeners } from '../_util/props-util';
import Tooltip from '../tooltip';
function noop() {}
export default {
  name: 'MenuItem',
  inheritAttrs: false,
  props: itemProps,
  inject: {
    getInlineCollapsed: { 'default': function _default() {
        return noop;
      } },
    layoutSiderContext: { 'default': function _default() {
        return {};
      } }
  },
  isMenuItem: true,
  methods: {
    onKeyDown: function onKeyDown(e) {
      this.$refs.menuItem.onKeyDown(e);
    }
  },
  render: function render() {
    var h = arguments[0];

    var props = getOptionProps(this);
    var level = props.level,
        title = props.title,
        rootPrefixCls = props.rootPrefixCls;
    var getInlineCollapsed = this.getInlineCollapsed,
        $slots = this.$slots,
        attrs = this.$attrs;

    var inlineCollapsed = getInlineCollapsed();
    var tooltipTitle = title;
    if (typeof title === 'undefined') {
      tooltipTitle = level === 1 ? $slots['default'] : '';
    } else if (title === false) {
      tooltipTitle = '';
    }
    var tooltipProps = {
      title: tooltipTitle
    };
    var siderCollapsed = this.layoutSiderContext.sCollapsed;
    if (!siderCollapsed && !inlineCollapsed) {
      tooltipProps.title = null;
      // Reset `visible` to fix control mode tooltip display not correct
      // ref: https://github.com/ant-design/ant-design/issues/16742
      tooltipProps.visible = false;
    }

    var itemProps = {
      props: _extends({}, props, {
        title: title
      }),
      attrs: attrs,
      on: getListeners(this)
    };
    var toolTipProps = {
      props: _extends({}, tooltipProps, {
        placement: 'right',
        overlayClassName: rootPrefixCls + '-inline-collapsed-tooltip'
      })
    };
    return h(
      Tooltip,
      toolTipProps,
      [h(
        Item,
        _mergeJSXProps([itemProps, { ref: 'menuItem' }]),
        [$slots['default']]
      )]
    );
  }
};