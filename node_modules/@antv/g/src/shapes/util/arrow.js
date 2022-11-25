const Format = require('../../util/format');
const PathSegment = require('../util/path-segment');

const PI = Math.PI;
const sin = Math.sin;
const cos = Math.cos;
const atan2 = Math.atan2;
const DEFAULT_LENGTH = 10;
const DEFAULT_ANGLE = PI / 3;

function _addArrow(ctx, attrs, x1, y1, x2, y2, isStart) {
  let leftX;
  let leftY;
  let rightX;
  let rightY;
  let offsetX;
  let offsetY;
  let angle;

  if (!attrs.fill) { // 闭合的不绘制箭头
    const arrowLength = attrs.arrowLength || DEFAULT_LENGTH;
    const arrowAngle = attrs.arrowAngle ? (attrs.arrowAngle * PI) / 180 : DEFAULT_ANGLE; // 转换为弧
    // Calculate angle
    angle = atan2((y1 - y2), (x1 - x2));
    /* // Adjust angle correctly
    angle -= PI;*/
    // Calculate offset to place arrow at edge of path
    offsetX = Math.abs(attrs.lineWidth * cos(angle)) / 2;
    offsetY = Math.abs(attrs.lineWidth * sin(angle)) / 2;
    if (isStart) {
      offsetX = -offsetX;
      offsetY = -offsetY;
    }
    // Calculate coordinates for left half of arrow
    leftX = x2 + (arrowLength * cos(angle + (arrowAngle / 2)));
    leftY = y2 + (arrowLength * sin(angle + (arrowAngle / 2)));
    // Calculate coordinates for right half of arrow
    rightX = x2 + (arrowLength * cos(angle - (arrowAngle / 2)));
    rightY = y2 + (arrowLength * sin(angle - (arrowAngle / 2)));
    ctx.beginPath();
    // Draw left half of arrow
    ctx.moveTo(leftX - offsetX, leftY - offsetY);
    ctx.lineTo(x2 - offsetX, y2 - offsetY);
    // Draw right half of arrow
    ctx.lineTo(rightX - offsetX, rightY - offsetY);

    // Visually connect arrow to path
    ctx.moveTo(x2 - offsetX, y2 - offsetY);
    ctx.lineTo(x2 + offsetX, y2 + offsetY);
    // Move back to end of path
    ctx.moveTo(x2, y2);
    ctx.stroke();
  }
}

function parsePath(attrs) {
  const segments = [];
  const pathArray = Format.parsePath(attrs.path);
  let preSegment;

  if (!Array.isArray(pathArray) ||
    pathArray.length === 0 ||
    (pathArray[0][0] !== 'M' &&
      pathArray[0][0] !== 'm')
  ) {
    return false;
  }
  const count = pathArray.length;
  for (let i = 0; i < pathArray.length; i++) {
    const item = pathArray[i];
    preSegment = new PathSegment(item, preSegment, i === count - 1);
    segments.push(preSegment);
  }
  return segments;
}

/**
 * 如果自定义箭头并且有 d 需要做偏移，如果直接画，线条会超出箭头尖端，因此需要根据箭头偏移 d, 返回线需要缩短的距离
 * |----------------
 * |<|--------------
 * |
 * @param {Number} x1 起始点 x
 * @param {number} y1 起始点 y
 * @param {number} x2 箭头作用点 x
 * @param {number} y2 箭头作用点 y
 * @param {number} d  箭头沿线条方向的偏移距离
 * @return {{dx: number, dy: number}} 返回线条偏移距离
 */
function getShortenOffset(x1, y1, x2, y2, d) {
  const rad = Math.atan2(y2 - y1, x2 - x1);
  return {
    dx: cos(rad) * d,
    dy: sin(rad) * d
  };
}

function _addCustomizedArrow(ctx, attrs, x1, y1, x2, y2, isStart) {
  const shape = isStart ? attrs.startArrow : attrs.endArrow;
  const d = shape.d;
  const x = x2 - x1;
  const y = y2 - y1;
  const rad = Math.atan2(y, x);
  const path = parsePath(shape);
  if (!path) {
    return;
  }
  if (d) {
    x2 = x2 - cos(rad) * d;
    y2 = y2 - sin(rad) * d;
  }
  ctx.save();
  ctx.beginPath();
  ctx.translate(x2, y2);
  ctx.rotate(rad);
  for (let i = 0; i < path.length; i++) {
    path[i].draw(ctx);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
  ctx.restore();
}

module.exports = {
  addStartArrow(ctx, attrs, x1, y1, x2, y2) {
    if (typeof attrs.startArrow === 'object') {
      _addCustomizedArrow(ctx, attrs, x1, y1, x2, y2, true);
    } else if (attrs.startArrow) {
      _addArrow(ctx, attrs, x1, y1, x2, y2, true);
    }
  },
  addEndArrow(ctx, attrs, x1, y1, x2, y2) {
    if (typeof attrs.endArrow === 'object') {
      _addCustomizedArrow(ctx, attrs, x1, y1, x2, y2, false);
    } else if (attrs.endArrow) {
      _addArrow(ctx, attrs, x1, y1, x2, y2, false);
    }
  },
  getShortenOffset
};
