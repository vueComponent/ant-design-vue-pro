import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PanelContent from './PanelContent';
import { initDefaultProps, getComponentFromProp } from '../../_util/props-util';
import { panelProps } from './commonProps';

export default {
  name: 'Panel',
  props: initDefaultProps(panelProps(), {
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
      props: _extends({
        appear: true,
        css: false
      }),
      on: _extends({}, openAnimation)
    };
    var headerCls = (_headerCls = {}, _defineProperty(_headerCls, prefixCls + '-header', true), _defineProperty(_headerCls, headerClass, headerClass), _headerCls);
    var header = getComponentFromProp(this, 'header');
    var itemCls = (_itemCls = {}, _defineProperty(_itemCls, prefixCls + '-item', true), _defineProperty(_itemCls, prefixCls + '-item-active', isActive), _defineProperty(_itemCls, prefixCls + '-item-disabled', disabled), _itemCls);
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
          PanelContent,
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