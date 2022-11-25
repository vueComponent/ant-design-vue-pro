import PropTypes from '../../_util/vue-types';

export var defaultProps = {
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
var mixedType = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

export var propTypes = {
  // className: PropTypes.string,
  percent: PropTypes.oneOfType([mixedType, PropTypes.arrayOf(mixedType)]),
  prefixCls: PropTypes.string,
  strokeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])), PropTypes.object]),
  strokeLinecap: PropTypes.oneOf(['butt', 'round', 'square']),
  strokeWidth: mixedType,
  // style: PropTypes.object,
  trailColor: PropTypes.string,
  trailWidth: mixedType
};