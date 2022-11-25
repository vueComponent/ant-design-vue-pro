import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import * as moment from 'moment';
import padStart from 'lodash/padStart';

import interopDefault from '../_util/interopDefault';

// Countdown
var timeUnits = [['Y', 1000 * 60 * 60 * 24 * 365], // years
['M', 1000 * 60 * 60 * 24 * 30], // months
['D', 1000 * 60 * 60 * 24], // days
['H', 1000 * 60 * 60], // hours
['m', 1000 * 60], // minutes
['s', 1000], // seconds
['S', 1]];

export function formatTimeStr(duration, format) {
  var leftDuration = duration;

  var escapeRegex = /\[[^\]]*\]/g;
  var keepList = (format.match(escapeRegex) || []).map(function (str) {
    return str.slice(1, -1);
  });
  var templateText = format.replace(escapeRegex, '[]');

  var replacedText = timeUnits.reduce(function (current, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        unit = _ref2[1];

    if (current.indexOf(name) !== -1) {
      var value = Math.floor(leftDuration / unit);
      leftDuration -= value * unit;
      return current.replace(new RegExp(name + '+', 'g'), function (match) {
        var len = match.length;
        return padStart(value.toString(), len, '0');
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

export function formatCountdown(value, config) {
  var _config$format = config.format,
      format = _config$format === undefined ? '' : _config$format;

  var target = interopDefault(moment)(value).valueOf();
  var current = interopDefault(moment)().valueOf();
  var diff = Math.max(target - current, 0);
  return formatTimeStr(diff, format);
}