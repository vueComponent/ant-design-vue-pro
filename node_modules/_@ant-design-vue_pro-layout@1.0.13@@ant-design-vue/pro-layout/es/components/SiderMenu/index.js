import _mergeJSXProps from "babel-helper-vue-jsx-merge-props";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import './index.less';
import 'ant-design-vue/es/drawer/style';
import Drawer from 'ant-design-vue/es/drawer';
import SiderMenu, { SiderMenuProps } from './SiderMenu';
var SiderMenuWrapper = {
  name: 'SiderMenuWrapper',
  model: {
    prop: 'collapsed',
    event: 'collapse'
  },
  props: SiderMenuProps,
  render: function render(h) {
    var _this = this;

    var layout = this.layout,
        isMobile = this.isMobile,
        collapsed = this.collapsed;
    var isTopMenu = layout === 'topmenu';

    var handleCollapse = function handleCollapse(e) {
      _this.$emit('collapse', true);
    };

    return isMobile ? h(Drawer, {
      "class": "ant-pro-sider-menu",
      attrs: {
        visible: !collapsed,
        placement: "left",
        maskClosable: true,
        getContainer: null,
        bodyStyle: {
          padding: 0,
          height: '100vh'
        }
      },
      on: {
        "close": handleCollapse
      }
    }, [h(SiderMenu, {
      props: _objectSpread({}, this.$props, {
        collapsed: isMobile ? false : collapsed
      })
    })]) : !isTopMenu && h(SiderMenu, _mergeJSXProps([{
      "class": "ant-pro-sider-menu"
    }, {
      props: this.$props
    }]));
  }
};

SiderMenuWrapper.install = function (Vue) {
  Vue.component(SiderMenuWrapper.name, SiderMenuWrapper);
};

export { SiderMenu, SiderMenuProps };
export default SiderMenuWrapper;