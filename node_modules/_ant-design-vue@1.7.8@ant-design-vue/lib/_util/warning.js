'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetWarned = undefined;

var _warning = require('../vc-util/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports.resetWarned = _warning.resetWarned;

exports['default'] = function (valid, component) {
  var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  (0, _warning2['default'])(valid, '[antdv: ' + component + '] ' + message);
};