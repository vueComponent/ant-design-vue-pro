"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SiderMenu", {
  enumerable: true,
  get: function get() {
    return _SiderMenu["default"];
  }
});
Object.defineProperty(exports, "SiderMenuProps", {
  enumerable: true,
  get: function get() {
    return _SiderMenu.SiderMenuProps;
  }
});
exports["default"] = void 0;

var _babelHelperVueJsxMergeProps = _interopRequireDefault(require("babel-helper-vue-jsx-merge-props"));

require("./index.less");

require("ant-design-vue/es/drawer/style");

var _drawer = _interopRequireDefault(require("ant-design-vue/es/drawer"));

var _SiderMenu = _interopRequireWildcard(require("./SiderMenu"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SiderMenuWrapper = {
  name: 'SiderMenuWrapper',
  model: {
    prop: 'collapsed',
    event: 'collapse'
  },
  props: _SiderMenu.SiderMenuProps,
  render: function render(h) {
    var _this = this;

    var layout = this.layout,
        isMobile = this.isMobile,
        collapsed = this.collapsed;
    var isTopMenu = layout === 'topmenu';

    var handleCollapse = function handleCollapse(e) {
      _this.$emit('collapse', true);
    };

    return isMobile ? h(_drawer["default"], {
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
    }, [h(_SiderMenu["default"], {
      props: _objectSpread({}, this.$props, {
        collapsed: isMobile ? false : collapsed
      })
    })]) : !isTopMenu && h(_SiderMenu["default"], (0, _babelHelperVueJsxMergeProps["default"])([{
      "class": "ant-pro-sider-menu"
    }, {
      props: this.$props
    }]));
  }
};

SiderMenuWrapper.install = function (Vue) {
  Vue.component(SiderMenuWrapper.name, SiderMenuWrapper);
};

var _default = SiderMenuWrapper;
exports["default"] = _default;