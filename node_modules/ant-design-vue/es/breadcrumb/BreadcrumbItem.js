import PropTypes from '../_util/vue-types';
import { hasProp, getComponentFromProp } from '../_util/props-util';
import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import DropDown from '../dropdown/dropdown';
import Icon from '../icon';

export default {
  name: 'ABreadcrumbItem',
  __ANT_BREADCRUMB_ITEM: true,
  props: {
    prefixCls: PropTypes.string,
    href: PropTypes.string,
    separator: PropTypes.any.def('/'),
    overlay: PropTypes.any
  },
  inject: {
    configProvider: { 'default': function _default() {
        return ConfigConsumerProps;
      } }
  },
  methods: {
    /**
     * if overlay is have
     * Wrap a DropDown
     */
    renderBreadcrumbNode: function renderBreadcrumbNode(breadcrumbItem, prefixCls) {
      var h = this.$createElement;

      var overlay = getComponentFromProp(this, 'overlay');
      if (overlay) {
        return h(
          DropDown,
          {
            attrs: { overlay: overlay, placement: 'bottomCenter' }
          },
          [h(
            'span',
            { 'class': prefixCls + '-overlay-link' },
            [breadcrumbItem, h(Icon, {
              attrs: { type: 'down' }
            })]
          )]
        );
      }
      return breadcrumbItem;
    }
  },
  render: function render() {
    var h = arguments[0];
    var customizePrefixCls = this.prefixCls,
        $slots = this.$slots;

    var getPrefixCls = this.configProvider.getPrefixCls;
    var prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);
    var separator = getComponentFromProp(this, 'separator');
    var children = $slots['default'];
    var link = void 0;
    if (hasProp(this, 'href')) {
      link = h(
        'a',
        { 'class': prefixCls + '-link' },
        [children]
      );
    } else {
      link = h(
        'span',
        { 'class': prefixCls + '-link' },
        [children]
      );
    }
    // wrap to dropDown
    link = this.renderBreadcrumbNode(link, prefixCls);
    if (children) {
      return h('span', [link, separator && separator !== '' && h(
        'span',
        { 'class': prefixCls + '-separator' },
        [separator]
      )]);
    }
    return null;
  }
};