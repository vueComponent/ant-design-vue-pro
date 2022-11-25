var isFunction = require('./type/is-function');
var isArray = require('./type/is-array');
var groupBy = require('./group-by');

var groupToMap = function groupToMap(data, condition) {
  if (!condition) {
    return {
      0: data
    };
  }
  if (!isFunction(condition)) {
    var paramsCondition = isArray(condition) ? condition : condition.replace(/\s+/g, '').split('*');
    condition = function condition(row) {
      var unique = '_'; // 避免出现数字作为Key的情况，会进行按照数字的排序
      for (var i = 0, l = paramsCondition.length; i < l; i++) {
        unique += row[paramsCondition[i]] && row[paramsCondition[i]].toString();
      }
      return unique;
    };
  }
  var groups = groupBy(data, condition);
  return groups;
};

module.exports = groupToMap;