'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = scrollTo;

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _getScroll = require('./getScroll');

var _getScroll2 = _interopRequireDefault(_getScroll);

var _easings = require('./easings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// interface ScrollToOptions {
//   /** Scroll container, default as window */
//   getContainer?: () => HTMLElement | Window;
//   /** Scroll end callback */
//   callback?: () => any;
//   /** Animation duration, default as 450 */
//   duration?: number;
// }

function scrollTo(y) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$getContainer = options.getContainer,
      getContainer = _options$getContainer === undefined ? function () {
    return window;
  } : _options$getContainer,
      callback = options.callback,
      _options$duration = options.duration,
      duration = _options$duration === undefined ? 450 : _options$duration;


  var container = getContainer();
  var scrollTop = (0, _getScroll2['default'])(container, true);
  var startTime = Date.now();

  var frameFunc = function frameFunc() {
    var timestamp = Date.now();
    var time = timestamp - startTime;
    var nextScrollTop = (0, _easings.easeInOutCubic)(time > duration ? duration : time, scrollTop, y, duration);
    if (container === window) {
      window.scrollTo(window.pageXOffset, nextScrollTop);
    } else {
      container.scrollTop = nextScrollTop;
    }
    if (time < duration) {
      (0, _raf2['default'])(frameFunc);
    } else if (typeof callback === 'function') {
      callback();
    }
  };
  (0, _raf2['default'])(frameFunc);
}