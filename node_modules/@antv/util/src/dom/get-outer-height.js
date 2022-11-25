/**
 * 获取外层高度
 * @param  {HTMLElement} el dom节点
 * @param  {Number} defaultValue 默认值
 * @return {Number} 高度
 */
module.exports = function getOuterHeight(el, defaultValue) {
  const height = this.getHeight(el, defaultValue);
  const bTop = parseFloat(this.getStyle(el, 'borderTopWidth')) || 0;
  const pTop = parseFloat(this.getStyle(el, 'paddingTop')) || 0;
  const pBottom = parseFloat(this.getStyle(el, 'paddingBottom')) || 0;
  const bBottom = parseFloat(this.getStyle(el, 'borderBottomWidth')) || 0;
  return height + bTop + bBottom + pTop + pBottom;
};
