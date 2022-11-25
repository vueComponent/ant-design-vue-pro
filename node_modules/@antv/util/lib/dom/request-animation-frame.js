
module.exports = function requestAnimationFrame(fn) {
  var method = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
    return setTimeout(fn, 16);
  };

  return method(fn);
};