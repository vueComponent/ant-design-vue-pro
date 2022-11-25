const SQRT = Math.SQRT2;

function getCell(x, y, h, points) {
  const d = _calcDist(x, y, points);
  return {
    x,
    y,
    h,
    d,
    max: d + h * SQRT
  };
}

function getCentroidCell(polygon) {
  let area = 0;
  let x = 0;
  let y = 0;
  let a,
    b,
    f;
  const points = polygon[0];

  for (let i = 0, len = points.length, j = len - 1; i < len; j = i++) {
    a = points[i];
    b = points[j];
    f = a[0] * b[1] - b[0] * a[1];
    x += (a[0] + b[0]) * f;
    y += (a[1] + b[1]) * f;
    area += f * 3;
  }
  if (area === 0) return getCell(points[0][0], points[0][1], 0, polygon);
  return getCell(x / area, y / area, 0, polygon);
}

function _segmentDist(px, py, a, b) {
  let x = a[0],
    y = a[1],
    dx = b[0] - x,
    dy = b[1] - y,
    t;
  if (dx !== 0 || dy !== 0) {
    t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = b[0];
      y = b[1];

    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = px - x;
  dy = py - y;
  return dx * dx + dy * dy;
}

function _calcDist(x, y, points) {
  let inside = false;
  let minDist = Infinity;
  let polygon,
    a,
    b,
    length;
  for (let k = 0; k < points.length; k++) {
    polygon = points[k];
    length = polygon.length;
    for (let i = 0, j = length - 1; i < length; j = i++) {
      a = polygon[i];
      b = polygon[j];
      if ((a[1] > y !== b[1] > y) && (x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])) {
        inside = !inside;
      }
      minDist = Math.min(minDist, _segmentDist(x, y, a, b));
    }
  }

  return (inside ? 1 : -1) * Math.sqrt((minDist));
}

/**
 * 计算polygon视觉中心
 * @param {Array}  points  polygon点数组
 * @param {Object} bbox    polygon的bbox
 * @return {{x: *, y: *}} 返回视觉中心坐标
 */
module.exports = function visualCenter(points, bbox) {
  if (!bbox) {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity,
      p;
    for (let i = 0; i < points[0].length; i++) {
      p = points[0][i];
      if (!i || p[0] < minX) minX = p[0];
      if (!i || p[1] < minY) minY = p[1];
      if (!i || p[0] > maxX) maxX = p[0];
      if (!i || p[1] > maxY) maxY = p[1];
    }
    bbox = {
      minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY
    };
  }
  const cellSize = Math.min(bbox.width, bbox.height);
  let h = cellSize / 2;
  const cellQueue = [];
  const boxCenter = {
    x: bbox.minX + bbox.width / 2,
    y: bbox.minY + bbox.height / 2
  };
  if (cellSize === 0) {
    return boxCenter;
  }
  for (let i = bbox.minX; i < bbox.maxX; i += cellSize) {
    for (let j = bbox.minY; j < bbox.maxY; j += cellSize) {
      cellQueue.push(getCell(i + h, j + h, h, points));
    }
  }
  let best = getCentroidCell(points);
  const boxCell = getCell(boxCenter.x, boxCenter.y, 0, points);
  if (boxCell > best.d) {
    best = boxCell;
  }
  let cell;
  while (cellQueue.length) {
    cell = cellQueue.pop();

    if (cell.d > best.d) {
      best = cell;
    }
    if (cell.max - best.d <= 1) {
      continue;
    }

    h = cell.h / 2;
    cellQueue.push(getCell(cell.x - h, cell.y - h, h, points));
    cellQueue.push(getCell(cell.x + h, cell.y - h, h, points));
    cellQueue.push(getCell(cell.x - h, cell.y + h, h, points));
    cellQueue.push(getCell(cell.x + h, cell.y + h, h, points));
  }
  return { x: best.x, y: best.y };
};

