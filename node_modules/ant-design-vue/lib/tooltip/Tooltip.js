'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vnode = require('../_util/vnode');

var _vcTooltip = require('../vc-tooltip');

var _vcTooltip2 = _interopRequireDefault(_vcTooltip);

var _placements = require('./placements');

var _placements2 = _interopRequireDefault(_placements);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _abstractTooltipProps = require('./abstractTooltipProps');

var _abstractTooltipProps2 = _interopRequireDefault(_abstractTooltipProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var splitObject = function splitObject(obj, keys) {
  var picked = {};
  var omitted = (0, _extends3['default'])({}, obj);
  keys.forEach(function (key) {
    if (obj && key in obj) {
      picked[key] = obj[key];
      delete omitted[key];
    }
  });
  return { picked: picked, omitted: omitted };
};
var props = (0, _abstractTooltipProps2['default'])();
exports['default'] = {
  name: 'ATooltip',
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  props: (0, _extends3['default'])({}, props, {
    title: _vueTypes2['default'].any
  }),
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  data: function data() {
    return {
      sVisible: !!this.$props.visible || !!this.$props.defaultVisible
    };
  },

  watch: {
    visible: function visible(val) {
      this.sVisible = val;
    }
  },
  methods: {
    onVisibleChange: function onVisibleChange(visible) {
      if (!(0, _propsUtil.hasProp)(this, 'visible')) {
        this.sVisible = this.isNoTitle() ? false : visible;
      }
      if (!this.isNoTitle()) {
        this.$emit('visibleChange', visible);
      }
    },
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    },
    getPlacements: function getPlacements() {
      var _$props = this.$props,
          builtinPlacements = _$props.builtinPlacements,
          arrowPointAtCenter = _$props.arrowPointAtCenter,
          autoAdjustOverflow = _$props.autoAdjustOverflow;

      return builtinPlacements || (0, _placements2['default'])({
        arrowPointAtCenter: arrowPointAtCenter,
        verticalArrowShift: 8,
        autoAdjustOverflow: autoAdjustOverflow
      });
    },


    // Fix Tooltip won't hide at disabled button
    // mouse events don't trigger at disabled button in Chrome
    // https://github.com/react-component/tooltip/issues/18
    getDisabledCompatibleChildren: function getDisabledCompatibleChildren(ele) {
      var h = this.$createElement;

      var options = ele.componentOptions && ele.componentOptions.Ctor.options || {};

      if ((options.__ANT_BUTTON === true || options.__ANT_SWITCH === true || options.__ANT_CHECKBOX === true) && (ele.componentOptions.propsData.disabled || ele.componentOptions.propsData.disabled === '') || ele.tag === 'button' && ele.data && ele.data.attrs && ele.data.attrs.disabled !== undefined) {
        // Pick some layout related style properties up to span
        // Prevent layout bugs like https://github.com/ant-design/ant-design/issues/5254
        var _splitObject = splitObject((0, _propsUtil.getStyle)(ele), ['position', 'left', 'right', 'top', 'bottom', 'float', 'display', 'zIndex']),
            picked = _splitObject.picked,
            omitted = _splitObject.omitted;

        var spanStyle = (0, _extends3['default'])({
          display: 'inline-block' }, picked, {
          cursor: 'not-allowed',
          width: ele.componentOptions.propsData.block ? '100%' : null
        });
        var buttonStyle = (0, _extends3['default'])({}, omitted, {
          pointerEvents: 'none'
        });
        var spanCls = (0, _propsUtil.getClass)(ele);
        var child = (0, _vnode.cloneElement)(ele, {
          style: buttonStyle,
          'class': null
        });
        return h(
          'span',
          { style: spanStyle, 'class': spanCls },
          [child]
        );
      }
      return ele;
    },
    isNoTitle: function isNoTitle() {
      var title = (0, _propsUtil.getComponentFromProp)(this, 'title');
      return !title && title !== 0;
    },
    getOverlay: function getOverlay() {
      var title = (0, _propsUtil.getComponentFromProp)(this, 'title');
      if (title === 0) {
        return title;
      }
      return title || '';
    },


    // 动态设置动画点
    onPopupAlign: function onPopupAlign(domNode, align) {
      var placements = this.getPlacements();
      // 当前返回的位置
      var placement = Object.keys(placements).filter(function (key) {
        return placements[key].points[0] === align.points[0] && placements[key].points[1] === align.points[1];
      })[0];
      if (!placement) {
        return;
      }
      // 根据当前坐标设置动画点
      var rect = domNode.getBoundingClientRect();
      var transformOrigin = {
        top: '50%',
        left: '50%'
      };
      if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
        transformOrigin.top = rect.height - align.offset[1] + 'px';
      } else if (placement.indexOf('Top') >= 0 || placement.indexOf('bottom') >= 0) {
        transformOrigin.top = -align.offset[1] + 'px';
      }
      if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
        transformOrigin.left = rect.width - align.offset[0] + 'px';
      } else if (placement.indexOf('right') >= 0 || placement.indexOf('Left') >= 0) {
        transformOrigin.left = -align.offset[0] + 'px';
      }
      domNode.style.transformOrigin = transformOrigin.left + ' ' + transformOrigin.top;
    }
  },

  render: function render() {
    var h = arguments[0];
    var $props = this.$props,
        $data = this.$data,
        $slots = this.$slots;
    var customizePrefixCls = $props.prefixCls,
        openClassName = $props.openClassName,
        getPopupContainer = $props.getPopupContainer;
    var getContextPopupContainer = this.configProvider.getPopupContainer;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('tooltip', customizePrefixCls);
    var children = ($slots['default'] || []).filter(function (c) {
      return c.tag || c.text.trim() !== '';
    });
    children = children.length === 1 ? children[0] : children;
    var sVisible = $data.sVisible;
    // Hide tooltip when there is no title
    if (!(0, _propsUtil.hasProp)(this, 'visible') && this.isNoTitle()) {
      sVisible = false;
    }
    if (!children) {
      return null;
    }
    var child = this.getDisabledCompatibleChildren((0, _propsUtil.isValidElement)(children) ? children : h('span', [children]));
    var childCls = (0, _defineProperty3['default'])({}, openClassName || prefixCls + '-open', true);
    var tooltipProps = {
      props: (0, _extends3['default'])({}, $props, {
        prefixCls: prefixCls,
        getTooltipContainer: getPopupContainer || getContextPopupContainer,
        builtinPlacements: this.getPlacements(),
        overlay: this.getOverlay(),
        visible: sVisible
      }),
      ref: 'tooltip',
      on: (0, _extends3['default'])({}, (0, _propsUtil.getListeners)(this), {
        visibleChange: this.onVisibleChange,
        popupAlign: this.onPopupAlign
      })
    };
    return h(
      _vcTooltip2['default'],
      tooltipProps,
      [sVisible ? (0, _vnode.cloneElement)(child, { 'class': childCls }) : child]
    );
  }
};