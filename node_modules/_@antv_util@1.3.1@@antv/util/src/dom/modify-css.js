
module.exports = function modifyCSS(dom, css) {
  if (dom) {
    for (const key in css) {
      if (css.hasOwnProperty(key)) {
        dom.style[key] = css[key];
      }
    }
  }
  return dom;
};
