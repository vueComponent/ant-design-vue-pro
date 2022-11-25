'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Breadcrumb = require('./Breadcrumb');

var _Breadcrumb2 = _interopRequireDefault(_Breadcrumb);

var _BreadcrumbItem = require('./BreadcrumbItem');

var _BreadcrumbItem2 = _interopRequireDefault(_BreadcrumbItem);

var _BreadcrumbSeparator = require('./BreadcrumbSeparator');

var _BreadcrumbSeparator2 = _interopRequireDefault(_BreadcrumbSeparator);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Breadcrumb2['default'].Item = _BreadcrumbItem2['default'];
_Breadcrumb2['default'].Separator = _BreadcrumbSeparator2['default'];

/* istanbul ignore next */
_Breadcrumb2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Breadcrumb2['default'].name, _Breadcrumb2['default']);
  Vue.component(_BreadcrumbItem2['default'].name, _BreadcrumbItem2['default']);
  Vue.component(_BreadcrumbSeparator2['default'].name, _BreadcrumbSeparator2['default']);
};

exports['default'] = _Breadcrumb2['default'];