"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ThemeColorProps = exports.TagProps = void 0;

var _babelHelperVueJsxMergeProps = _interopRequireDefault(require("babel-helper-vue-jsx-merge-props"));

require("./ThemeColor.less");

var _vueTypes = _interopRequireDefault(require("ant-design-vue/es/_util/vue-types"));

var _util = require("../../utils/util");

require("ant-design-vue/es/tooltip/style");

var _tooltip = _interopRequireDefault(require("ant-design-vue/es/tooltip"));

require("ant-design-vue/es/icon/style");

var _icon = _interopRequireDefault(require("ant-design-vue/es/icon"));

var _excluded = ["props", "data"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var baseClassName = 'theme-color';
var TagProps = {
  color: _vueTypes["default"].string,
  check: _vueTypes["default"].bool
};
exports.TagProps = TagProps;
var Tag = {
  props: TagProps,
  functional: true,
  render: function render(h, content) {
    var _content$props = content.props,
        color = _content$props.color,
        check = _content$props.check,
        data = content.data,
        rest = _objectWithoutProperties(content, _excluded);

    return h("div", (0, _babelHelperVueJsxMergeProps["default"])([data, {
      style: {
        backgroundColor: color
      }
    }]), [check ? h(_icon["default"], {
      attrs: {
        type: "check"
      }
    }) : null]);
  }
};
var ThemeColorProps = {
  colors: _vueTypes["default"].array,
  title: _vueTypes["default"].string,
  value: _vueTypes["default"].string,
  i18nRender: _vueTypes["default"].oneOfType([_vueTypes["default"].func, _vueTypes["default"].bool]).def(false)
};
exports.ThemeColorProps = ThemeColorProps;
var ThemeColor = {
  props: ThemeColorProps,
  inject: ['locale'],
  render: function render(h) {
    var _this = this;

    var title = this.title,
        value = this.value,
        _this$colors = this.colors,
        colors = _this$colors === void 0 ? [] : _this$colors;
    var i18n = this.$props.i18nRender || this.locale;

    var handleChange = function handleChange(key) {
      _this.$emit('change', key);
    };

    return h("div", {
      "class": baseClassName,
      ref: 'ref'
    }, [h("h3", {
      "class": "".concat(baseClassName, "-title")
    }, [title]), h("div", {
      "class": "".concat(baseClassName, "-content")
    }, [colors.map(function (item) {
      var themeKey = (0, _util.genThemeToString)(item.key.toUpperCase());
      var check = value.toUpperCase() === item.key.toUpperCase() || (0, _util.genThemeToString)(value.toUpperCase()) === item.key.toUpperCase();
      return h(_tooltip["default"], {
        key: item.color.toUpperCase(),
        attrs: {
          title: themeKey ? i18n("app.setting.themecolor.".concat(themeKey)) : item.key.toUpperCase()
        }
      }, [h(Tag, {
        "class": "".concat(baseClassName, "-block"),
        attrs: {
          color: item.color.toUpperCase(),
          check: check
        },
        on: {
          "click": function click() {
            return handleChange(item.key.toUpperCase());
          }
        }
      })]);
    })])]);
  }
};
var _default = ThemeColor;
exports["default"] = _default;