"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.BasicLayoutProps = void 0;

var _babelHelperVueJsxMergeProps = _interopRequireDefault(require("babel-helper-vue-jsx-merge-props"));

require("./BasicLayout.less");

var _vueTypes = _interopRequireDefault(require("ant-design-vue/es/_util/vue-types"));

require("ant-design-vue/es/layout/style");

var _layout = _interopRequireDefault(require("ant-design-vue/es/layout"));

var _vueContainerQuery = require("vue-container-query");

var _components = require("./components");

var _util = require("./utils/util");

var _SiderMenu = require("./components/SiderMenu");

var _Header = _interopRequireWildcard(require("./Header"));

var _WrapContent = _interopRequireDefault(require("./WrapContent"));

var _ConfigProvider = _interopRequireDefault(require("./components/ConfigProvider"));

var _PageHeaderWrapper = _interopRequireDefault(require("./components/PageHeaderWrapper"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BasicLayoutProps = _objectSpread({}, _SiderMenu.SiderMenuProps, _Header.HeaderViewProps, {
  contentWidth: _vueTypes["default"].oneOf(['Fluid', 'Fixed']).def('Fluid'),
  // contentWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).def('Fluid'),
  locale: _vueTypes["default"].oneOfType([_vueTypes["default"].string, _vueTypes["default"].bool]).def('en-US'),
  breadcrumbRender: _vueTypes["default"].func,
  disableMobile: _vueTypes["default"].bool.def(false),
  mediaQuery: _vueTypes["default"].object.def({}),
  handleMediaQuery: _vueTypes["default"].func,
  footerRender: _vueTypes["default"].oneOfType([_vueTypes["default"].func, _vueTypes["default"].bool]).def(undefined)
});

exports.BasicLayoutProps = BasicLayoutProps;
var MediaQueryEnum = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599
  },
  'screen-xxl': {
    minWidth: 1600
  }
};

var getPaddingLeft = function getPaddingLeft(hasLeftPadding) {
  var collapsed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var collapsedWidth = arguments.length > 2 ? arguments[2] : undefined;
  var siderWidth = arguments.length > 3 ? arguments[3] : undefined;

  if (hasLeftPadding) {
    return collapsed ? collapsedWidth ? collapsedWidth : 80 : siderWidth;
  }

  return 0;
};

var headerRender = function headerRender(h, props) {
  if (props.headerRender === false) {
    return null;
  }

  return h(_Header["default"], {
    props: props
  });
};

var defaultI18nRender = function defaultI18nRender(key) {
  return key;
};

var BasicLayout = {
  name: 'BasicLayout',
  functional: true,
  props: BasicLayoutProps,
  render: function render(h, content) {
    var props = content.props,
        children = content.children,
        listeners = content.listeners;
    var layout = props.layout,
        isMobile = props.isMobile,
        collapsed = props.collapsed,
        collapsedWidth = props.collapsedWidth,
        mediaQuery = props.mediaQuery,
        handleMediaQuery = props.handleMediaQuery,
        handleCollapse = props.handleCollapse,
        siderWidth = props.siderWidth,
        fixSiderbar = props.fixSiderbar,
        _props$i18nRender = props.i18nRender,
        i18nRender = _props$i18nRender === void 0 ? defaultI18nRender : _props$i18nRender;
    var footerRender = (0, _util.getComponentFromProp)(content, 'footerRender');
    var rightContentRender = (0, _util.getComponentFromProp)(content, 'rightContentRender');
    var collapsedButtonRender = (0, _util.getComponentFromProp)(content, 'collapsedButtonRender');
    var menuHeaderRender = (0, _util.getComponentFromProp)(content, 'menuHeaderRender');
    var breadcrumbRender = (0, _util.getComponentFromProp)(content, 'breadcrumbRender');
    var headerContentRender = (0, _util.getComponentFromProp)(content, 'headerContentRender');
    var menuRender = (0, _util.getComponentFromProp)(content, 'menuRender');
    var isTopMenu = layout === 'topmenu';
    var hasSiderMenu = !isTopMenu; // If it is a fix menu, calculate padding
    // don't need padding in phone mode

    var hasLeftPadding = fixSiderbar && !isTopMenu && !isMobile;

    var cdProps = _objectSpread({}, props, {
      hasSiderMenu: hasSiderMenu,
      footerRender: footerRender,
      menuHeaderRender: menuHeaderRender,
      rightContentRender: rightContentRender,
      collapsedButtonRender: collapsedButtonRender,
      breadcrumbRender: breadcrumbRender,
      headerContentRender: headerContentRender,
      menuRender: menuRender
    }, listeners);

    return h(_ConfigProvider["default"], {
      attrs: {
        i18nRender: i18nRender,
        contentWidth: props.contentWidth,
        breadcrumbRender: breadcrumbRender
      }
    }, [h(_vueContainerQuery.ContainerQuery, {
      attrs: {
        query: MediaQueryEnum
      },
      on: {
        "change": handleMediaQuery
      }
    }, [h(_layout["default"], {
      "class": _objectSpread({
        'ant-pro-basicLayout': true,
        'ant-pro-topmenu': isTopMenu
      }, mediaQuery)
    }, [h(_components.SiderMenuWrapper, (0, _babelHelperVueJsxMergeProps["default"])([{
      props: cdProps
    }, {
      attrs: {
        collapsed: collapsed
      },
      on: {
        "collapse": handleCollapse
      }
    }])), h(_layout["default"], {
      "class": [layout],
      style: {
        paddingLeft: hasSiderMenu ? "".concat(getPaddingLeft(!!hasLeftPadding, collapsed, collapsedWidth, siderWidth), "px") : undefined,
        minHeight: '100vh'
      }
    }, [headerRender(h, _objectSpread({}, cdProps, {
      mode: 'horizontal'
    })), h(_WrapContent["default"], {
      "class": "ant-pro-basicLayout-content",
      attrs: {
        contentWidth: props.contentWidth
      }
    }, [children]), footerRender !== false && h(_layout["default"].Footer, [(0, _util.isFun)(footerRender) && footerRender(h) || footerRender]) || null])])])]);
  }
};

BasicLayout.install = function (Vue) {
  Vue.component(_PageHeaderWrapper["default"].name, _PageHeaderWrapper["default"]);
  Vue.component('PageContainer', _PageHeaderWrapper["default"]);
  Vue.component('ProLayout', BasicLayout);
};

var _default = BasicLayout;
exports["default"] = _default;