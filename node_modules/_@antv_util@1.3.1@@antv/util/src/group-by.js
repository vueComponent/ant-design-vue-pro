const each = require('./each');
const isArray = require('./type/is-array');
const hasOwnProperty = Object.prototype.hasOwnProperty;
const groupBy = function(data, condition) {
  if (!condition || !isArray(data)) {
    return data;
  }
  const result = {};
  let key = null;
  each(data, function(item) {
    key = condition(item);
    if (hasOwnProperty.call(result, key)) {
      result[key].push(item);
    } else {
      result[key] = [ item ];
    }
  });
  return result;
};

module.exports = groupBy;

