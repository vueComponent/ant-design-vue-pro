"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.HeaderViewProps = void 0;

require("./Header.less");

require("ant-design-vue/es/layout/style");

var _layout = _interopRequireDefault(require("ant-design-vue/es/layout"));

var _vueTypes = _interopRequireDefault(require("ant-design-vue/es/_util/vue-types"));

var _BaseMenu = _interopRequireDefault(require("./components/RouteMenu/BaseMenu"));

var _SiderMenu = require("./components/SiderMenu/SiderMenu");

var _GlobalHeader = _interopRequireWildcard(require("./components/GlobalHeader"));

var _components = require("./components");

var _util = require("./utils/util");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Header = _layout["default"].Header;

var HeaderViewProps = _objectSpread({}, _GlobalHeader.GlobalHeaderProps, _SiderMenu.SiderMenuProps, {
  isMobile: _vueTypes["default"].bool.def(false),
  collapsed: _vueTypes["default"].bool,
  logo: _vueTypes["default"].any,
  hasSiderMenu: _vueTypes["default"].bool,
  autoHideHeader: _vueTypes["default"].bool,
  menuRender: _vueTypes["default"].any,
  headerRender: _vueTypes["default"].any,
  rightContentRender: _vueTypes["default"].any,
  visible: _vueTypes["default"].bool.def(true)
});

exports.HeaderViewProps = HeaderViewProps;

var renderContent = function renderContent(h, props) {
  var isTop = props.layout === 'topmenu';
  var maxWidth = 1200 - 280 - 120;
  var contentWidth = props.contentWidth === 'Fixed';
  var baseCls = 'ant-pro-top-nav-header';
  var logo = props.logo,
      title = props.title,
      theme = props.theme,
      isMobile = props.isMobile,
      headerRender = props.headerRender,
      rightContentRender = props.rightContentRender,
      menuRender = props.menuRender,
      menuHeaderRender = props.menuHeaderRender;
  var rightContentProps = {
    theme: theme,
    isTop: isTop,
    isMobile: isMobile
  };
  var defaultDom = h(_GlobalHeader["default"], {
    props: props
  });

  if (isTop && !isMobile) {
    defaultDom = h("div", {
      "class": [baseCls, theme]
    }, [h("div", {
      "class": ["".concat(baseCls, "-main"), contentWidth ? 'wide' : '']
    }, [menuHeaderRender && h("div", {
      "class": "".concat(baseCls, "-left")
    }, [h("div", {
      "class": "".concat(baseCls, "-logo"),
      key: "logo",
      attrs: {
        id: "logo"
      }
    }, [(0, _SiderMenu.defaultRenderLogoAntTitle)(h, {
      logo: logo,
      title: title,
      menuHeaderRender: menuHeaderRender
    })])]), h("div", {
      "class": "".concat(baseCls, "-menu"),
      style: {
        maxWidth: "".concat(maxWidth, "px"),
        flex: 1
      }
    }, [menuRender && ((0, _util.isFun)(menuRender) && menuRender(h, props) || menuRender) || h(_BaseMenu["default"], {
      props: props
    })]), (0, _util.isFun)(rightContentRender) && rightContentRender(h, rightContentProps) || rightContentRender])]);
  }

  if (headerRender) {
    return headerRender(h, props);
  }

  return defaultDom;
};

var HeaderView = {
  name: 'HeaderView',
  props: HeaderViewProps,
  render: function render(h) {
    var _this$$props = this.$props,
        visible = _this$$props.visible,
        isMobile = _this$$props.isMobile,
        layout = _this$$props.layout,
        collapsed = _this$$props.collapsed,
        collapsedWidth = _this$$props.collapsedWidth,
        siderWidth = _this$$props.siderWidth,
        fixedHeader = _this$$props.fixedHeader,
        autoHideHeader = _this$$props.autoHideHeader,
        hasSiderMenu = _this$$props.hasSiderMenu;
    var props = this.$props;
    var isTop = layout === 'topmenu';
    var needSettingWidth = fixedHeader && hasSiderMenu && !isTop && !isMobile;
    var className = {
      'ant-pro-fixed-header': fixedHeader,
      'ant-pro-top-menu': isTop
    };
    var calcWidth = collapsed ? collapsedWidth ? collapsedWidth : 80 : siderWidth; // 没有 <></> 暂时代替写法

    return visible ? h(_components.VueFragment, [fixedHeader && h(Header), h(Header, {
      style: {
        padding: 0,
        width: needSettingWidth ? "calc(100% - ".concat(calcWidth, "px)") : '100%',
        zIndex: 9,
        right: fixedHeader ? 0 : undefined
      },
      "class": className
    }, [renderContent(h, props)])]) : null;
  }
};
var _default = HeaderView;
exports["default"] = _default;