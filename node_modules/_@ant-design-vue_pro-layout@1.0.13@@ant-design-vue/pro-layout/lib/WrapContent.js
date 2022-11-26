"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueTypes = _interopRequireDefault(require("ant-design-vue/es/_util/vue-types"));

require("ant-design-vue/es/layout/style");

var _layout = _interopRequireDefault(require("ant-design-vue/es/layout"));

var _configProvider = _interopRequireDefault(require("ant-design-vue/es/config-provider"));

var _GridContent = _interopRequireDefault(require("./components/GridContent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Content = _layout["default"].Content;
var WrapContentProps = {
  isChildrenLayout: _vueTypes["default"].bool,
  location: _vueTypes["default"].any,
  contentHeight: _vueTypes["default"].number,
  contentWidth: _vueTypes["default"].oneOf(['Fluid', 'Fixed']).def('Fluid')
};
var WrapContent = {
  name: 'WrapContent',
  props: WrapContentProps,
  render: function render(h) {
    var _this$$props = this.$props,
        isChildrenLayout = _this$$props.isChildrenLayout,
        contentWidth = _this$$props.contentWidth;
    return h(Content, [h(_configProvider["default"], {
      attrs: {
        getPopupContainer: function getPopupContainer(el, dialogContext) {
          if (isChildrenLayout) {
            return el.parentNode();
          }

          return document.body;
        }
      }
    }, [h("div", {
      "class": "ant-pro-basicLayout-children-content-wrap"
    }, [h(_GridContent["default"], {
      attrs: {
        contentWidth: contentWidth
      }
    }, [this.$slots["default"]])])])]);
  }
};
var _default = WrapContent;
exports["default"] = _default;