
class Greedy {
  constructor() {
    this.bitmap = [];
  }
  hasGap(bbox) {
    let hasGap = true;
    const bitmap = this.bitmap;
    const minX = Math.floor(bbox.minX);
    const maxX = Math.ceil(bbox.maxX);
    const minY = Math.floor(bbox.minY);
    const maxY = Math.ceil(bbox.maxY) - 1;
    for (let i = minX; i < maxX; i++) {
      if (!bitmap[i]) {
        bitmap[i] = [];
        continue;
      }
      if (i === minX || i === maxX - 1) {
        for (let j = minY; j <= maxY; j++) {
          if (bitmap[i][j]) {
            hasGap = false;
            break;
          }
        }
      } else {
        if (bitmap[i][minY] || bitmap[i][maxY]) {
          hasGap = false;
          break;
        }
      }
    }
    return hasGap;
  }
  fillGap(bbox) {
    const bitmap = this.bitmap;
    const minX = Math.floor(bbox.minX);
    const maxX = Math.ceil(bbox.maxX) - 1;
    const minY = Math.floor(bbox.minY);
    const maxY = Math.ceil(bbox.maxY) - 1;
    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j < maxY; j += 8) {
        if (!bitmap[i]) {
          bitmap[i] = [];
        }
        bitmap[i][j] = true;
      }
      bitmap[i][maxY] = true;
    }
    for (let i = minY; i <= maxY; i++) {
      bitmap[minX][i] = true;
      bitmap[maxX][i] = true;
    }
  }
}

module.exports = Greedy;
