const Util = require('../../util/index');

const ReservedProps = { delay: 'delay', rotate: 'rotate' };
const colorRalaredProps = { fill: 'fill', stroke: 'stroke', fillStyle: 'fillStyle', strokeStyle: 'strokeStyle' };

function getFromAttrs(toAttrs, shape) {
  const rst = {};
  const attrs = shape._attrs;
  for (const k in toAttrs.attrs) {
    rst[k] = attrs[k];
  }
  return rst;
}

function getFormatProps(props, shape) {
  const rst = {
    matrix: null,
    attrs: {}
  };
  const attrs = shape._attrs;
  for (const k in props) {
    if (k === 'transform') {
      rst.matrix = Util.transform(shape.getMatrix(), props[k]);
    } else if (k === 'rotate') {
      rst.matrix = Util.transform(shape.getMatrix(), [[ 'r', props[k] ]]);
    } else if (k === 'matrix') {
      rst.matrix = props[k];
    } else if (colorRalaredProps[k] && /^[r,R,L,l]{1}[\s]*\(/.test(props[k])) {
      // 渐变色不支持动画
      continue;
    } else if (!ReservedProps[k] && attrs[k] !== props[k]) {
      rst.attrs[k] = props[k];
    }
  }
  return rst;
}

function checkExistedAttrs(animators, animator) {
  const delay = animator.delay;
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  Util.each(animator.toAttrs, (v, k) => {
    Util.each(animators, animator => {
      if (delay < animator.startTime + animator.duration) {
        if (hasOwnProperty.call(animator.toAttrs, k)) {
          delete animator.toAttrs[k];
          delete animator.fromAttrs[k];
        }
      }
    });
  });
  if (animator.toMatrix) {
    Util.each(animators, animator => {
      if (delay < (animator.startTime + animator.duration) && animator.toMatrix) {
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
  animate(toProps, duration, easing, callback, delay = 0) {
    const self = this;
    self.set('animating', true);
    let timeline = self.get('timeline');
    if (!timeline) {
      timeline = self.get('canvas').get('timeline');
      self.setSilent('timeline', timeline);
    }
    let animators = self.get('animators') || [];
    // 初始化tick
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
    const formatProps = getFormatProps(toProps, self);

    // 记录动画属性
    const animator = {
      fromAttrs: getFromAttrs(formatProps, self),
      toAttrs: formatProps.attrs,
      fromMatrix: Util.clone(self.getMatrix()),
      toMatrix: formatProps.matrix,
      duration,
      easing,
      callback,
      delay,
      startTime: timeline.getTime(),
      id: Util.uniqueId()
    };
    // 如果动画队列中已经有这个图形了
    if (animators.length > 0) {
      // 先检查是否需要合并属性。若有相同的动画，将该属性从前一个动画中删除,直接用后一个动画中
      animators = checkExistedAttrs(animators, animator);
    } else {
      // 否则将图形添加到队列
      timeline.addAnimator(self);
    }
    animators.push(animator);
    self.setSilent('animators', animators);
    self.setSilent('pause', { isPaused: false });
  },
  stopAnimate() {
    const animators = this.get('animators');
    // 将动画执行到最后一帧，执行回调
    Util.each(animators, animator => {
      this.attr(animator.toAttrs);
      if (animator.toMatrix) {
        this.attr('matrix', animator.toMatrix);
      }
      if (animator.callback) {
        animator.callback();
      }
    });
    this.setSilent('animating', false);
    this.setSilent('animators', []);
  },
  pauseAnimate() {
    const self = this;
    const timeline = self.get('timeline');
    // 记录下是在什么时候暂停的
    self.setSilent('pause', {
      isPaused: true,
      pauseTime: timeline.getTime()
    });
    return self;
  },
  resumeAnimate() {
    const self = this;
    const timeline = self.get('timeline');
    const current = timeline.getTime();
    const animators = self.get('animators');
    const pauseTime = self.get('pause').pauseTime;
    // 之后更新属性需要计算动画已经执行的时长，如果暂停了，就把初始时间调后
    Util.each(animators, animator => {
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
