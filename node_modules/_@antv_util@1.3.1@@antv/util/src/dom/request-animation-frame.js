
module.exports = function requestAnimationFrame(fn) {
  const method = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) {
    return setTimeout(fn, 16);
  };

  return method(fn);
};
