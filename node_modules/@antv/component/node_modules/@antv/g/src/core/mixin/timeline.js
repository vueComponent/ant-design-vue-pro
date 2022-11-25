const Util = require('../../util/index');
const PathUtil = require('../../util/path');
const d3Timer = require('d3-timer');
const d3Ease = require('d3-ease');
const { interpolate, interpolateArray } = require('d3-interpolate'); // 目前整体动画只需要数值和数组的差值计算

const Timeline = function(canvas) {
  // 待执行动画的队列
  this._animators = [];
  // 当前时间
  this._current = 0;
  // 计时器实例
  this._timer = null;
  // 画布
  this.canvas = canvas;
};

function _update(self, animator, ratio) {
  const cProps = {}; // 此刻属性
  const toAttrs = animator.toAttrs;
  const fromAttrs = animator.fromAttrs;
  const toMatrix = animator.toMatrix;
  if (self.get('destroyed')) {
    return;
  }
  let interf; //  差值函数
  for (const k in toAttrs) {
    if (!Util.isEqual(fromAttrs[k], toAttrs[k])) {
      if (k === 'path') {
        let toPath = toAttrs[k];
        let fromPath = fromAttrs[k];
        if (toPath.length > fromPath.length) {
          toPath = PathUtil.parsePathString(toAttrs[k]); // 终点状态
          fromPath = PathUtil.parsePathString(fromAttrs[k]); // 起始状态
          fromPath = PathUtil.fillPathByDiff(fromPath, toPath);
          fromPath = PathUtil.formatPath(fromPath, toPath);
          animator.fromAttrs.path = fromPath;
          animator.toAttrs.path = toPath;
        } else if (!animator.pathFormatted) {
          toPath = PathUtil.parsePathString(toAttrs[k]);
          fromPath = PathUtil.parsePathString(fromAttrs[k]);
          fromPath = PathUtil.formatPath(fromPath, toPath);
          animator.fromAttrs.path = fromPath;
          animator.toAttrs.path = toPath;
          animator.pathFormatted = true;
        }
        cProps[k] = [];
        for (let i = 0; i < toPath.length; i++) {
          const toPathPoint = toPath[i];
          const fromPathPoint = fromPath[i];
          const cPathPoint = [];
          for (let j = 0; j < toPathPoint.length; j++) {
            if (Util.isNumber(toPathPoint[j]) && fromPathPoint && Util.isNumber(fromPathPoint[j])) {
              interf = interpolate(fromPathPoint[j], toPathPoint[j]);
              cPathPoint.push(interf(ratio));
            } else {
              cPathPoint.push(toPathPoint[j]);
            }
          }
          cProps[k].push(cPathPoint);
        }
      } else {
        interf = interpolate(fromAttrs[k], toAttrs[k]);
        cProps[k] = interf(ratio);
      }
    }
  }
  if (toMatrix) {
    const mf = interpolateArray(animator.fromMatrix, toMatrix);
    const cM = mf(ratio);
    self.setMatrix(cM);
  }
  self.attr(cProps);
}

function update(shape, animator, elapsed) {
  const startTime = animator.startTime;
  // 如果还没有开始执行或暂停，先不更新
  if (elapsed < (startTime + animator.delay) || animator.isPaused) {
    return false;
  }
  let ratio;
  const duration = animator.duration;
  const easing = animator.easing;
  // 已执行时间
  elapsed = elapsed - startTime - animator.delay;
  if (animator.toAttrs.repeat) {
    ratio = (elapsed % duration) / duration;
    ratio = d3Ease[easing](ratio);
  } else {
    ratio = elapsed / duration;
    if (ratio < 1) {
      ratio = d3Ease[easing](ratio);
    } else {
      shape.attr(animator.toAttrs);
      if (animator.toMatrix) {
        shape.setMatrix(animator.toMatrix);
      }
      return true;
    }
  }

  _update(shape, animator, ratio);
  return false;
}

Util.augment(Timeline, {
  initTimer() {
    const self = this;
    let isFinished = false;
    let shape,
      animators,
      animator;
    self._timer = d3Timer.timer(elapsed => {
      self._current = elapsed;
      if (this._animators.length > 0) {
        for (let i = this._animators.length - 1; i >= 0; i--) {
          shape = this._animators[i];
          if (shape.get('destroyed')) {
            // 如果已经被销毁，直接移出队列
            self.removeAnimator(i);
            continue;
          }
          if (!shape.get('pause').isPaused) {
            animators = shape.get('animators');
            for (let j = animators.length - 1; j >= 0; j--) {
              animator = animators[j];
              isFinished = update(shape, animator, elapsed);
              if (isFinished) {
                animators.splice(j, 1);
                isFinished = false;
                if (animator.callback) {
                  animator.callback();
                }
              }
            }
          }
          if (animators.length === 0) {
            self.removeAnimator(i);
          }
        }
        this.canvas.draw();
      }
    });
  },
  addAnimator(shape) {
    this._animators.push(shape);
  },
  removeAnimator(index) {
    this._animators.splice(index, 1);
  },
  isAnimating() {
    return !!this._animators.length;
  },
  stop() {
    if (this._timer) {
      this._timer.stop();
    }
  },
  stopAllAnimations() {
    this._animators.forEach(animator => {
      animator.stopAnimate();
    });
    this._animators = [];
    this.canvas.draw();
  },
  getTime() {
    return this._current;
  }
});

module.exports = Timeline;
