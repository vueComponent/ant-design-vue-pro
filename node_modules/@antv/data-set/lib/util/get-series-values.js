module.exports = function (extent, bw) {
  var bandwidth = bw || 1;
  var min = extent[0],
      max = extent[1];
  var values = [];
  var tmp = min;

  while (tmp < max) {
    values.push(tmp);
    tmp += bandwidth;
  }

  values.push(max);
  return values;
};