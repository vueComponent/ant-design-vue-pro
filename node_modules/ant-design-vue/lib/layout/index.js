'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _Sider = require('./Sider');

var _Sider2 = _interopRequireDefault(_Sider);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_layout2['default'].Sider = _Sider2['default'];

/* istanbul ignore next */
_layout2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_layout2['default'].name, _layout2['default']);
  Vue.component(_layout2['default'].Header.name, _layout2['default'].Header);
  Vue.component(_layout2['default'].Footer.name, _layout2['default'].Footer);
  Vue.component(_layout2['default'].Sider.name, _layout2['default'].Sider);
  Vue.component(_layout2['default'].Content.name, _layout2['default'].Content);
};
exports['default'] = _layout2['default'];