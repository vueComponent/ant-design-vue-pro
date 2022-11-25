'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

var _Group = require('./Group');

var _Group2 = _interopRequireDefault(_Group);

var _Search = require('./Search');

var _Search2 = _interopRequireDefault(_Search);

var _TextArea = require('./TextArea');

var _TextArea2 = _interopRequireDefault(_TextArea);

var _Password = require('./Password');

var _Password2 = _interopRequireDefault(_Password);

var _antInputDirective = require('../_util/antInputDirective');

var _antInputDirective2 = _interopRequireDefault(_antInputDirective);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_vue2['default'].use(_antInputDirective2['default']);

_Input2['default'].Group = _Group2['default'];
_Input2['default'].Search = _Search2['default'];
_Input2['default'].TextArea = _TextArea2['default'];
_Input2['default'].Password = _Password2['default'];

/* istanbul ignore next */
_Input2['default'].install = function (Vue) {
  Vue.use(_base2['default']);
  Vue.component(_Input2['default'].name, _Input2['default']);
  Vue.component(_Input2['default'].Group.name, _Input2['default'].Group);
  Vue.component(_Input2['default'].Search.name, _Input2['default'].Search);
  Vue.component(_Input2['default'].TextArea.name, _Input2['default'].TextArea);
  Vue.component(_Input2['default'].Password.name, _Input2['default'].Password);
};

exports['default'] = _Input2['default'];