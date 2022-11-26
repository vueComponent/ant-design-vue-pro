/**
 * 是否为函数
 * @param  {*} fn 对象
 * @return {Boolean}  是否函数
 */
const isType = require('./is-type');

const isFunction = function(value) {
  return isType(value, 'Function');
};

module.exports = isFunction;
