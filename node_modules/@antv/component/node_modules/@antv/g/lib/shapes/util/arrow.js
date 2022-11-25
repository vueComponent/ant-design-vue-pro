var Format = require('../../util/format');

var PathSegment = require('../util/path-segment');

var PI = Math.PI;
var sin = Math.sin;
var cos = Math.cos;
var atan2 = Math.atan2;
var DEFAULT_LENGTH = 10;
var DEFAULT_ANGLE = PI / 3;

function _addArrow(ctx, attrs, x1, y1, x2, y2, isStart) {
  var leftX;
  var leftY;
  var rightX;
  var rightY;
  var offsetX;
  var offsetY;
  var angle;

  if (!attrs.fill) {
    // 闭合的不绘制箭头
    var arrowLength = attrs.arrowLength || DEFAULT_LENGTH;
    var arrowAngle = attrs.arrowAngle ? attrs.arrowAngle * PI / 180 : DEFAULT_ANGLE; // 转换为弧
    // Calculate angle

    angle = atan2(y1 - y2, x1 - x2);
    /* // Adjust angle correctly
    angle -= PI;*/
    // Calculate offset to place arrow at edge of path

    offsetX = Math.abs(attrs.lineWidth * cos(angle)) / 2;
    offsetY = Math.abs(attrs.lineWidth * sin(angle)) / 2;

    if (isStart) {
      offsetX = -offsetX;
      offsetY = -offsetY;
    } // Calculate coordinates for left half of arrow


    leftX = x2 + arrowLength * cos(angle + arrowAngle / 2);
    leftY = y2 + arrowLength * sin(angle + arrowAngle / 2); // Calculate coordinates for right half of arrow

    rightX = x2 + arrowLength * cos(angle - arrowAngle / 2);
    rightY = y2 + arrowLength * sin(angle - arrowAngle / 2);
    ctx.beginPath(); // Draw left half of arrow

    ctx.moveTo(leftX - offsetX, leftY - offsetY);
    ctx.lineTo(x2 - offsetX, y2 - offsetY); // Draw right half of arrow

    ctx.lineTo(rightX - offsetX, rightY - offsetY); // Visually connect arrow to path

    ctx.moveTo(x2 - offsetX, y2 - offsetY);
    ctx.lineTo(x2 + offsetX, y2 + offsetY); // Move back to end of path

    ctx.moveTo(x2, y2);
    ctx.stroke();
  }
}

function parsePath(attrs) {
  var segments = [];
  var pathArray = Format.parsePath(attrs.path);
  var preSegment;

  if (!Array.isArray(pathArray) || pathArray.length === 0 || pathArray[0][0] !== 'M' && pathArray[0][0] !== 'm') {
    return false;
  }

  var count = pathArray.length;

  for (var i = 0; i < pathArray.length; i++) {
    var item = pathArray[i];
    preSegment = new PathSegment(item, preSegment, i === count - 1);
    segments.push(preSegment);
  }

  return segments;
}

function _addCustomizedArrow(ctx, attrs, x1, y1, x2, y2, isStart) {
  var shape = isStart ? attrs.startArrow : attrs.endArrow;
  var d = shape.d;
  var deg = 0;
  var x = x2 - x1;
  var y = y2 - y1;
  var tan = Math.atan(x / y);

  if (y === 0 && x < 0) {
    deg = Math.PI;
  } else if (x > 0 && y > 0) {
    deg = Math.PI / 2 - tan;
  } else if (x < 0 && y < 0) {
    deg = -Math.PI / 2 - tan;
  } else if (x >= 0 && y < 0) {
    deg = -tan - Math.PI / 2;
  } else if (x <= 0 && y > 0) {
    deg = Math.PI / 2 - tan;
  }

  var path = parsePath(shape);

  if (!path) {
    return;
  }

  if (d) {
    if (isStart) {
      x2 = x2 + Math.sin(Math.abs(tan)) * d;
      y2 = y2 + Math.cos(Math.abs(tan)) * d - 0.5 * ctx.lineWidth;
    } else {
      x2 = x2 - Math.sin(Math.abs(tan)) * d;
      y2 = y2 - Math.cos(Math.abs(tan)) * d + 0.5 * ctx.lineWidth;
    }
  }

  ctx.save();
  ctx.beginPath();
  ctx.translate(x2, y2);
  ctx.rotate(deg);

  for (var i = 0; i < path.length; i++) {
    path[i].draw(ctx);
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
  ctx.restore();
}

module.exports = {
  addStartArrow: function addStartArrow(ctx, attrs, x1, y1, x2, y2) {
    if (typeof attrs.startArrow === 'object') {
      _addCustomizedArrow(ctx, attrs, x1, y1, x2, y2, true);
    } else if (attrs.startArrow) {
      _addArrow(ctx, attrs, x1, y1, x2, y2, true);
    }
  },
  addEndArrow: function addEndArrow(ctx, attrs, x1, y1, x2, y2) {
    if (typeof attrs.endArrow === 'object') {
      _addCustomizedArrow(ctx, attrs, x1, y1, x2, y2, false);
    } else if (attrs.endArrow) {
      _addArrow(ctx, attrs, x1, y1, x2, y2, false);
    }
  }
};