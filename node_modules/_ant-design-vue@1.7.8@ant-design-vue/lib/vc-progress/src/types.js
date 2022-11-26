'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propTypes = exports.defaultProps = undefined;

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var defaultProps = exports.defaultProps = {
  // className: '',
  percent: 0,
  prefixCls: 'rc-progress',
  strokeColor: '#2db7f5',
  strokeLinecap: 'round',
  strokeWidth: 1,
  // style: {},
  trailColor: '#D9D9D9',
  trailWidth: 1
};
var mixedType = _vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string]);

var propTypes = exports.propTypes = {
  // className: PropTypes.string,
  percent: _vueTypes2['default'].oneOfType([mixedType, _vueTypes2['default'].arrayOf(mixedType)]),
  prefixCls: _vueTypes2['default'].string,
  strokeColor: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].arrayOf(_vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].object])), _vueTypes2['default'].object]),
  strokeLinecap: _vueTypes2['default'].oneOf(['butt', 'round', 'square']),
  strokeWidth: mixedType,
  // style: PropTypes.object,
  trailColor: _vueTypes2['default'].string,
  trailWidth: mixedType
};