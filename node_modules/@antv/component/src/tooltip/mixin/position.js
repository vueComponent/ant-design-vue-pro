const GAP = 20;

const PositionMixin = {
  _calcTooltipPosition(x, y, position, containerWidth, containerHeight, target) {
    let rectWidth = 0;
    let rectHeight = 0;
    let gap = 20;

    if (target) {
      const rect = target.getBBox();
      rectWidth = rect.width;
      rectHeight = rect.height;
      x = rect.x;
      y = rect.y;
      gap = 5;
    }
    switch (position) {
      case 'inside':
        x = x + rectWidth / 2 - containerWidth / 2;
        y = y + rectHeight / 2 - containerHeight / 2;
        break;
      case 'top':
        x = x + rectWidth / 2 - containerWidth / 2;
        y = y - containerHeight - gap;
        break;
      case 'left':
        x = x - containerWidth - gap;
        y = y + rectHeight / 2 - containerHeight / 2;
        break;
      case 'right':
        x = x + rectWidth + gap;
        y = y + rectHeight / 2 - containerHeight / 2;
        break;
      case 'bottom':
      default:
        x = x + rectWidth / 2 - containerWidth / 2;
        y = y + rectHeight + gap;
        break;
    }
    return [ x, y ];
  },

  _constraintPositionInBoundary(x, y, width, height, viewWidth, viewHeight) {
    if (x + width + GAP > viewWidth) {
      x -= width + GAP;
      x = x < 0 ? 0 : x;
    } else if (x + GAP < 0) {
      x = GAP;
    } else {
      x += GAP;
    }

    if (y + height + GAP > viewHeight) {
      y -= (height + GAP);
      y = y < 0 ? 0 : y;
    } else if (y + GAP < 0) {
      y = GAP;
    } else {
      y += GAP;
    }

    return [ x, y ];
  },

  _constraintPositionInPlot(x, y, width, height, plotRange, enterable) {
    if (x + width > plotRange.tr.x) {
      if (enterable) {
        // fix: https://github.com/antvis/g2/issues/1414
        // 当 enterable 开启时，如果设置 tooltip 与鼠标的间距过大根本就追逐不上 tooltip
        x -= width + 1;
      } else {
        x -= (width + 2 * GAP);
      }
    }

    if (x < plotRange.tl.x) {
      x = plotRange.tl.x;
    }

    if (!enterable) {
      if (y + height > plotRange.bl.y) {
        y -= height + 2 * GAP;
      }

      if (y < plotRange.tl.y) {
        y = plotRange.tl.y;
      }
    }
    return [ x, y ];
  }

};
module.exports = PositionMixin;
