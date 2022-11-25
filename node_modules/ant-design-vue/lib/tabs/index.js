'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabContent = exports.TabPane = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueRef = require('vue-ref');

var _vueRef2 = _interopRequireDefault(_vueRef);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _tabs = require('./tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _TabPane = require('../vc-tabs/src/TabPane');

var _TabPane2 = _interopRequireDefault(_TabPane);

var _TabContent = require('../vc-tabs/src/TabContent');

var _TabContent2 = _interopRequireDefault(_TabContent);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_tabs2['default'].TabPane = (0, _extends3['default'])({}, _TabPane2['default'], { name: 'ATabPane', __ANT_TAB_PANE: true });
_tabs2['default'].TabContent = (0, _extends3['default'])({}, _TabContent2['default'], { name: 'ATabContent' });
_vue2['default'].use(_vueRef2['default'], { name: 'ant-ref' });

/* istanbul ignore next */
_tabs2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_tabs2['default'].name, _tabs2['default']);
  Vue.component(_tabs2['default'].TabPane.name, _tabs2['default'].TabPane);
  Vue.component(_tabs2['default'].TabContent.name, _tabs2['default'].TabContent);
};

exports['default'] = _tabs2['default'];
exports.TabPane = _TabPane2['default'];
exports.TabContent = _TabContent2['default'];