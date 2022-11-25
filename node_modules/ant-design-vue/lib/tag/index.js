'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Tag = require('./Tag');

var _Tag2 = _interopRequireDefault(_Tag);

var _CheckableTag = require('./CheckableTag');

var _CheckableTag2 = _interopRequireDefault(_CheckableTag);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Tag2['default'].CheckableTag = _CheckableTag2['default'];

/* istanbul ignore next */
_Tag2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Tag2['default'].name, _Tag2['default']);
  Vue.component(_Tag2['default'].CheckableTag.name, _Tag2['default'].CheckableTag);
};

exports['default'] = _Tag2['default'];