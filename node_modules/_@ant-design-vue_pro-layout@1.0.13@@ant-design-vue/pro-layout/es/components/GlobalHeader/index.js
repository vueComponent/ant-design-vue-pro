import './index.less';
import debounce from 'lodash/debounce';
import PropTypes from 'ant-design-vue/es/_util/vue-types';
import { triggerEvent, inBrowser, isFun } from '../../utils/util';
import 'ant-design-vue/es/icon/style';
import Icon from 'ant-design-vue/es/icon';
import { defaultRenderLogo } from '../SiderMenu/SiderMenu';
export var GlobalHeaderProps = {
  collapsed: PropTypes.bool,
  handleCollapse: PropTypes.func,
  isMobile: PropTypes.bool.def(false),
  fixedHeader: PropTypes.bool.def(false),
  logo: PropTypes.any,
  menuRender: PropTypes.any,
  collapsedButtonRender: PropTypes.any,
  headerContentRender: PropTypes.any,
  rightContentRender: PropTypes.any
};

var defaultRenderCollapsedButton = function defaultRenderCollapsedButton(h, collapsed) {
  return h(Icon, {
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
        }, [isFun(collapsedButtonRender) && collapsedButtonRender(h, collapsed) || collapsedButtonRender]);
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
    }, [defaultRenderLogo(h, logo)]), renderCollapsedButton(), headerContentRender && h("div", {
      "class": "".concat(headerCls, "-content")
    }, [isFun(headerContentRender) && headerContentRender(h, this.$props) || headerContentRender]), isFun(rightContentRender) && rightContentRender(h, this.$props) || rightContentRender]);
  },
  methods: {
    triggerResizeEvent: debounce(function () {
      inBrowser && triggerEvent(window, 'resize');
    })
  },
  beforeDestroy: function beforeDestroy() {
    this.triggerResizeEvent.cancel && this.triggerResizeEvent.cancel();
  }
};
export default GlobalHeader;