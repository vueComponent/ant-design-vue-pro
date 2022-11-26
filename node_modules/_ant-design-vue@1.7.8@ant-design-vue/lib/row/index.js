'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _grid = require('../grid');

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* istanbul ignore next */
_grid.Row.install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_grid.Row.name, _grid.Row);
};

exports['default'] = _grid.Row;