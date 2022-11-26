'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperVueJsxMergeProps = require('babel-helper-vue-jsx-merge-props');

var _babelHelperVueJsxMergeProps2 = _interopRequireDefault(_babelHelperVueJsxMergeProps);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vcMenu = require('../vc-menu');

var _propsUtil = require('../_util/props-util');

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}
exports['default'] = {
  name: 'MenuItem',
  inheritAttrs: false,
  props: _vcMenu.itemProps,
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

    var props = (0, _propsUtil.getOptionProps)(this);
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
      props: (0, _extends3['default'])({}, props, {
        title: title
      }),
      attrs: attrs,
      on: (0, _propsUtil.getListeners)(this)
    };
    var toolTipProps = {
      props: (0, _extends3['default'])({}, tooltipProps, {
        placement: 'right',
        overlayClassName: rootPrefixCls + '-inline-collapsed-tooltip'
      })
    };
    return h(
      _tooltip2['default'],
      toolTipProps,
      [h(
        _vcMenu.Item,
        (0, _babelHelperVueJsxMergeProps2['default'])([itemProps, { ref: 'menuItem' }]),
        [$slots['default']]
      )]
    );
  }
};