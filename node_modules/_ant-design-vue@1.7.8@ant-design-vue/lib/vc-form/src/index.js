'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createForm = exports.formShape = exports.createFormField = undefined;

var _createForm = require('./createForm');

var _createForm2 = _interopRequireDefault(_createForm);

var _createFormField = require('./createFormField');

var _createFormField2 = _interopRequireDefault(_createFormField);

var _propTypes = require('./propTypes');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueRef = require('vue-ref');

var _vueRef2 = _interopRequireDefault(_vueRef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_vue2['default'].use(_vueRef2['default'], { name: 'ant-ref' }); // export this package's api
exports.createFormField = _createFormField2['default'];
exports.formShape = _propTypes2['default'];
exports.createForm = _createForm2['default'];