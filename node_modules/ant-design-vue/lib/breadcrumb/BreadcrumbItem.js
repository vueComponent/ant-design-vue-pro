'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../_util/props-util');

var _configConsumerProps = require('../config-provider/configConsumerProps');

var _dropdown = require('../dropdown/dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'ABreadcrumbItem',
  __ANT_BREADCRUMB_ITEM: true,
  props: {
    prefixCls: _vueTypes2['default'].string,
    href: _vueTypes2['default'].string,
    separator: _vueTypes2['default'].any.def('/'),
    overlay: _vueTypes2['default'].any
  },
  inject: {
    configProvider: { 'default': function _default() {
        return _configConsumerProps.ConfigConsumerProps;
      } }
  },
  methods: {
    /**
     * if overlay is have
     * Wrap a DropDown
     */
    renderBreadcrumbNode: function renderBreadcrumbNode(breadcrumbItem, prefixCls) {
      var h = this.$createElement;

      var overlay = (0, _propsUtil.getComponentFromProp)(this, 'overlay');
      if (overlay) {
        return h(
          _dropdown2['default'],
          {
            attrs: { overlay: overlay, placement: 'bottomCenter' }
          },
          [h(
            'span',
            { 'class': prefixCls + '-overlay-link' },
            [breadcrumbItem, h(_icon2['default'], {
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
    var separator = (0, _propsUtil.getComponentFromProp)(this, 'separator');
    var children = $slots['default'];
    var link = void 0;
    if ((0, _propsUtil.hasProp)(this, 'href')) {
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