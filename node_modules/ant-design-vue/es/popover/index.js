import _extends from 'babel-runtime/helpers/extends';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, getComponentFromProp, getListeners } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';

var props = abstractTooltipProps();
var Popover = {
  name: 'APopover',
  props: _extends({}, props, {
    prefixCls: PropTypes.string,
    transitionName: PropTypes.string.def('zoom-big'),
    content: PropTypes.any,
    title: PropTypes.any
  }),
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    getPopupDomNode: function getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    }
  },

  render: function render() {
    var h = arguments[0];
    var title = this.title,
        customizePrefixCls = this.prefixCls,
        $slots = this.$slots;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('popover', customizePrefixCls);

    var props = getOptionProps(this);
    delete props.title;
    delete props.content;
    var tooltipProps = {
      props: _extends({}, props, {
        prefixCls: prefixCls
      }),
      ref: 'tooltip',
      on: getListeners(this)
    };
    return h(
      Tooltip,
      tooltipProps,
      [h(
        'template',
        { slot: 'title' },
        [h('div', [(title || $slots.title) && h(
          'div',
          { 'class': prefixCls + '-title' },
          [getComponentFromProp(this, 'title')]
        ), h(
          'div',
          { 'class': prefixCls + '-inner-content' },
          [getComponentFromProp(this, 'content')]
        )])]
      ), this.$slots['default']]
    );
  }
};

/* istanbul ignore next */
Popover.install = function (Vue) {
  Vue.use(Base);
  Vue.component(Popover.name, Popover);
};

export default Popover;