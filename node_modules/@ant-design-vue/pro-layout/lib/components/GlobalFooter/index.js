"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("./index.less");

var _vueTypes = _interopRequireDefault(require("ant-design-vue/es/_util/vue-types"));

var _propsUtil = require("ant-design-vue/lib/_util/props-util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var GlobalFooterProps = {
  links: _vueTypes["default"].array,
  copyright: _vueTypes["default"].any
};
var GlobalFooter = {
  name: 'GlobalFooter',
  props: GlobalFooterProps,
  render: function render() {
    var h = arguments[0];
    var copyright = (0, _propsUtil.getComponentFromProp)(this, 'copyright');
    var links = (0, _propsUtil.getComponentFromProp)(this, 'links');
    var linksType = (0, _propsUtil.hasProp)(links);
    return h("footer", {
      "class": "ant-pro-global-footer"
    }, [h("div", {
      "class": "ant-pro-global-footer-links"
    }, [linksType && links.map(function (link) {
      return h("a", {
        key: link.key,
        attrs: {
          title: link.key,
          target: link.blankTarget ? '_blank' : '_self',
          href: link.href
        }
      }, [link.title]);
    }) || links]), copyright && h("div", {
      "class": "ant-pro-global-footer-copyright"
    }, [copyright])]);
  }
};
var _default = GlobalFooter;
exports["default"] = _default;