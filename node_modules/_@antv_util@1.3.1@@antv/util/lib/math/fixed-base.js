var fixedBase = function fixedBase(v, base) {
  var str = base.toString();
  var index = str.indexOf('.');
  if (index === -1) {
    return Math.round(v);
  }
  var length = str.substr(index + 1).length;
  if (length > 20) {
    length = 20;
  }
  return parseFloat(v.toFixed(length));
};

module.exports = fixedBase;