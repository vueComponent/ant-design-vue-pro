
module.exports = function getBoundingClientRect(node, defaultValue) {
  if (node && node.getBoundingClientRect) {
    var rect = node.getBoundingClientRect();
    var top = document.documentElement.clientTop;
    var left = document.documentElement.clientLeft;
    return {
      top: rect.top - top,
      bottom: rect.bottom - top,
      left: rect.left - left,
      right: rect.right - left
    };
  }
  return defaultValue || null;
};