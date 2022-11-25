/**
 * 是否是参数类型
 *
 * @param {Object} value 测试的值
 * @return {Boolean}
 */
const isType = require('./is-type');

const isError = function(value) {
  return isType(value, 'Error');
};

module.exports = isError;
