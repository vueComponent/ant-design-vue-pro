'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.formatTimeStr = formatTimeStr;
exports.formatCountdown = formatCountdown;

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

var _padStart = require('lodash/padStart');

var _padStart2 = _interopRequireDefault(_padStart);

var _interopDefault = require('../_util/interopDefault');

var _interopDefault2 = _interopRequireDefault(_interopDefault);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Countdown
var timeUnits = [['Y', 1000 * 60 * 60 * 24 * 365], // years
['M', 1000 * 60 * 60 * 24 * 30], // months
['D', 1000 * 60 * 60 * 24], // days
['H', 1000 * 60 * 60], // hours
['m', 1000 * 60], // minutes
['s', 1000], // seconds
['S', 1]];

function formatTimeStr(duration, format) {
  var leftDuration = duration;

  var escapeRegex = /\[[^\]]*\]/g;
  var keepList = (format.match(escapeRegex) || []).map(function (str) {
    return str.slice(1, -1);
  });
  var templateText = format.replace(escapeRegex, '[]');

  var replacedText = timeUnits.reduce(function (current, _ref) {
    var _ref2 = (0, _slicedToArray3['default'])(_ref, 2),
        name = _ref2[0],
        unit = _ref2[1];

    if (current.indexOf(name) !== -1) {
      var value = Math.floor(leftDuration / unit);
      leftDuration -= value * unit;
      return current.replace(new RegExp(name + '+', 'g'), function (match) {
        var len = match.length;
        return (0, _padStart2['default'])(value.toString(), len, '0');
      });
    }
    return current;
  }, templateText);

  var index = 0;
  return replacedText.replace(escapeRegex, function () {
    var match = keepList[index];
    index += 1;
    return match;
  });
}

function formatCountdown(value, config) {
  var _config$format = config.format,
      format = _config$format === undefined ? '' : _config$format;

  var target = (0, _interopDefault2['default'])(moment)(value).valueOf();
  var current = (0, _interopDefault2['default'])(moment)().valueOf();
  var diff = Math.max(target - current, 0);
  return formatTimeStr(diff, format);
}