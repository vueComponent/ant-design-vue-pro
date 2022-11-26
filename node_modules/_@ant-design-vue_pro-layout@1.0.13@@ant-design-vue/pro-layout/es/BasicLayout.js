import _mergeJSXProps from "babel-helper-vue-jsx-merge-props";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import './BasicLayout.less';
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';
import { ContainerQuery } from 'vue-container-query';
import { SiderMenuWrapper, GlobalFooter } from './components';
import { contentWidthCheck, getComponentFromProp, isFun } from './utils/util';
import { SiderMenuProps } from './components/SiderMenu';
import HeaderView, { HeaderViewProps } from './Header';
import WrapContent from './WrapContent';
import ConfigProvider from './components/ConfigProvider';
import PageHeaderWrapper from './components/PageHeaderWrapper';
export var BasicLayoutProps = _objectSpread({}, SiderMenuProps, HeaderViewProps, {
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid'),
  // contentWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).def('Fluid'),
  locale: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).def('en-US'),
  breadcrumbRender: PropTypes.func,
  disableMobile: PropTypes.bool.def(false),
  mediaQuery: PropTypes.object.def({}),
  handleMediaQuery: PropTypes.func,
  footerRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(undefined)
});
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

  return h(HeaderView, {
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
    var footerRender = getComponentFromProp(content, 'footerRender');
    var rightContentRender = getComponentFromProp(content, 'rightContentRender');
    var collapsedButtonRender = getComponentFromProp(content, 'collapsedButtonRender');
    var menuHeaderRender = getComponentFromProp(content, 'menuHeaderRender');
    var breadcrumbRender = getComponentFromProp(content, 'breadcrumbRender');
    var headerContentRender = getComponentFromProp(content, 'headerContentRender');
    var menuRender = getComponentFromProp(content, 'menuRender');
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

    return h(ConfigProvider, {
      attrs: {
        i18nRender: i18nRender,
        contentWidth: props.contentWidth,
        breadcrumbRender: breadcrumbRender
      }
    }, [h(ContainerQuery, {
      attrs: {
        query: MediaQueryEnum
      },
      on: {
        "change": handleMediaQuery
      }
    }, [h(Layout, {
      "class": _objectSpread({
        'ant-pro-basicLayout': true,
        'ant-pro-topmenu': isTopMenu
      }, mediaQuery)
    }, [h(SiderMenuWrapper, _mergeJSXProps([{
      props: cdProps
    }, {
      attrs: {
        collapsed: collapsed
      },
      on: {
        "collapse": handleCollapse
      }
    }])), h(Layout, {
      "class": [layout],
      style: {
        paddingLeft: hasSiderMenu ? "".concat(getPaddingLeft(!!hasLeftPadding, collapsed, collapsedWidth, siderWidth), "px") : undefined,
        minHeight: '100vh'
      }
    }, [headerRender(h, _objectSpread({}, cdProps, {
      mode: 'horizontal'
    })), h(WrapContent, {
      "class": "ant-pro-basicLayout-content",
      attrs: {
        contentWidth: props.contentWidth
      }
    }, [children]), footerRender !== false && h(Layout.Footer, [isFun(footerRender) && footerRender(h) || footerRender]) || null])])])]);
  }
};

BasicLayout.install = function (Vue) {
  Vue.component(PageHeaderWrapper.name, PageHeaderWrapper);
  Vue.component('PageContainer', PageHeaderWrapper);
  Vue.component('ProLayout', BasicLayout);
};

export default BasicLayout;