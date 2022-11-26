"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("./index.less");

var _vueTypes = _interopRequireDefault(require("ant-design-vue/es/_util/vue-types"));

var _util = require("../../utils/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GridContent = {
  name: 'GridContent',
  functional: true,
  props: {
    children: _vueTypes["default"].any,
    contentWidth: _vueTypes["default"].oneOf(['Fluid', 'Fixed']).def('Fluid')
  },
  render: function render(h, content) {
    var _classNames;

    var contentWidth = content.props.contentWidth;
    var children = content.children;
    var propsContentWidth = (0, _util.layoutContentWidth)(contentWidth);
    var classNames = (_classNames = {}, _defineProperty(_classNames, 'ant-pro-grid-content', true), _defineProperty(_classNames, 'wide', propsContentWidth), _classNames);
    return h("div", {
      "class": classNames
    }, [children]);
  }
};
var _default = GridContent;
exports["default"] = _default;