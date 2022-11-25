import _mergeJSXProps3 from "babel-helper-vue-jsx-merge-props";
import _mergeJSXProps2 from "babel-helper-vue-jsx-merge-props";
import _mergeJSXProps from "babel-helper-vue-jsx-merge-props";
var _excluded = ["title", "tags", "content", "pageHeaderRender", "extra", "extraContent", "breadcrumb", "back"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import './index.less';
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import { isArray } from "ant-design-vue/es/_util/vue-types/utils";
import GridContent from '../GridContent';
import 'ant-design-vue/es/page-header/style';
import PageHeader, { PageHeaderProps } from 'ant-design-vue/es/page-header';
import 'ant-design-vue/es/tabs/style';
import Tabs from 'ant-design-vue/es/tabs';
import { getComponentFromProp } from "ant-design-vue/es/_util/props-util";
var prefixedClassName = 'ant-pro-page-header-wrap';
var PageHeaderTabConfig = {
  tabList: PropTypes.array,
  tabActiveKey: PropTypes.string,
  tabProps: PropTypes.object,
  tabChange: PropTypes.func
};

var PageHeaderWrapperProps = _objectSpread({}, PageHeaderTabConfig, PageHeaderProps, {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  content: PropTypes.any,
  extraContent: PropTypes.any,
  pageHeaderRender: PropTypes.func,
  breadcrumb: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).def(true),
  back: PropTypes.func,
  // only use `pro-layout` in children
  i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false)
});

var defaultI18nRender = function defaultI18nRender(t) {
  return t;
};

var useContext = function useContext(route) {
  return route && _objectSpread({}, route.meta) || null;
};

var noop = function noop() {}; // TODO :: tabList tab 支持图标 优化


var renderFooter = function renderFooter(h, tabConfigProps, i18nRender) {
  var tabList = tabConfigProps.tabList,
      tabActiveKey = tabConfigProps.tabActiveKey,
      onTabChange = tabConfigProps.tabChange,
      tabBarExtraContent = tabConfigProps.tabBarExtraContent,
      tabProps = tabConfigProps.tabProps;
  return tabList && tabList.length > 0 && h(Tabs, _mergeJSXProps2([{
    "class": "".concat(prefixedClassName, "-tabs"),
    attrs: {
      activeKey: tabActiveKey,
      tabBarExtraContent: tabBarExtraContent
    },
    on: {
      "change": function change(key) {
        if (onTabChange) {
          onTabChange(key);
        }
      }
    }
  }, tabProps]), [tabList.map(function (item) {
    return h(Tabs.TabPane, _mergeJSXProps([item, {
      attrs: {
        tab: i18nRender(item.tab)
      },
      key: item.key
    }]));
  })]);
};

var renderPageHeader = function renderPageHeader(h, content, extraContent) {
  if (!content && !extraContent) {
    return null;
  }

  return h("div", {
    "class": "".concat(prefixedClassName, "-detail")
  }, [h("div", {
    "class": "".concat(prefixedClassName, "-main")
  }, [h("div", {
    "class": "".concat(prefixedClassName, "-row")
  }, [content && h("div", {
    "class": "".concat(prefixedClassName, "-content")
  }, [content]), extraContent && h("div", {
    "class": "".concat(prefixedClassName, "-extraContent")
  }, [extraContent])])])]);
};

var defaultPageHeaderRender = function defaultPageHeaderRender(h, props, pageMeta, i18nRender) {
  var propTitle = props.title,
      tags = props.tags,
      content = props.content,
      pageHeaderRender = props.pageHeaderRender,
      extra = props.extra,
      extraContent = props.extraContent,
      breadcrumb = props.breadcrumb,
      handleBack = props.back,
      restProps = _objectWithoutProperties(props, _excluded);

  if (pageHeaderRender) {
    return pageHeaderRender(_objectSpread({}, props));
  }

  var pageHeaderTitle = propTitle;

  if (!propTitle && propTitle !== false) {
    pageHeaderTitle = pageMeta.title;
  } // title props 不是 false 且不是 array 则直接渲染 title
  // 反之认为是 VNode, 作为 render 参数直接传入到 PageHeader


  var title = isArray(pageHeaderTitle) ? pageHeaderTitle : pageHeaderTitle && i18nRender(pageHeaderTitle);
  var tabProps = {
    breadcrumb: breadcrumb,
    extra: extra,
    tags: tags,
    title: title,
    footer: renderFooter(h, restProps, i18nRender)
  };

  if (!handleBack) {
    tabProps.backIcon = false;
  }

  return h(PageHeader, _mergeJSXProps3([{
    props: tabProps
  }, {
    on: {
      "back": handleBack || noop
    }
  }]), [renderPageHeader(h, content, extraContent)]); // return
};

var PageHeaderWrapper = {
  name: 'PageHeaderWrapper',
  props: PageHeaderWrapperProps,
  inject: ['locale', 'contentWidth', 'breadcrumbRender'],
  render: function render(h) {
    var _this = this;

    var $route = this.$route,
        $listeners = this.$listeners;
    var children = this.$slots["default"];
    var title = getComponentFromProp(this, 'title');
    var tags = getComponentFromProp(this, 'tags');
    var content = getComponentFromProp(this, 'content');
    var extra = getComponentFromProp(this, 'extra');
    var extraContent = getComponentFromProp(this, 'extraContent');
    var pageMeta = useContext(this.$props.route || $route);
    var i18n = this.$props.i18nRender || this.locale || defaultI18nRender;
    var contentWidth = this.$props.contentWidth || this.contentWidth || false; // 当未设置 back props 或未监听 @back，不显示 back
    // props 的 back 事件优先级高于 @back，需要注意

    var onBack = this.$props.back || $listeners.back;

    var back = onBack && function () {
      // this.$emit('back')
      // call props back func
      onBack && onBack();
    } || undefined;

    var onTabChange = this.$props.tabChange;

    var tabChange = function tabChange(key) {
      _this.$emit('tabChange', key);

      onTabChange && onTabChange(key);
    };

    var breadcrumb = {};
    var propsBreadcrumb = this.$props.breadcrumb;

    if (propsBreadcrumb === true) {
      var routes = $route.matched.concat().map(function (route) {
        return {
          path: route.path,
          breadcrumbName: i18n(route.meta.title)
        };
      });

      var defaultItemRender = function defaultItemRender(_ref) {
        var route = _ref.route,
            params = _ref.params,
            routes = _ref.routes,
            paths = _ref.paths,
            h = _ref.h;
        return routes.indexOf(route) === routes.length - 1 && h("span", [route.breadcrumbName]) || h("router-link", {
          attrs: {
            to: {
              path: route.path || '/',
              params: params
            }
          }
        }, [route.breadcrumbName]);
      }; // If custom breadcrumb render undefined
      // use default breadcrumb..


      var itemRender = this.breadcrumbRender || defaultItemRender;
      breadcrumb = {
        props: {
          routes: routes,
          itemRender: itemRender
        }
      };
    } else {
      breadcrumb = propsBreadcrumb || null;
    }

    var props = _objectSpread({}, this.$props, {
      title: title,
      tags: tags,
      content: content,
      extra: extra,
      extraContent: extraContent,
      breadcrumb: breadcrumb,
      tabChange: tabChange,
      back: back
    });

    return h("div", {
      "class": "ant-pro-page-header-wrap"
    }, [h("div", {
      "class": "".concat(prefixedClassName, "-page-header-warp")
    }, [h(GridContent, [defaultPageHeaderRender(h, props, pageMeta, i18n)])]), children ? h(GridContent, {
      attrs: {
        contentWidth: contentWidth
      }
    }, [h("div", {
      "class": "".concat(prefixedClassName, "-children-content")
    }, [children])]) : null]);
  }
};

PageHeaderWrapper.install = function (Vue) {
  Vue.component(PageHeaderWrapper.name, PageHeaderWrapper);
  Vue.component('page-container', PageHeaderWrapper);
};

export default PageHeaderWrapper;