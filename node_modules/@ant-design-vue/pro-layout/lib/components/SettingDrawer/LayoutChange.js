"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderLayoutSettingItem = exports["default"] = exports.LayoutSettingProps = void 0;

var _vueTypes = _interopRequireDefault(require("ant-design-vue/es/_util/vue-types"));

require("ant-design-vue/es/tooltip/style");

var _tooltip = _interopRequireDefault(require("ant-design-vue/es/tooltip"));

require("ant-design-vue/es/list/style");

var _list = _interopRequireDefault(require("ant-design-vue/es/list"));

require("ant-design-vue/es/select/style");

var _select = _interopRequireDefault(require("ant-design-vue/es/select"));

require("ant-design-vue/es/switch/style");

var _switch = _interopRequireDefault(require("ant-design-vue/es/switch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var renderLayoutSettingItem = function renderLayoutSettingItem(h, item) {
  var action = _objectSpread({}, item.action);

  return h(_tooltip["default"], {
    attrs: {
      title: item.disabled ? item.disabledReason : '',
      placement: "left"
    }
  }, [h(_list["default"].Item, {
    attrs: {
      actions: [action]
    }
  }, [h("span", {
    style: {
      opacity: item.disabled ? 0.5 : 1
    }
  }, [item.title])])]);
};

exports.renderLayoutSettingItem = renderLayoutSettingItem;
var LayoutSettingProps = {
  contentWidth: _vueTypes["default"].oneOf(['Fluid', 'Fixed']).def('Fluid'),
  fixedHeader: _vueTypes["default"].bool,
  fixSiderbar: _vueTypes["default"].bool,
  layout: _vueTypes["default"].oneOf(['sidemenu', 'topmenu']),
  i18nRender: _vueTypes["default"].oneOfType([_vueTypes["default"].func, _vueTypes["default"].bool]).def(false)
};
exports.LayoutSettingProps = LayoutSettingProps;
var _default = {
  props: LayoutSettingProps,
  inject: ['locale'],
  render: function render(h) {
    var _this = this;

    var i18n = this.$props.i18nRender || this.locale;
    var contentWidth = this.contentWidth,
        fixedHeader = this.fixedHeader,
        layout = this.layout,
        fixSiderbar = this.fixSiderbar;

    var handleChange = function handleChange(type, value) {
      _this.$emit('change', {
        type: type,
        value: value
      });
    };

    return h(_list["default"], {
      attrs: {
        split: false,
        dataSource: [{
          title: i18n('app.setting.content-width'),
          action: h(_select["default"], {
            attrs: {
              value: contentWidth,
              size: "small"
            },
            on: {
              "select": function select(value) {
                return handleChange('contentWidth', value);
              }
            },
            style: {
              width: '80px'
            }
          }, [layout === 'sidemenu' ? null : h(_select["default"].Option, {
            attrs: {
              value: "Fixed"
            }
          }, [i18n('app.setting.content-width.fixed')]), h(_select["default"].Option, {
            attrs: {
              value: "Fluid"
            }
          }, [i18n('app.setting.content-width.fluid')])])
        }, {
          title: i18n('app.setting.fixedheader'),
          action: h(_switch["default"], {
            attrs: {
              size: "small",
              checked: !!fixedHeader
            },
            on: {
              "change": function change(checked) {
                return handleChange('fixedHeader', checked);
              }
            }
          })
        }, {
          title: i18n('app.setting.fixedsidebar'),
          disabled: layout === 'topmenu',
          disabledReason: i18n('app.setting.fixedsidebar.hint'),
          action: h(_switch["default"], {
            attrs: {
              size: "small",
              disabled: layout === 'topmenu',
              checked: !!fixSiderbar
            },
            on: {
              "change": function change(checked) {
                return handleChange('fixSiderbar', checked);
              }
            }
          })
        }],
        renderItem: function renderItem(item, index) {
          return renderLayoutSettingItem(h, item);
        }
      }
    });
  }
};
exports["default"] = _default;