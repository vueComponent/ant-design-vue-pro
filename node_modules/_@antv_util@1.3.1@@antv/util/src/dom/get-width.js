/**
 * 获取宽度
 * @param  {HTMLElement} el  dom节点
 * @param  {Number} defaultValue 默认值
 * @return {Number} 宽度
 */
module.exports = function getWidth(el, defaultValue) {
  let width = this.getStyle(el, 'width', defaultValue);
  if (width === 'auto') {
    width = el.offsetWidth;
  }
  return parseFloat(width);
};
