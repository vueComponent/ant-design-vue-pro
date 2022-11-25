/**
 * 判断是否数字
 * @return {Boolean} 是否数字
 */
const isType = require('./is-type');

const isNumber = function(value) {
  return isType(value, 'Number');
};
module.exports = isNumber;
