'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.panelProps = exports.collapseProps = undefined;

var _Panel = require('./src/Panel');

var _Panel2 = _interopRequireDefault(_Panel);

var _Collapse = require('./src/Collapse');

var _Collapse2 = _interopRequireDefault(_Collapse);

var _commonProps = require('./src/commonProps');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_Collapse2['default'].Panel = _Panel2['default']; // based on rc-collapse 1.11.8
exports.collapseProps = _commonProps.collapseProps;
exports.panelProps = _commonProps.panelProps;
exports['default'] = _Collapse2['default'];