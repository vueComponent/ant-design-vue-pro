var each = require('./each');
var isArray = require('./type/is-array');
var hasOwnProperty = Object.prototype.hasOwnProperty;
var groupBy = function groupBy(data, condition) {
  if (!condition || !isArray(data)) {
    return data;
  }
  var result = {};
  var key = null;
  each(data, function (item) {
    key = condition(item);
    if (hasOwnProperty.call(result, key)) {
      result[key].push(item);
    } else {
      result[key] = [item];
    }
  });
  return result;
};

module.exports = groupBy;