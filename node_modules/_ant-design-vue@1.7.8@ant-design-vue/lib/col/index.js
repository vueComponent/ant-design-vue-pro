'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _grid = require('../grid');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* istanbul ignore next */
_grid.Col.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_grid.Col.name, _grid.Col);
};

exports['default'] = _grid.Col;