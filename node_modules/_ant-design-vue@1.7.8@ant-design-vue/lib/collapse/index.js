'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Collapse = require('./Collapse');

var _Collapse2 = _interopRequireDefault(_Collapse);

var _CollapsePanel = require('./CollapsePanel');

var _CollapsePanel2 = _interopRequireDefault(_CollapsePanel);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Collapse2['default'].Panel = _CollapsePanel2['default'];

/* istanbul ignore next */
_Collapse2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Collapse2['default'].name, _Collapse2['default']);
  Vue.component(_CollapsePanel2['default'].name, _CollapsePanel2['default']);
};

exports['default'] = _Collapse2['default'];