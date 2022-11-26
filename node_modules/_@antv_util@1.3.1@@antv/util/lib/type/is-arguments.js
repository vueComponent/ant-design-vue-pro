/**
 * 是否是参数类型
 *
 * @param {Object} value 测试的值
 * @return {Boolean}
 */
var isType = require('./is-type');

var isArguments = function isArguments(value) {
  return isType(value, 'Arguments');
};

module.exports = isArguments;