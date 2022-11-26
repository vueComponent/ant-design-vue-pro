const fixedBase = function(v, base) {
  const str = base.toString();
  const index = str.indexOf('.');
  if (index === -1) {
    return Math.round(v);
  }
  let length = str.substr(index + 1).length;
  if (length > 20) {
    length = 20;
  }
  return parseFloat(v.toFixed(length));
};

module.exports = fixedBase;
