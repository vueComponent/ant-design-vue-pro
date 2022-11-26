import raf from 'raf';
import getScroll from './getScroll';
import { easeInOutCubic } from './easings';

// interface ScrollToOptions {
//   /** Scroll container, default as window */
//   getContainer?: () => HTMLElement | Window;
//   /** Scroll end callback */
//   callback?: () => any;
//   /** Animation duration, default as 450 */
//   duration?: number;
// }

export default function scrollTo(y) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$getContainer = options.getContainer,
      getContainer = _options$getContainer === undefined ? function () {
    return window;
  } : _options$getContainer,
      callback = options.callback,
      _options$duration = options.duration,
      duration = _options$duration === undefined ? 450 : _options$duration;


  var container = getContainer();
  var scrollTop = getScroll(container, true);
  var startTime = Date.now();

  var frameFunc = function frameFunc() {
    var timestamp = Date.now();
    var time = timestamp - startTime;
    var nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration);
    if (container === window) {
      window.scrollTo(window.pageXOffset, nextScrollTop);
    } else {
      container.scrollTop = nextScrollTop;
    }
    if (time < duration) {
      raf(frameFunc);
    } else if (typeof callback === 'function') {
      callback();
    }
  };
  raf(frameFunc);
}