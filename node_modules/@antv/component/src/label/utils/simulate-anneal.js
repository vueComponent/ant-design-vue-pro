const Base = require('../../base');

class SimulateAnneal extends Base {
  getDefaultCfg() {
    return {
      // 最大移动距离
      maxMove: 5,
      // 线长的权重
      lineLength: 0.2,
      // 线碰撞权重
      intersect: 1,
      // 标签与标签碰撞权重
      labelToLabel: 30,
      // 标签与别的shape碰撞权重
      labelToShape: 30,
      // 标签偏移
      orient: 3,
      // 迭代次数
      iteration: 200,
      // 退火阈值
      threshold: 0.1
    };
  }
  // 简单的图形碰撞检测
  _intersect(x1, x2, x3, x4, y1, y2, y3, y4) {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    const numera = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
    const numerb = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
    const mua = numera / denom;
    const mub = numerb / denom;
    if (!(mua < 0 || mua > 1 || mub < 0 || mub > 1)) {
      return true;
    }
    return false;
  }
  // 计算重排一个label后的能量值
  energy(index) {
    const self = this;
    const labels = self.get('labels');
    const shapes = self.get('shapes');
    const labelLen = labels.length;
    const label = labels[index];
    const shape = shapes[index];
    const bbox = label.getBBox();
    let energy = 0;
    let dx = labels[index].attr('x') - shapes[index].attr('x');
    let dy = labels[index].attr('y') - shapes[index].attr('y');
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      energy += dist * self.get('lineLength');
    }

    dx /= dist;
    dy /= dist;
    if (dx > 0 && dy > 0) {
      energy += 0;
    } else if (dx < 0 && dy > 0) {
      energy += self.get('orient');
    } else if (dx < 0 && dy < 0) {
      energy += self.get('orient') * 2;
    } else {
      energy += self.get('orient') * 3;
    }
    let overlap,
      overlapX,
      overlapY,
      temp,
      tempBBox,
      tempShape,
      tempShapeBBox;
    for (let i = 0; i < labelLen; i++) {
      temp = labels[i];
      tempBBox = temp.getBBox();
      tempShape = shapes[i];
      tempShapeBBox = tempShape.getBBox();
      // 标签与标签碰撞增加能量
      if (i !== index) {
        overlap = self._intersect(shape.attr('x'), label.attr('x'), tempShape.attr('x'), temp.attr('x'),
          shape.attr('y'), label.attr('y'), tempShape.attr('y'), temp.attr('y'));
        if (overlap) {
          energy += self.get('intersect');
        }
        overlapX = Math.max(0, Math.min(tempBBox.maxX, bbox.maxX) - Math.max(tempBBox.minX, bbox.minX));
        overlapY = Math.max(0, Math.min(tempBBox.maxY, bbox.maxY) - Math.max(tempBBox.minY, bbox.minY));
        energy += overlapX * overlapY * self.get('labelToLabel');
      }
      // 标签与shape碰撞能量
      overlapX = Math.max(0, Math.min(tempShapeBBox.maxX, bbox.maxX) - Math.max(tempShapeBBox.minX, bbox.minX));
      overlapY = Math.max(0, Math.min(tempShapeBBox.maxY, bbox.maxY) - Math.max(tempShapeBBox.minY, bbox.minY));
      energy += overlapX * overlapY * self.get('labelToShape');
    }
    return energy;
  }
  // 蒙特卡罗模拟位移
  move(current) {
    const self = this;
    const labels = this.get('labels');
    const random = Math.floor(Math.random() * labels.length);
    const label = labels[random];

    const origin = {
      x: labels[random].attr('x'),
      y: labels[random].attr('y')
    };
    const originEnergy = self.energy(random);
    let moveX = label.attr('x') + (Math.random() - 0.5) * self.get('maxMove');
    if (moveX < 0) {
      moveX = origin.x;
    }
    let moveY = label.attr('y') + (Math.random() - 0.5) * self.get('maxMove');
    if (moveY < 0) {
      moveY = origin.y;
    }
    label.attr({ x: moveX, y: moveY });
    const newEnergy = self.energy(random);
    const d = newEnergy - originEnergy;
    if (Math.random() > Math.exp(-d / current)) {
      label.attr({ x: origin.x, y: origin.y });
    }
  }
  cooling(current, init, iterate) {
    return (current - (init / iterate));
  }
  adjust(labels, shapes) {
    const self = this;
    const iteration = self.get('iteration');
    self.set('labels', labels);
    self.set('shapes', shapes);
    const initTime = 1;
    let currentTime = 1;
    for (let i = 0; i < iteration; i++) {
      for (let j = 0; j < labels.length; j++) {
        self.move(currentTime);
      }
      currentTime = self.cooling(currentTime, initTime, iteration);
      if (currentTime < self.get('threshold')) {
        break;
      }
    }
  }
}

module.exports = SimulateAnneal;
