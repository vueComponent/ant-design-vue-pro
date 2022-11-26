const isFunction = require('./type/is-function');
const isArray = require('./type/is-array');
const groupBy = require('./group-by');

const groupToMap = function(data, condition) {
  if (!condition) {
    return {
      0: data
    };
  }
  if (!isFunction(condition)) {
    const paramsCondition = isArray(condition) ? condition : condition.replace(/\s+/g, '').split('*');
    condition = function(row) {
      let unique = '_'; // 避免出现数字作为Key的情况，会进行按照数字的排序
      for (let i = 0, l = paramsCondition.length; i < l; i++) {
        unique += row[paramsCondition[i]] && row[paramsCondition[i]].toString();
      }
      return unique;
    };
  }
  const groups = groupBy(data, condition);
  return groups;
};

module.exports = groupToMap;
