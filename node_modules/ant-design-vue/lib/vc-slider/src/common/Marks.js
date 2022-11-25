'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propsUtil = require('../../../_util/props-util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
      var markPointIsObject = (typeof markPoint === 'undefined' ? 'undefined' : (0, _typeof3['default'])(markPoint)) === 'object' && !(0, _propsUtil.isValidElement)(markPoint);
      var markLabel = markPointIsObject ? markPoint.label : markPoint;
      if (!markLabel && markLabel !== 0) {
        return null;
      }

      var isActive = !included && point === upperBound || included && point <= upperBound && point >= lowerBound;
      var markClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, className + '-text', true), (0, _defineProperty3['default'])(_classNames, className + '-text-active', isActive), _classNames));

      var bottomStyle = (0, _defineProperty3['default'])({
        marginBottom: '-50%'
      }, reverse ? 'top' : 'bottom', (point - min) / range * 100 + '%');

      var leftStyle = (0, _defineProperty3['default'])({
        transform: 'translateX(-50%)',
        msTransform: 'translateX(-50%)'
      }, reverse ? 'right' : 'left', reverse ? (point - min / 4) / range * 100 + '%' : (point - min) / range * 100 + '%');

      var style = vertical ? bottomStyle : leftStyle;
      var markStyle = markPointIsObject ? (0, _extends3['default'])({}, style, markPoint.style) : style;
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

exports['default'] = Marks;