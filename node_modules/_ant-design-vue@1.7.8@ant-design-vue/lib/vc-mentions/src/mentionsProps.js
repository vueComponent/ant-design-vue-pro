'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultProps = exports.vcMentionsProps = exports.mentionsProps = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _propsUtil = require('../../_util/props-util');

var _util = require('./util');

var _placement = require('./placement');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var mentionsProps = exports.mentionsProps = {
  autoFocus: _vueTypes2['default'].bool,
  prefix: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].array]),
  prefixCls: _vueTypes2['default'].string,
  value: _vueTypes2['default'].string,
  defaultValue: _vueTypes2['default'].string,
  disabled: _vueTypes2['default'].bool,
  notFoundContent: _vueTypes2['default'].any,
  split: _vueTypes2['default'].string,
  transitionName: _vueTypes2['default'].string,
  placement: _vueTypes2['default'].oneOf(_placement.PlaceMent),
  character: _vueTypes2['default'].any,
  characterRender: _vueTypes2['default'].func,
  filterOption: _vueTypes2['default'].func,
  validateSearch: _vueTypes2['default'].func,
  getPopupContainer: _vueTypes2['default'].func
};

var vcMentionsProps = exports.vcMentionsProps = (0, _extends3['default'])({}, mentionsProps, {
  children: _vueTypes2['default'].any
});

var defaultProps = exports.defaultProps = {
  prefix: '@',
  split: ' ',
  validateSearch: _util.validateSearch,
  filterOption: _util.filterOption
};

exports['default'] = (0, _propsUtil.initDefaultProps)(vcMentionsProps, defaultProps);