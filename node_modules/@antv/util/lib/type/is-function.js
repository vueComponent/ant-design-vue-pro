/**
 * 是否为函数
 * @param  {*} fn 对象
 * @return {Boolean}  是否函数
 */
var isType = require('./is-type');

var isFunction = function isFunction(value) {
  return isType(value, 'Function');
};

module.exports = isFunction;