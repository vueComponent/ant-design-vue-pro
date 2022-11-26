'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vcProgress = require('../vc-progress');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var statusColorMap = {
  normal: '#108ee9',
  exception: '#ff5500',
  success: '#87d068'
};

function getPercentage(_ref) {
  var percent = _ref.percent,
      successPercent = _ref.successPercent;

  var ptg = (0, _utils.validProgress)(percent);
  if (!successPercent) return ptg;

  var successPtg = (0, _utils.validProgress)(successPercent);
  return [successPercent, (0, _utils.validProgress)(ptg - successPtg)];
}

function getStrokeColor(_ref2) {
  var progressStatus = _ref2.progressStatus,
      successPercent = _ref2.successPercent,
      strokeColor = _ref2.strokeColor;

  var color = strokeColor || statusColorMap[progressStatus];
  if (!successPercent) return color;
  return [statusColorMap.success, color];
}

var Circle = {
  functional: true,
  render: function render(h, context) {
    var _wrapperClassName;

    var props = context.props,
        children = context.children;
    var prefixCls = props.prefixCls,
        width = props.width,
        strokeWidth = props.strokeWidth,
        trailColor = props.trailColor,
        strokeLinecap = props.strokeLinecap,
        gapPosition = props.gapPosition,
        gapDegree = props.gapDegree,
        type = props.type;

    var circleSize = width || 120;
    var circleStyle = {
      width: typeof circleSize === 'number' ? circleSize + 'px' : circleSize,
      height: typeof circleSize === 'number' ? circleSize + 'px' : circleSize,
      fontSize: circleSize * 0.15 + 6
    };
    var circleWidth = strokeWidth || 6;
    var gapPos = gapPosition || type === 'dashboard' && 'bottom' || 'top';
    var gapDeg = gapDegree || type === 'dashboard' && 75;
    var strokeColor = getStrokeColor(props);
    var isGradient = Object.prototype.toString.call(strokeColor) === '[object Object]';

    var wrapperClassName = (_wrapperClassName = {}, (0, _defineProperty3['default'])(_wrapperClassName, prefixCls + '-inner', true), (0, _defineProperty3['default'])(_wrapperClassName, prefixCls + '-circle-gradient', isGradient), _wrapperClassName);

    return h(
      'div',
      { 'class': wrapperClassName, style: circleStyle },
      [h(_vcProgress.Circle, {
        attrs: {
          percent: getPercentage(props),
          strokeWidth: circleWidth,
          trailWidth: circleWidth,
          strokeColor: strokeColor,
          strokeLinecap: strokeLinecap,
          trailColor: trailColor,
          prefixCls: prefixCls,
          gapDegree: gapDeg,
          gapPosition: gapPos
        }
      }), children]
    );
  }
};

exports['default'] = Circle;