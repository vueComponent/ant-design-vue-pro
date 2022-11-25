const isNil = require('../type/is-nil');

/**
 * 获取样式
 * @param  {Object} dom DOM节点
 * @param  {String} name 样式名
 * @param  {Any} defaultValue 默认值
 * @return {String} 属性值
 */
module.exports = function getStyle(dom, name, defaultValue) {
  try {
    if (window.getComputedStyle) {
      return window.getComputedStyle(dom, null)[name];
    }
    return dom.currentStyle[name];
  } catch (e) {
    if (!isNil(defaultValue)) {
      return defaultValue;
    }
    return null;
  }
};
