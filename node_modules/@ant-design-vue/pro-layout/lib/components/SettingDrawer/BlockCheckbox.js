"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueTypes = _interopRequireDefault(require("ant-design-vue/es/_util/vue-types"));

require("ant-design-vue/es/tooltip/style");

var _tooltip = _interopRequireDefault(require("ant-design-vue/es/tooltip"));

require("ant-design-vue/es/icon/style");

var _icon = _interopRequireDefault(require("ant-design-vue/es/icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var BlockCheckboxProps = {
  value: _vueTypes["default"].string,
  // Item: { key, url, title }
  list: _vueTypes["default"].array,
  i18nRender: _vueTypes["default"].oneOfType([_vueTypes["default"].func, _vueTypes["default"].bool]).def(false)
};
var baseClassName = 'ant-pro-setting-drawer-block-checbox';
var BlockCheckbox = {
  props: BlockCheckboxProps,
  inject: ['locale'],
  render: function render(h) {
    var _this = this;

    var value = this.value,
        list = this.list;
    var i18n = this.$props.i18nRender || this.locale;
    var items = list || [{
      key: 'sidemenu',
      url: 'https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg',
      title: i18n('app.setting.sidemenu')
    }, {
      key: 'topmenu',
      url: 'https://gw.alipayobjects.com/zos/antfincdn/URETY8%24STp/KDNDBbriJhLwuqMoxcAr.svg',
      title: i18n('app.setting.topmenu')
    }];

    var handleChange = function handleChange(key) {
      _this.$emit('change', key);
    };

    var disableStyle = {
      cursor: 'not-allowed'
    };
    return h("div", {
      "class": baseClassName,
      key: value
    }, [items.map(function (item) {
      return h(_tooltip["default"], {
        attrs: {
          title: item.title
        },
        key: item.key
      }, [h("div", {
        "class": "".concat(baseClassName, "-item"),
        style: item.disable && disableStyle,
        on: {
          "click": function click() {
            return !item.disable && handleChange(item.key);
          }
        }
      }, [h("img", {
        attrs: {
          src: item.url,
          alt: item.key
        }
      }), h("div", {
        "class": "".concat(baseClassName, "-selectIcon"),
        style: {
          display: value === item.key ? 'block' : 'none'
        }
      }, [h(_icon["default"], {
        attrs: {
          type: "check"
        }
      })])])]);
    })]);
  }
};
var _default = BlockCheckbox;
exports["default"] = _default;