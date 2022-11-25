/**
 * 是否是布尔类型
 *
 * @param {Object} value 测试的值
 * @return {Boolean}
 */
const isType = require('./is-type');

const isBoolean = function(value) {
  return isType(value, 'Boolean');
};

module.exports = isBoolean;
