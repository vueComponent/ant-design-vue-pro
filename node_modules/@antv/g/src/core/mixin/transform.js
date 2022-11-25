const Util = require('../../util/index');

// 是否未改变
function isUnchanged(m) {
  return m[0] === 1 && m[1] === 0 && m[3] === 0 && m[4] === 1 && m[6] === 0 && m[7] === 0;
}

// 是否仅仅是scale
function isScale(m) {
  return m[1] === 0 && m[3] === 0 && m[6] === 0 && m[7] === 0;
}

function multiple(m1, m2) {
  if (!isUnchanged(m2)) {
    if (isScale(m2)) {
      m1[0] *= m2[0];
      m1[4] *= m2[4];
    } else {
      Util.mat3.multiply(m1, m1, m2);
    }
  }
}

module.exports = {
  initTransform() {},
  resetMatrix() {
    this.attr('matrix', [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]);
  },
  translate(tx, ty) {
    const matrix = this._attrs.matrix;
    Util.mat3.translate(matrix, matrix, [ tx, ty ]);
    this.clearTotalMatrix();
    this.attr('matrix', matrix);
    return this;
  },
  rotate(radian) {
    const matrix = this._attrs.matrix;
    Util.mat3.rotate(matrix, matrix, radian);
    this.clearTotalMatrix();
    this.attr('matrix', matrix);
    return this;
  },
  scale(s1, s2) {
    const matrix = this._attrs.matrix;
    Util.mat3.scale(matrix, matrix, [ s1, s2 ]);
    this.clearTotalMatrix();
    this.attr('matrix', matrix);
    return this;
  },
  rotateAtStart(rotate) {
    const x = this._attrs.x || this._cfg.attrs.x;
    const y = this._attrs.y || this._cfg.attrs.y;
    if (Math.abs(rotate) > Math.PI * 2) {
      rotate = rotate / 180 * Math.PI;
    }
    return this.transform([
      [ 't', -x, -y ],
      [ 'r', rotate ],
      [ 't', x, y ]
    ]);
  },
  move(x, y) {
    const cx = this.get('x') || 0; // 当前的x
    const cy = this.get('y') || 0; // 当前的y
    this.translate(x - cx, y - cy);
    this.set('x', x);
    this.set('y', y);
    return this;
  },
  transform(ts) {
    const self = this;
    const matrix = this._attrs.matrix;

    Util.each(ts, function(t) {
      switch (t[0]) {
        case 't':
          self.translate(t[1], t[2]);
          break;
        case 's':
          self.scale(t[1], t[2]);
          break;
        case 'r':
          self.rotate(t[1]);
          break;
        case 'm':
          self.attr('matrix', Util.mat3.multiply([], matrix, t[1]));
          self.clearTotalMatrix();
          break;
        default:
          break;
      }
    });
    return self;
  },
  setTransform(ts) {
    this.attr('matrix', [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]);
    return this.transform(ts);
  },
  getMatrix() {
    return this.attr('matrix');
  },
  setMatrix(m) {
    this.attr('matrix', m);
    this.clearTotalMatrix();
    return this;
  },
  apply(v, root) {
    let m;
    if (root) {
      m = this._getMatrixByRoot(root);
    } else {
      m = this.attr('matrix');
    }
    Util.vec3.transformMat3(v, v, m);
    return this;
  },
  // 获取到达指定根节点的矩阵
  _getMatrixByRoot(root) {
    const self = this;
    root = root || self;
    let parent = self;
    const parents = [];

    while (parent !== root) {
      parents.unshift(parent);
      parent = parent.get('parent');
    }
    parents.unshift(parent);

    const m = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
    Util.each(parents, function(child) {
      Util.mat3.multiply(m, child.attr('matrix'), m);
    });
    return m;
  },
  /**
   * 应用到当前元素上的总的矩阵
   * @return {Matrix} 矩阵
   */
  getTotalMatrix() {
    let m = this._cfg.totalMatrix;
    if (!m) {
      m = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
      const parent = this._cfg.parent;
      if (parent) {
        const pm = parent.getTotalMatrix();
        multiple(m, pm);
      }

      multiple(m, this.attr('matrix'));
      this._cfg.totalMatrix = m;
    }
    return m;
  },
  // 清除当前的矩阵
  clearTotalMatrix() {
    // this._cfg.totalMatrix = null;
  },
  invert(v) {
    const m = this.getTotalMatrix();
    // 单精屏幕下大多数矩阵没变化
    if (isScale(m)) {
      v[0] /= m[0];
      v[1] /= m[4];
    } else {
      const inm = Util.mat3.invert([], m);
      if (inm) {
        Util.vec3.transformMat3(v, v, inm);
      }
    }
    return this;
  },
  resetTransform(context) {
    const mo = this.attr('matrix');
    // 不改变时
    if (!isUnchanged(mo)) {
      context.transform(mo[0], mo[1], mo[3], mo[4], mo[6], mo[7]);
    }
  }
};
