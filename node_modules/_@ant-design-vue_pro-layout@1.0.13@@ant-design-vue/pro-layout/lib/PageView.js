"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _components = require("./components");

var PageView = {
  name: 'PageView',
  render: function render() {
    var h = arguments[0];
    return h(_components.PageHeaderWrapper, [h("router-view")]);
  }
};
var _default = PageView;
exports["default"] = _default;