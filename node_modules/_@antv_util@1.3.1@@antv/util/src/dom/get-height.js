/**
 * 获取高度
 * @param  {HTMLElement} el dom节点
 * @param  {Number} defaultValue 默认值
 * @return {Number} 高度
 */
module.exports = function getHeight(el, defaultValue) {
  let height = this.getStyle(el, 'height', defaultValue);
  if (height === 'auto') {
    height = el.offsetHeight;
  }
  return parseFloat(height);
};
