'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabContent = exports.TabPane = undefined;

var _vueRef = require('vue-ref');

var _vueRef2 = _interopRequireDefault(_vueRef);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _Tabs = require('./Tabs');

var _Tabs2 = _interopRequireDefault(_Tabs);

var _TabPane = require('./TabPane');

var _TabPane2 = _interopRequireDefault(_TabPane);

var _TabContent = require('./TabContent');

var _TabContent2 = _interopRequireDefault(_TabContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_vue2['default'].use(_vueRef2['default'], { name: 'ant-ref' }); // based on rc-tabs 9.7.0
exports['default'] = _Tabs2['default'];
exports.TabPane = _TabPane2['default'];
exports.TabContent = _TabContent2['default'];