/**
 * 获取外层宽度
 * @param  {HTMLElement} el dom节点
 * @param  {Number} defaultValue 默认值
 * @return {Number} 宽度
 */
module.exports = function getOuterWidth(el, defaultValue) {
  const width = this.getWidth(el, defaultValue);
  const bLeft = parseFloat(this.getStyle(el, 'borderLeftWidth')) || 0;
  const pLeft = parseFloat(this.getStyle(el, 'paddingLeft')) || 0;
  const pRight = parseFloat(this.getStyle(el, 'paddingRight')) || 0;
  const bRight = parseFloat(this.getStyle(el, 'borderRightWidth')) || 0;
  return width + bLeft + bRight + pLeft + pRight;
};
