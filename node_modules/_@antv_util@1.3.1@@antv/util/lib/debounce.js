
function debounce(func, wait, immediate) {
  var timeout = void 0;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

module.exports = debounce;