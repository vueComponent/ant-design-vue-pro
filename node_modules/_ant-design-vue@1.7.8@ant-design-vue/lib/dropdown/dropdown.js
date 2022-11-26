'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _index = require('../vc-dropdown/src/index');

var _index2 = _interopRequireDefault(_index);

var _dropdownButton = require('./dropdown-button');

var _dropdownButton2 = _interopRequireDefault(_dropdownButton);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _vnode = require('../_util/vnode');

var _propsUtil = require('../_util/props-util');

var _getDropdownProps = require('./getDropdownProps');

var _getDropdownProps2 = _interopRequireDefault(_getDropdownProps);

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DropdownProps = (0, _getDropdownProps2['default'])();
var Dropdown = {
  name: 'ADropdown',
  props: (0, _extends3['default'])({}, DropdownProps, {
    prefixCls: _vueTypes2['default'].string,
    mouseEnterDelay: _vueTypes2['default'].number.def(0.15),
    mouseLeaveDelay: _vueTypes2['default'].number.def(0.1),
    placement: DropdownProps.placement.def('bottomLeft')
  }),
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  provide: function provide() {
    return {
      savePopupRef: this.savePopupRef
    };
  },

  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    savePopupRef: function savePopupRef(ref) {
      this.popupRef = ref;
    },
    getTransitionName: function getTransitionName() {
      var _$props = this.$props,
          _$props$placement = _$props.placement,
          placement = _$props$placement === undefined ? '' : _$props$placement,
          transitionName = _$props.transitionName;

      if (transitionName !== undefined) {
        return transitionName;
      }
      if (placement.indexOf('top') >= 0) {
        return 'slide-down';
      }
      return 'slide-up';
    },
    renderOverlay: function renderOverlay(prefixCls) {
      var h = this.$createElement;

      var overlay = (0, _propsUtil.getComponentFromProp)(this, 'overlay');
      var overlayNode = Array.isArray(overlay) ? overlay[0] : overlay;
      // menu cannot be selectable in dropdown defaultly
      // menu should be focusable in dropdown defaultly
      var overlayProps = overlayNode && (0, _propsUtil.getPropsData)(overlayNode);

      var _ref = overlayProps || {},
          _ref$selectable = _ref.selectable,
          selectable = _ref$selectable === undefined ? false : _ref$selectable,
          _ref$focusable = _ref.focusable,
          focusable = _ref$focusable === undefined ? true : _ref$focusable;

      var expandIcon = h(
        'span',
        { 'class': prefixCls + '-menu-submenu-arrow' },
        [h(_icon2['default'], {
          attrs: { type: 'right' },
          'class': prefixCls + '-menu-submenu-arrow-icon' })]
      );

      var fixedModeOverlay = overlayNode && overlayNode.componentOptions ? (0, _vnode.cloneElement)(overlayNode, {
        props: {
          mode: 'vertical',
          selectable: selectable,
          focusable: focusable,
          expandIcon: expandIcon
        }
      }) : overlay;
      return fixedModeOverlay;
    }
  },

  render: function render() {
    var h = arguments[0];
    var $slots = this.$slots;

    var props = (0, _propsUtil.getOptionProps)(this);
    var customizePrefixCls = props.prefixCls,
        trigger = props.trigger,
        disabled = props.disabled,
        getPopupContainer = props.getPopupContainer;
    var getContextPopupContainer = this.configProvider.getPopupContainer;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('dropdown', customizePrefixCls);

    var dropdownTrigger = (0, _vnode.cloneElement)($slots['default'], {
      'class': prefixCls + '-trigger',
      props: {
        disabled: disabled
      }
    });
    var triggerActions = disabled ? [] : trigger;
    var alignPoint = void 0;
    if (triggerActions && triggerActions.indexOf('contextmenu') !== -1) {
      alignPoint = true;
    }
    var dropdownProps = {
      props: (0, _extends3['default'])({
        alignPoint: alignPoint
      }, props, {
        prefixCls: prefixCls,
        getPopupContainer: getPopupContainer || getContextPopupContainer,
        transitionName: this.getTransitionName(),
        trigger: triggerActions
      }),
      on: (0, _propsUtil.getListeners)(this)
    };
    return h(
      _index2['default'],
      dropdownProps,
      [dropdownTrigger, h(
        'template',
        { slot: 'overlay' },
        [this.renderOverlay(prefixCls)]
      )]
    );
  }
};

Dropdown.Button = _dropdownButton2['default'];
exports['default'] = Dropdown;
exports.DropdownProps = DropdownProps;