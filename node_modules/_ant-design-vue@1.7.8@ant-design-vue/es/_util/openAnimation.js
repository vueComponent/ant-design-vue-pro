import cssAnimation from './css-animation';
import raf from 'raf';
import Vue from 'vue';

function animate(node, show, done) {
  var height = void 0;
  var requestAnimationFrameId = void 0;
  var appearRequestAnimationFrameId = void 0;
  return cssAnimation(node, 'ant-motion-collapse-legacy', {
    start: function start() {
      if (appearRequestAnimationFrameId) {
        raf.cancel(appearRequestAnimationFrameId);
      }
      if (!show) {
        node.style.height = node.offsetHeight + 'px';
        node.style.opacity = '1';
      } else {
        height = node.offsetHeight;
        // not get offsetHeight when appear
        // set it into raf get correct offsetHeight
        if (height === 0) {
          appearRequestAnimationFrameId = raf(function () {
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
        raf.cancel(requestAnimationFrameId);
      }
      requestAnimationFrameId = raf(function () {
        node.style.height = (show ? height : 0) + 'px';
        node.style.opacity = show ? '1' : '0';
      });
    },
    end: function end() {
      if (appearRequestAnimationFrameId) {
        raf.cancel(appearRequestAnimationFrameId);
      }
      if (requestAnimationFrameId) {
        raf.cancel(requestAnimationFrameId);
      }
      node.style.height = '';
      node.style.opacity = '';
      done && done();
    }
  });
}

var animation = {
  enter: function enter(node, done) {
    Vue.nextTick(function () {
      animate(node, true, done);
    });
  },
  leave: function leave(node, done) {
    return animate(node, false, done);
  }
};

export default animation;