import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
/* eslint-disable */
var Track = {
  functional: true,
  render: function render(h, context) {
    var _ref, _ref2;

    var _context$props = context.props,
        included = _context$props.included,
        vertical = _context$props.vertical,
        offset = _context$props.offset,
        length = _context$props.length,
        reverse = _context$props.reverse;
    var _context$data = context.data,
        style = _context$data.style,
        className = _context$data['class'];


    var positonStyle = vertical ? (_ref = {}, _defineProperty(_ref, reverse ? 'top' : 'bottom', offset + '%'), _defineProperty(_ref, reverse ? 'bottom' : 'top', 'auto'), _defineProperty(_ref, 'height', length + '%'), _ref) : (_ref2 = {}, _defineProperty(_ref2, reverse ? 'right' : 'left', offset + '%'), _defineProperty(_ref2, reverse ? 'left' : 'right', 'auto'), _defineProperty(_ref2, 'width', length + '%'), _ref2);

    var elStyle = _extends({}, style, positonStyle);
    return included ? h('div', { 'class': className, style: elStyle }) : null;
  }
};

export default Track;