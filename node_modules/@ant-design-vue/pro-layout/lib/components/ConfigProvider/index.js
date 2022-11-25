"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueTypes = _interopRequireDefault(require("ant-design-vue/es/_util/vue-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ProConfigProviderProps = {
  i18nRender: _vueTypes["default"].oneOfType([_vueTypes["default"].func, _vueTypes["default"].bool]).def(false),
  contentWidth: _vueTypes["default"].oneOf(['Fluid', 'Fixed']).def('Fluid'),
  breadcrumbRender: _vueTypes["default"].func
};
var ConfigProvider = {
  name: 'ProConfigProvider',
  props: ProConfigProviderProps,
  provide: function provide() {
    var _self = this;

    return {
      locale: _self.$props.i18nRender,
      contentWidth: _self.$props.contentWidth,
      breadcrumbRender: _self.$props.breadcrumbRender
    };
  },
  render: function render() {
    var $scopedSlots = this.$scopedSlots;
    var children = this.children || $scopedSlots["default"];
    return children();
  }
};
var _default = ConfigProvider;
exports["default"] = _default;