import './index.less';
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import 'ant-design-vue/es/layout/style';
import Layout from 'ant-design-vue/es/layout';
import { isFun } from '../../utils/util';
import BaseMenu from '../RouteMenu';
var Sider = Layout.Sider;
export var SiderMenuProps = {
  i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false),
  mode: PropTypes.string.def('inline'),
  theme: PropTypes.string.def('dark'),
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid'),
  collapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  collapsedWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(80),
  openKeys: PropTypes.array.def(undefined),
  selectedKeys: PropTypes.array.def(undefined),
  openOnceKey: PropTypes.bool.def(true),
  handleCollapse: PropTypes.func,
  menus: PropTypes.array,
  siderWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
  isMobile: PropTypes.bool,
  layout: PropTypes.string.def('inline'),
  fixSiderbar: PropTypes.bool,
  logo: PropTypes.any,
  title: PropTypes.string.def(''),
  // render function or vnode
  menuHeaderRender: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.object, PropTypes.bool]),
  menuRender: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.object, PropTypes.bool]),
  // listeners
  openChange: PropTypes.func,
  select: PropTypes.func,
  menuClick: PropTypes.func
};
export var defaultRenderLogo = function defaultRenderLogo(h, logo) {
  if (typeof logo === 'string') {
    return h("img", {
      attrs: {
        src: logo,
        alt: "logo"
      }
    });
  }

  if (typeof logo === 'function') {
    return logo();
  }

  return h(logo);
};
export var defaultRenderLogoAntTitle = function defaultRenderLogoAntTitle(h, props) {
  var _props$logo = props.logo,
      logo = _props$logo === void 0 ? 'https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg' : _props$logo,
      title = props.title,
      menuHeaderRender = props.menuHeaderRender;

  if (menuHeaderRender === false) {
    return null;
  }

  var logoDom = defaultRenderLogo(h, logo);
  var titleDom = h("h1", [title]);

  if (menuHeaderRender) {
    return isFun(menuHeaderRender) && menuHeaderRender(h, logoDom, props.collapsed ? null : titleDom, props) || menuHeaderRender;
  }

  return h("span", [logoDom, titleDom]);
};

var adaptWidth = function adaptWidth(collapsedWidth) {
  if (collapsedWidth >= 32 && collapsedWidth <= 80) {
    return collapsedWidth;
  } else {
    return 80;
  }
};

var SiderMenu = {
  name: 'SiderMenu',
  model: {
    prop: 'collapsed',
    event: 'collapse'
  },
  props: SiderMenuProps,
  render: function render(h) {
    var collapsible = this.collapsible,
        collapsed = this.collapsed,
        collapsedWidth = this.collapsedWidth,
        selectedKeys = this.selectedKeys,
        openKeys = this.openKeys,
        _this$openChange = this.openChange,
        openChange = _this$openChange === void 0 ? function () {
      return null;
    } : _this$openChange,
        _this$select = this.select,
        select = _this$select === void 0 ? function () {
      return null;
    } : _this$select,
        _this$menuClick = this.menuClick,
        menuClick = _this$menuClick === void 0 ? function () {
      return null;
    } : _this$menuClick,
        openOnceKey = this.openOnceKey,
        siderWidth = this.siderWidth,
        fixSiderbar = this.fixSiderbar,
        mode = this.mode,
        theme = this.theme,
        menus = this.menus,
        logo = this.logo,
        title = this.title,
        _this$onMenuHeaderCli = this.onMenuHeaderClick,
        onMenuHeaderClick = _this$onMenuHeaderCli === void 0 ? function () {
      return null;
    } : _this$onMenuHeaderCli,
        i18nRender = this.i18nRender,
        menuHeaderRender = this.menuHeaderRender,
        menuRender = this.menuRender;
    var siderCls = ['ant-pro-sider-menu-sider'];
    if (fixSiderbar) siderCls.push('fix-sider-bar');
    if (theme === 'light') siderCls.push('light'); //
    // const handleCollapse = (collapsed, type) => {
    //   this.$emit('collapse', collapsed)
    // }

    var headerDom = defaultRenderLogoAntTitle(h, {
      logo: logo,
      title: title,
      menuHeaderRender: menuHeaderRender,
      collapsed: collapsed
    }); // 用户的logo图片宽度无法动态获取，暂时写死32，后续有更好的方案再修改

    var logoPaddingLeft = function logoPaddingLeft(collapsed, collapsedWidth) {
      if (collapsed) {
        return "".concat(collapsedWidth ? Math.abs((collapsedWidth - 32) / 2) : 0, "px");
      }

      return 32;
    };

    return h(Sider, {
      "class": siderCls,
      attrs: {
        breakpoint: 'lg',
        trigger: null,
        width: siderWidth,
        theme: theme,
        collapsible: collapsible,
        collapsed: collapsed,
        collapsedWidth: adaptWidth(collapsedWidth)
      }
    }, [headerDom && h("div", {
      "class": "ant-pro-sider-menu-logo",
      on: {
        "click": onMenuHeaderClick
      },
      style: {
        paddingLeft: logoPaddingLeft(collapsed, adaptWidth(collapsedWidth))
      },
      attrs: {
        id: "logo"
      }
    }, [h("router-link", {
      attrs: {
        to: {
          path: '/'
        }
      }
    }, [headerDom])]), menuRender && (isFun(menuRender) && menuRender(h, this.$props) || menuRender) || h(BaseMenu, {
      attrs: {
        collapsed: collapsed,
        collapsedWidth: adaptWidth(collapsedWidth),
        openKeys: openKeys,
        selectedKeys: selectedKeys,
        openOnceKey: openOnceKey,
        menus: menus,
        mode: mode,
        theme: theme,
        i18nRender: i18nRender
      },
      on: {
        "openChange": openChange,
        "select": select,
        "click": menuClick
      }
    })]);
  }
};
export default SiderMenu;