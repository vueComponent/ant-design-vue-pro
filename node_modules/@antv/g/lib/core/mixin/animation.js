function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Util = require('../../util/index');

var ReservedProps = {
  delay: 'delay',
  repeat: 'repeat',
  rotate: 'rotate'
};

function getFromAttrs(toAttrs, shape) {
  var rst = {};
  var attrs = shape._attrs;

  for (var k in toAttrs.attrs) {
    rst[k] = attrs[k];
  }

  return rst;
}

function getFormatProps(props, shape) {
  var rst = {
    matrix: null,
    attrs: {}
  };
  var attrs = shape._attrs;

  for (var k in props) {
    if (k === 'transform') {
      rst.matrix = Util.transform(shape.getMatrix(), props[k]);
    } else if (k === 'matrix') {
      rst.matrix = props[k];
    } else if (Util.isColorProp(k) && Util.isGradientColor(props[k])) {
      // 渐变色不支持动画, 直接跳色
      rst.attrs[k] = props[k];
    } else if (!ReservedProps[k] && attrs[k] !== props[k]) {
      if (k === 'rotate') {
        shape._attrs.rotate = shape._attrs.rotate || 0;
      }

      rst.attrs[k] = props[k];
    }
  }

  return rst;
}

function checkExistedAttrs(animators, animator) {
  if (animator.onFrame) {
    return animators;
  }

  var delay = animator.delay;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  Util.each(animator.toAttrs, function (v, k) {
    Util.each(animators, function (animator) {
      if (delay < animator.startTime + animator.duration) {
        if (hasOwnProperty.call(animator.toAttrs, k)) {
          delete animator.toAttrs[k];
          delete animator.fromAttrs[k];
        }
      }
    });
  });

  if (animator.toMatrix) {
    Util.each(animators, function (animator) {
      if (delay < animator.startTime + animator.duration && animator.toMatrix) {
        delete animator.toMatrix;
      }
    });
  }

  return animators;
}

module.exports = {
  /**
   * 执行动画
   * @param  {Object}   toProps  动画最终状态
   * @param  {Number}   duration 动画执行时间
   * @param  {String}   easing   动画缓动效果
   * @param  {Function} callback 动画执行后的回调
   * @param  {Number}   delay    动画延迟时间
   */
  animate: function animate(toProps, duration, easing, callback, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    var self = this;
    self.set('animating', true);
    var timeline = self.get('timeline');

    if (!timeline) {
      timeline = self.get('canvas').get('timeline');
      self.setSilent('timeline', timeline);
    }

    var animators = self.get('animators') || []; // 初始化tick

    if (!timeline._timer) {
      timeline.initTimer();
    }

    if (Util.isNumber(callback)) {
      delay = callback;
      callback = null;
    }

    if (Util.isFunction(easing)) {
      callback = easing;
      easing = 'easeLinear';
    } else {
      easing = easing ? easing : 'easeLinear';
    }

    var animator = {
      repeat: toProps.repeat,
      duration: duration,
      easing: easing,
      callback: callback,
      delay: delay,
      startTime: timeline.getTime(),
      id: Util.uniqueId()
    };

    if (toProps.onFrame) {
      animator.onFrame = toProps.onFrame;
    } else {
      var formatProps = getFormatProps(toProps, self);
      animator = _extends({
        fromAttrs: getFromAttrs(formatProps, self),
        toAttrs: formatProps.attrs,
        fromMatrix: Util.clone(self.getMatrix()),
        toMatrix: formatProps.matrix
      }, animator);
    } // 如果动画队列中已经有这个图形了


    if (animators.length > 0) {
      // 先检查是否需要合并属性。若有相同的动画，将该属性从前一个动画中删除,直接用后一个动画中
      animators = checkExistedAttrs(animators, animator);
    } else {
      // 否则将图形添加到队列
      timeline.addAnimator(self);
    }

    animators.push(animator);
    self.setSilent('animators', animators);
    self.setSilent('pause', {
      isPaused: false
    });
  },
  stopAnimate: function stopAnimate() {
    var _this = this;

    var animators = this.get('animators'); // 将动画执行到最后一帧，执行回调

    Util.each(animators, function (animator) {
      _this.attr(animator.toAttrs || animator.onFrame(1));

      if (animator.toMatrix) {
        _this.attr('matrix', animator.toMatrix);
      }

      if (animator.callback) {
        animator.callback();
      }
    });
    this.setSilent('animating', false);
    this.setSilent('animators', []);
  },
  pauseAnimate: function pauseAnimate() {
    var self = this;
    var timeline = self.get('timeline'); // 记录下是在什么时候暂停的

    self.setSilent('pause', {
      isPaused: true,
      pauseTime: timeline.getTime()
    });
    return self;
  },
  resumeAnimate: function resumeAnimate() {
    var self = this;
    var timeline = self.get('timeline');
    var current = timeline.getTime();
    var animators = self.get('animators');
    var pauseTime = self.get('pause').pauseTime; // 之后更新属性需要计算动画已经执行的时长，如果暂停了，就把初始时间调后

    Util.each(animators, function (animator) {
      animator.startTime = animator.startTime + (current - pauseTime);
      animator._paused = false;
      animator._pauseTime = null;
    });
    self.setSilent('pause', {
      isPaused: false
    });
    self.setSilent('animators', animators);
    return self;
  }
};