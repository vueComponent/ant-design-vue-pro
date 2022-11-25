'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _warning = require('../../../_util/warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var calcPoints = function calcPoints(vertical, marks, dots, step, min, max) {
  (0, _warning2['default'])(dots ? step > 0 : true, 'Slider', '`Slider[step]` should be a positive number in order to make Slider[dots] work.');
  var points = Object.keys(marks).map(parseFloat).sort(function (a, b) {
    return a - b;
  });
  if (dots && step) {
    for (var i = min; i <= max; i += step) {
      if (points.indexOf(i) === -1) {
        points.push(i);
      }
    }
  }
  return points;
};

var Steps = {
  functional: true,
  render: function render(h, context) {
    var _context$props = context.props,
        prefixCls = _context$props.prefixCls,
        vertical = _context$props.vertical,
        reverse = _context$props.reverse,
        marks = _context$props.marks,
        dots = _context$props.dots,
        step = _context$props.step,
        included = _context$props.included,
        lowerBound = _context$props.lowerBound,
        upperBound = _context$props.upperBound,
        max = _context$props.max,
        min = _context$props.min,
        dotStyle = _context$props.dotStyle,
        activeDotStyle = _context$props.activeDotStyle;

    var range = max - min;
    var elements = calcPoints(vertical, marks, dots, step, min, max).map(function (point) {
      var _classNames;

      var offset = Math.abs(point - min) / range * 100 + '%';

      var isActived = !included && point === upperBound || included && point <= upperBound && point >= lowerBound;
      var style = vertical ? (0, _extends5['default'])({}, dotStyle, (0, _defineProperty3['default'])({}, reverse ? 'top' : 'bottom', offset)) : (0, _extends5['default'])({}, dotStyle, (0, _defineProperty3['default'])({}, reverse ? 'right' : 'left', offset));
      if (isActived) {
        style = (0, _extends5['default'])({}, style, activeDotStyle);
      }

      var pointClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-dot', true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-dot-active', isActived), (0, _defineProperty3['default'])(_classNames, prefixCls + '-dot-reverse', reverse), _classNames));

      return h('span', { 'class': pointClassName, style: style, key: point });
    });

    return h(
      'div',
      { 'class': prefixCls + '-step' },
      [elements]
    );
  }
};

exports['default'] = Steps;