'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _PanelContent = require('./PanelContent');

var _PanelContent2 = _interopRequireDefault(_PanelContent);

var _propsUtil = require('../../_util/props-util');

var _commonProps = require('./commonProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'Panel',
  props: (0, _propsUtil.initDefaultProps)((0, _commonProps.panelProps)(), {
    showArrow: true,
    isActive: false,
    destroyInactivePanel: false,
    headerClass: '',
    forceRender: false
  }),
  methods: {
    handleItemClick: function handleItemClick() {
      this.$emit('itemClick', this.panelKey);
    },
    handleKeyPress: function handleKeyPress(e) {
      if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
        this.handleItemClick();
      }
    }
  },
  render: function render() {
    var _headerCls, _itemCls;

    var h = arguments[0];
    var _$props = this.$props,
        prefixCls = _$props.prefixCls,
        headerClass = _$props.headerClass,
        isActive = _$props.isActive,
        showArrow = _$props.showArrow,
        destroyInactivePanel = _$props.destroyInactivePanel,
        disabled = _$props.disabled,
        openAnimation = _$props.openAnimation,
        accordion = _$props.accordion,
        forceRender = _$props.forceRender,
        expandIcon = _$props.expandIcon,
        extra = _$props.extra;
    var $slots = this.$slots;


    var transitionProps = {
      props: (0, _extends3['default'])({
        appear: true,
        css: false
      }),
      on: (0, _extends3['default'])({}, openAnimation)
    };
    var headerCls = (_headerCls = {}, (0, _defineProperty3['default'])(_headerCls, prefixCls + '-header', true), (0, _defineProperty3['default'])(_headerCls, headerClass, headerClass), _headerCls);
    var header = (0, _propsUtil.getComponentFromProp)(this, 'header');
    var itemCls = (_itemCls = {}, (0, _defineProperty3['default'])(_itemCls, prefixCls + '-item', true), (0, _defineProperty3['default'])(_itemCls, prefixCls + '-item-active', isActive), (0, _defineProperty3['default'])(_itemCls, prefixCls + '-item-disabled', disabled), _itemCls);
    var icon = h('i', { 'class': 'arrow' });
    if (showArrow && typeof expandIcon === 'function') {
      icon = expandIcon(this.$props);
    }
    return h(
      'div',
      { 'class': itemCls, attrs: { role: 'tablist' }
      },
      [h(
        'div',
        {
          'class': headerCls,
          on: {
            'click': this.handleItemClick.bind(this),
            'keypress': this.handleKeyPress
          },
          attrs: {
            role: accordion ? 'tab' : 'button',
            tabIndex: disabled ? -1 : 0,
            'aria-expanded': isActive
          }
        },
        [showArrow && icon, header, extra && h(
          'div',
          { 'class': prefixCls + '-extra' },
          [extra]
        )]
      ), h(
        'transition',
        transitionProps,
        [h(
          _PanelContent2['default'],
          {
            directives: [{
              name: 'show',
              value: isActive
            }],
            attrs: {
              prefixCls: prefixCls,
              isActive: isActive,
              destroyInactivePanel: destroyInactivePanel,
              forceRender: forceRender,
              role: accordion ? 'tabpanel' : null
            }
          },
          [$slots['default']]
        )]
      )]
    );
  }
};