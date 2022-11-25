/*
 * 抽取pathSegment中的关键点
 * M,L,A,Q,H,V一个端点
 * Q, S抽取一个端点，一个控制点
 * C抽取一个端点，两个控制点
 */
function _getSegmentPoints(segment) {
  var points = [];
  switch (segment[0]) {
    case 'M':
      points.push([segment[1], segment[2]]);
      break;
    case 'L':
      points.push([segment[1], segment[2]]);
      break;
    case 'A':
      points.push([segment[6], segment[7]]);
      break;
    case 'Q':
      points.push([segment[3], segment[4]]);
      points.push([segment[1], segment[2]]);
      break;
    case 'T':
      points.push([segment[1], segment[2]]);
      break;
    case 'C':
      points.push([segment[5], segment[6]]);
      points.push([segment[1], segment[2]]);
      points.push([segment[3], segment[4]]);
      break;
    case 'S':
      points.push([segment[3], segment[4]]);
      points.push([segment[1], segment[2]]);
      break;
    case 'H':
      points.push([segment[1], segment[1]]);
      break;
    case 'V':
      points.push([segment[1], segment[1]]);
      break;
    default:

  }
  return points;
}

// 将两个点均分成count个点
function _splitPoints(points, former, count) {
  var result = [].concat(points);
  var index = void 0;
  var t = 1 / (count + 1);
  var formerEnd = _getSegmentPoints(former)[0];
  for (var i = 1; i <= count; i++) {
    t *= i;
    index = Math.floor(points.length * t);
    if (index === 0) {
      result.unshift([formerEnd[0] * t + points[index][0] * (1 - t), formerEnd[1] * t + points[index][1] * (1 - t)]);
    } else {
      result.splice(index, 0, [formerEnd[0] * t + points[index][0] * (1 - t), formerEnd[1] * t + points[index][1] * (1 - t)]);
    }
  }
  return result;
}

module.exports = function formatPath(fromPath, toPath) {
  if (fromPath.length <= 1) {
    return fromPath;
  }
  var points = void 0;
  for (var i = 0; i < toPath.length; i++) {
    if (fromPath[i][0] !== toPath[i][0]) {
      // 获取fromPath的pathSegment的端点，根据toPath的指令对其改造
      points = _getSegmentPoints(fromPath[i]);
      switch (toPath[i][0]) {
        case 'M':
          fromPath[i] = ['M'].concat(points[0]);
          break;
        case 'L':
          fromPath[i] = ['L'].concat(points[0]);
          break;
        case 'A':
          fromPath[i] = [].concat(toPath[i]);
          fromPath[i][6] = points[0][0];
          fromPath[i][7] = points[0][1];
          break;
        case 'Q':
          if (points.length < 2) {
            if (i > 0) {
              points = _splitPoints(points, fromPath[i - 1], 1);
            } else {
              fromPath[i] = toPath[i];
              break;
            }
          }
          fromPath[i] = ['Q'].concat(points.reduce(function (arr, i) {
            return arr.concat(i);
          }, []));
          break;
        case 'T':
          fromPath[i] = ['T'].concat(points[0]);
          break;
        case 'C':
          if (points.length < 3) {
            if (i > 0) {
              points = _splitPoints(points, fromPath[i - 1], 2);
            } else {
              fromPath[i] = toPath[i];
              break;
            }
          }
          fromPath[i] = ['C'].concat(points.reduce(function (arr, i) {
            return arr.concat(i);
          }, []));
          break;
        case 'S':
          if (points.length < 2) {
            if (i > 0) {
              points = _splitPoints(points, fromPath[i - 1], 1);
            } else {
              fromPath[i] = toPath[i];
              break;
            }
          }
          fromPath[i] = ['S'].concat(points.reduce(function (arr, i) {
            return arr.concat(i);
          }, []));
          break;
        default:
          fromPath[i] = toPath[i];
      }
    }
  }
  return fromPath;
};