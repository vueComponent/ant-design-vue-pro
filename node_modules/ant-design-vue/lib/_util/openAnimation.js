'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cssAnimation = require('./css-animation');

var _cssAnimation2 = _interopRequireDefault(_cssAnimation);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function animate(node, show, done) {
  var height = void 0;
  var requestAnimationFrameId = void 0;
  var appearRequestAnimationFrameId = void 0;
  return (0, _cssAnimation2['default'])(node, 'ant-motion-collapse-legacy', {
    start: function start() {
      if (appearRequestAnimationFrameId) {
        _raf2['default'].cancel(appearRequestAnimationFrameId);
      }
      if (!show) {
        node.style.height = node.offsetHeight + 'px';
        node.style.opacity = '1';
      } else {
        height = node.offsetHeight;
        // not get offsetHeight when appear
        // set it into raf get correct offsetHeight
        if (height === 0) {
          appearRequestAnimationFrameId = (0, _raf2['default'])(function () {
            height = node.offsetHeight;
            node.style.height = '0px';
            node.style.opacity = '0';
          });
        } else {
          node.style.height = '0px';
          node.style.opacity = '0';
        }
      }
    },
    active: function active() {
      if (requestAnimationFrameId) {
        _raf2['default'].cancel(requestAnimationFrameId);
      }
      requestAnimationFrameId = (0, _raf2['default'])(function () {
        node.style.height = (show ? height : 0) + 'px';
        node.style.opacity = show ? '1' : '0';
      });
    },
    end: function end() {
      if (appearRequestAnimationFrameId) {
        _raf2['default'].cancel(appearRequestAnimationFrameId);
      }
      if (requestAnimationFrameId) {
        _raf2['default'].cancel(requestAnimationFrameId);
      }
      node.style.height = '';
      node.style.opacity = '';
      done && done();
    }
  });
}

var animation = {
  enter: function enter(node, done) {
    _vue2['default'].nextTick(function () {
      animate(node, true, done);
    });
  },
  leave: function leave(node, done) {
    return animate(node, false, done);
  }
};

exports['default'] = animation;