/**
 * 判断是否数字
 * @return {Boolean} 是否数字
 */
var isType = require('./is-type');

var isNumber = function isNumber(value) {
  return isType(value, 'Number');
};
module.exports = isNumber;