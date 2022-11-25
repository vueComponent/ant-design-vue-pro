"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  name: 'VueFragment',
  functional: true,
  render: function render(h, ctx) {
    return ctx.children.length > 1 ? h('div', {}, ctx.children) : ctx.children;
  }
};
exports["default"] = _default;