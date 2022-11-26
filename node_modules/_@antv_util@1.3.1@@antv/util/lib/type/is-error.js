/**
 * 是否是参数类型
 *
 * @param {Object} value 测试的值
 * @return {Boolean}
 */
var isType = require('./is-type');

var isError = function isError(value) {
  return isType(value, 'Error');
};

module.exports = isError;