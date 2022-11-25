module.exports = function (scale, limitRange, type) {
  if (!scale) return [0, 1];
  var minRatio = 0;
  var maxRatio = 0;

  if (type === 'linear') {
    var min = limitRange.min,
        max = limitRange.max;
    var range = max - min;
    minRatio = (scale.min - min) / range;
    maxRatio = (scale.max - min) / range;
  } else {
    var originValues = limitRange;
    var values = scale.values;
    var firstIndex = originValues.indexOf(values[0]);
    var lastIndex = originValues.indexOf(values[values.length - 1]);
    minRatio = firstIndex / (originValues.length - 1);
    maxRatio = lastIndex / (originValues.length - 1);
  }

  return [minRatio, maxRatio];
};