'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleGradient = exports.sortGradient = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * {
 *   '0%': '#afc163',
 *   '75%': '#009900',
 *   '50%': 'green',     ====>     '#afc163 0%, #66FF00 25%, #00CC00 50%, #009900 75%, #ffffff 100%'
 *   '25%': '#66FF00',
 *   '100%': '#ffffff'
 * }
 */
var sortGradient = exports.sortGradient = function sortGradient(gradients) {
  var tempArr = [];
  // eslint-disable-next-line no-restricted-syntax
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.entries(gradients)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;

      var _ref2 = (0, _slicedToArray3['default'])(_ref, 2);

      var key = _ref2[0];
      var value = _ref2[1];

      var formatKey = parseFloat(key.replace(/%/g, ''));
      if (isNaN(formatKey)) {
        return {};
      }
      tempArr.push({
        key: formatKey,
        value: value
      });
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  tempArr = tempArr.sort(function (a, b) {
    return a.key - b.key;
  });
  return tempArr.map(function (_ref3) {
    var key = _ref3.key,
        value = _ref3.value;
    return value + ' ' + key + '%';
  }).join(', ');
};

/**
 * {
 *   '0%': '#afc163',
 *   '25%': '#66FF00',
 *   '50%': '#00CC00',     ====>  linear-gradient(to right, #afc163 0%, #66FF00 25%,
 *   '75%': '#009900',              #00CC00 50%, #009900 75%, #ffffff 100%)
 *   '100%': '#ffffff'
 * }
 *
 * Then this man came to realize the truth:
 * Besides six pence, there is the moon.
 * Besides bread and butter, there is the bug.
 * And...
 * Besides women, there is the code.
 */
var handleGradient = function handleGradient(strokeColor) {
  var _strokeColor$from = strokeColor.from,
      from = _strokeColor$from === undefined ? '#1890ff' : _strokeColor$from,
      _strokeColor$to = strokeColor.to,
      to = _strokeColor$to === undefined ? '#1890ff' : _strokeColor$to,
      _strokeColor$directio = strokeColor.direction,
      direction = _strokeColor$directio === undefined ? 'to right' : _strokeColor$directio,
      rest = (0, _objectWithoutProperties3['default'])(strokeColor, ['from', 'to', 'direction']);

  if (Object.keys(rest).length !== 0) {
    var sortedGradients = sortGradient(rest);
    return { backgroundImage: 'linear-gradient(' + direction + ', ' + sortedGradients + ')' };
  }
  return { backgroundImage: 'linear-gradient(' + direction + ', ' + from + ', ' + to + ')' };
};

exports.handleGradient = handleGradient;
var Line = {
  functional: true,
  render: function render(h, context) {
    var props = context.props,
        children = context.children;
    var prefixCls = props.prefixCls,
        percent = props.percent,
        successPercent = props.successPercent,
        strokeWidth = props.strokeWidth,
        size = props.size,
        strokeColor = props.strokeColor,
        strokeLinecap = props.strokeLinecap;

    var backgroundProps = void 0;
    if (strokeColor && typeof strokeColor !== 'string') {
      backgroundProps = handleGradient(strokeColor);
    } else {
      backgroundProps = {
        background: strokeColor
      };
    }
    var percentStyle = (0, _extends3['default'])({
      width: (0, _utils.validProgress)(percent) + '%',
      height: (strokeWidth || (size === 'small' ? 6 : 8)) + 'px',
      background: strokeColor,
      borderRadius: strokeLinecap === 'square' ? 0 : '100px'
    }, backgroundProps);
    var successPercentStyle = {
      width: (0, _utils.validProgress)(successPercent) + '%',
      height: (strokeWidth || (size === 'small' ? 6 : 8)) + 'px',
      borderRadius: strokeLinecap === 'square' ? 0 : ''
    };
    var successSegment = successPercent !== undefined ? h('div', { 'class': prefixCls + '-success-bg', style: successPercentStyle }) : null;
    return h('div', [h(
      'div',
      { 'class': prefixCls + '-outer' },
      [h(
        'div',
        { 'class': prefixCls + '-inner' },
        [h('div', { 'class': prefixCls + '-bg', style: percentStyle }), successSegment]
      )]
    ), children]);
  }
};

exports['default'] = Line;