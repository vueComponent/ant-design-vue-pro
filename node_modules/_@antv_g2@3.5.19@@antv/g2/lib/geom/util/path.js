/**
 * @fileOverview 计算path 使用的工具方法
 * @author dxq613@gmail.com
 */
var Util = require('../../util');

var Spline = require('./spline');

function points2path(points, isInCircle) {
  if (!points.length) {
    return [];
  }

  var path = [];

  for (var i = 0, length = points.length; i < length; i++) {
    var item = points[i];

    if (i === 0) {
      path.push(['M', item.x, item.y]);
    } else {
      path.push(['L', item.x, item.y]);
    }
  }

  if (isInCircle) {
    path.push(['Z']);
  }

  return path;
}

function _getPointRadius(coord, point) {
  var center = coord.getCenter();
  var r = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
  return r;
}

function convertArr(arr, coord) {
  var len = arr.length;
  var tmp = [arr[0]];

  for (var i = 1; i < len; i = i + 2) {
    var point = coord.convertPoint({
      x: arr[i],
      y: arr[i + 1]
    });
    tmp.push(point.x, point.y);
  }

  return tmp;
}

function _convertPolarPath(pre, cur, coord) {
  // const radius = coord.getRadius();
  // const inner = coord.innerRadius || 0;
  // let innerRadius = inner * radius;
  var transposed = coord.isTransposed;
  var startAngle = coord.startAngle;
  var endAngle = coord.endAngle;
  var prePoint = {
    x: pre[1],
    y: pre[2]
  };
  var curPoint = {
    x: cur[1],
    y: cur[2]
  };
  var rst = []; // innerRadius = innerRadius || 0;

  var xDim = transposed ? 'y' : 'x';
  var angleRange = Math.abs(curPoint[xDim] - prePoint[xDim]) * (endAngle - startAngle);
  var direction = curPoint[xDim] >= prePoint[xDim] ? 1 : 0; // 圆弧的方向

  var flag = angleRange > Math.PI ? 1 : 0; // 大弧还是小弧标志位

  var convertPoint = coord.convertPoint(curPoint);

  var r = _getPointRadius(coord, convertPoint);

  if (r >= 0.5) {
    // 小于1像素的圆在图像上无法识别
    if (angleRange === Math.PI * 2) {
      var middlePoint = {
        x: (curPoint.x + prePoint.x) / 2,
        y: (curPoint.y + prePoint.y) / 2
      };
      var middleConvertPoint = coord.convertPoint(middlePoint);
      rst.push(['A', r, r, 0, flag, direction, middleConvertPoint.x, middleConvertPoint.y]);
      rst.push(['A', r, r, 0, flag, direction, convertPoint.x, convertPoint.y]);
    } else {
      rst.push(['A', r, r, 0, flag, direction, convertPoint.x, convertPoint.y]);
    }
  }

  return rst;
} // 当存在整体的圆时，去除圆前面和后面的线，防止出现直线穿过整个圆的情形


function filterFullCirleLine(path) {
  Util.each(path, function (subPath, index) {
    var cur = subPath;

    if (cur[0].toLowerCase() === 'a') {
      var pre = path[index - 1];
      var next = path[index + 1];

      if (next && next[0].toLowerCase() === 'a') {
        if (pre && pre[0].toLowerCase() === 'l') {
          pre[0] = 'M';
        }
      } else if (pre && pre[0].toLowerCase() === 'a') {
        if (next && next[0].toLowerCase() === 'l') {
          next[0] = 'M';
        }
      }
    }
  });
}

var PathUtil = {
  // 线的path
  getLinePath: function getLinePath(points, isInCircle) {
    return points2path(points, isInCircle);
  },
  // get spline： 限定了范围的平滑线
  getSplinePath: function getSplinePath(points, isInCircle, constaint) {
    var data = [];
    var first = points[0];
    var prePoint = null;

    if (points.length <= 2) {
      return PathUtil.getLinePath(points, isInCircle);
    }

    Util.each(points, function (point) {
      if (!prePoint || !(prePoint.x === point.x && prePoint.y === point.y)) {
        data.push(point.x);
        data.push(point.y);
        prePoint = point;
      }
    });
    constaint = constaint || [// 范围
    [0, 0], [1, 1]];
    var splinePath = Spline.catmullRom2bezier(data, isInCircle, constaint);
    splinePath.unshift(['M', first.x, first.y]);
    return splinePath;
  },
  getPointRadius: function getPointRadius(coord, point) {
    var result = _getPointRadius(coord, point);

    return result;
  },
  getPointAngle: function getPointAngle(coord, point) {
    var center = coord.getCenter();
    var angle = Math.atan2(point.y - center.y, point.x - center.x);
    return angle;
  },
  convertNormalPath: function convertNormalPath(coord, path) {
    var tmp = [];
    Util.each(path, function (subPath) {
      var action = subPath[0];

      switch (action.toLowerCase()) {
        case 'm':
        case 'l':
        case 'c':
          tmp.push(convertArr(subPath, coord));
          break;

        case 'z':
        default:
          tmp.push(subPath);
          break;
      }
    });
    return tmp;
  },
  convertPolarPath: function convertPolarPath(coord, path) {
    var tmp = [];
    var pre;
    var cur;
    var transposed;
    var equals;
    Util.each(path, function (subPath, index) {
      var action = subPath[0];

      switch (action.toLowerCase()) {
        case 'm':
        case 'c':
        case 'q':
          tmp.push(convertArr(subPath, coord));
          break;

        case 'l':
          pre = path[index - 1];
          cur = subPath;
          transposed = coord.isTransposed; // 是否半径相同，转换成圆弧

          equals = transposed ? pre[pre.length - 2] === cur[1] : pre[pre.length - 1] === cur[2];

          if (equals) {
            tmp = tmp.concat(_convertPolarPath(pre, cur, coord));
          } else {
            // y 不相等，所以直接转换
            tmp.push(convertArr(subPath, coord));
          }

          break;

        case 'z':
        default:
          tmp.push(subPath);
          break;
      }
    });
    filterFullCirleLine(tmp); // 过滤多余的直线

    return tmp;
  }
};
module.exports = PathUtil;