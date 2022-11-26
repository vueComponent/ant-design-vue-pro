"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.GlobalHeaderProps = void 0;

require("./index.less");

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _vueTypes = _interopRequireDefault(require("ant-design-vue/es/_util/vue-types"));

var _util = require("../../utils/util");

require("ant-design-vue/es/icon/style");

var _icon = _interopRequireDefault(require("ant-design-vue/es/icon"));

var _SiderMenu = require("../SiderMenu/SiderMenu");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var GlobalHeaderProps = {
  collapsed: _vueTypes["default"].bool,
  handleCollapse: _vueTypes["default"].func,
  isMobile: _vueTypes["default"].bool.def(false),
  fixedHeader: _vueTypes["default"].bool.def(false),
  logo: _vueTypes["default"].any,
  menuRender: _vueTypes["default"].any,
  collapsedButtonRender: _vueTypes["default"].any,
  headerContentRender: _vueTypes["default"].any,
  rightContentRender: _vueTypes["default"].any
};
exports.GlobalHeaderProps = GlobalHeaderProps;

var defaultRenderCollapsedButton = function defaultRenderCollapsedButton(h, collapsed) {
  return h(_icon["default"], {
    attrs: {
      type: collapsed ? 'menu-unfold' : 'menu-fold'
    }
  });
};

var GlobalHeader = {
  name: 'GlobalHeader',
  props: GlobalHeaderProps,
  render: function render(h) {
    var _this = this;

    var _this$$props = this.$props,
        isMobile = _this$$props.isMobile,
        logo = _this$$props.logo,
        rightContentRender = _this$$props.rightContentRender,
        headerContentRender = _this$$props.headerContentRender;

    var toggle = function toggle() {
      var _this$$props2 = _this.$props,
          collapsed = _this$$props2.collapsed,
          handleCollapse = _this$$props2.handleCollapse;
      if (handleCollapse) handleCollapse(!collapsed);

      _this.triggerResizeEvent();
    };

    var renderCollapsedButton = function renderCollapsedButton() {
      var _this$$props3 = _this.$props,
          collapsed = _this$$props3.collapsed,
          _this$$props3$collaps = _this$$props3.collapsedButtonRender,
          collapsedButtonRender = _this$$props3$collaps === void 0 ? defaultRenderCollapsedButton : _this$$props3$collaps,
          menuRender = _this$$props3.menuRender;

      if (collapsedButtonRender !== false && menuRender !== false) {
        return h("span", {
          "class": "ant-pro-global-header-trigger",
          on: {
            "click": toggle
          }
        }, [(0, _util.isFun)(collapsedButtonRender) && collapsedButtonRender(h, collapsed) || collapsedButtonRender]);
      }

      return null;
    };

    var headerCls = 'ant-pro-global-header';
    return h("div", {
      "class": headerCls
    }, [isMobile && h("a", {
      "class": "".concat(headerCls, "-logo"),
      key: "logo",
      attrs: {
        href: '/'
      }
    }, [(0, _SiderMenu.defaultRenderLogo)(h, logo)]), renderCollapsedButton(), headerContentRender && h("div", {
      "class": "".concat(headerCls, "-content")
    }, [(0, _util.isFun)(headerContentRender) && headerContentRender(h, this.$props) || headerContentRender]), (0, _util.isFun)(rightContentRender) && rightContentRender(h, this.$props) || rightContentRender]);
  },
  methods: {
    triggerResizeEvent: (0, _debounce["default"])(function () {
      _util.inBrowser && (0, _util.triggerEvent)(window, 'resize');
    })
  },
  beforeDestroy: function beforeDestroy() {
    this.triggerResizeEvent.cancel && this.triggerResizeEvent.cancel();
  }
};
var _default = GlobalHeader;
exports["default"] = _default;