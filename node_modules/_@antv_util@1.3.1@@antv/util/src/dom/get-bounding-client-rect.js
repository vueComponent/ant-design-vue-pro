
module.exports = function getBoundingClientRect(node, defaultValue) {
  if (node && node.getBoundingClientRect) {
    const rect = node.getBoundingClientRect();
    const top = document.documentElement.clientTop;
    const left = document.documentElement.clientLeft;
    return {
      top: rect.top - top,
      bottom: rect.bottom - top,
      left: rect.left - left,
      right: rect.right - left
    };
  }
  return defaultValue || null;
};
