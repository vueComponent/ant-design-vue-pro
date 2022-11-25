import _extends from 'babel-runtime/helpers/extends';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _typeof from 'babel-runtime/helpers/typeof';
import classNames from 'classnames';
import { isValidElement } from '../../../_util/props-util';

var Marks = {
  functional: true,
  render: function render(h, context) {
    var _context$props = context.props,
        className = _context$props.className,
        vertical = _context$props.vertical,
        reverse = _context$props.reverse,
        marks = _context$props.marks,
        included = _context$props.included,
        upperBound = _context$props.upperBound,
        lowerBound = _context$props.lowerBound,
        max = _context$props.max,
        min = _context$props.min;
    var clickLabel = context.listeners.clickLabel;

    var marksKeys = Object.keys(marks);

    var range = max - min;
    var elements = marksKeys.map(parseFloat).sort(function (a, b) {
      return a - b;
    }).map(function (point) {
      var _classNames;

      var markPoint = typeof marks[point] === 'function' ? marks[point](h) : marks[point];
      var markPointIsObject = (typeof markPoint === 'undefined' ? 'undefined' : _typeof(markPoint)) === 'object' && !isValidElement(markPoint);
      var markLabel = markPointIsObject ? markPoint.label : markPoint;
      if (!markLabel && markLabel !== 0) {
        return null;
      }

      var isActive = !included && point === upperBound || included && point <= upperBound && point >= lowerBound;
      var markClassName = classNames((_classNames = {}, _defineProperty(_classNames, className + '-text', true), _defineProperty(_classNames, className + '-text-active', isActive), _classNames));

      var bottomStyle = _defineProperty({
        marginBottom: '-50%'
      }, reverse ? 'top' : 'bottom', (point - min) / range * 100 + '%');

      var leftStyle = _defineProperty({
        transform: 'translateX(-50%)',
        msTransform: 'translateX(-50%)'
      }, reverse ? 'right' : 'left', reverse ? (point - min / 4) / range * 100 + '%' : (point - min) / range * 100 + '%');

      var style = vertical ? bottomStyle : leftStyle;
      var markStyle = markPointIsObject ? _extends({}, style, markPoint.style) : style;
      return h(
        'span',
        {
          'class': markClassName,
          style: markStyle,
          key: point,
          on: {
            'mousedown': function mousedown(e) {
              return clickLabel(e, point);
            },
            'touchstart': function touchstart(e) {
              return clickLabel(e, point);
            }
          }
        },
        [markLabel]
      );
    });

    return h(
      'div',
      { 'class': className },
      [elements]
    );
  }
};

export default Marks;