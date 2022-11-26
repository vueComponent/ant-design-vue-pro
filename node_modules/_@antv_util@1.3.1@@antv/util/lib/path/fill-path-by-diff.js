var isEqual = require('./is-segment-equal');

function getMinDiff(del, add, modify) {
  var type = null;
  var min = modify;
  if (add < min) {
    min = add;
    type = 'add';
  }
  if (del < min) {
    min = del;
    type = 'del';
  }
  return {
    type: type,
    min: min
  };
}

/*
 * https://en.wikipedia.org/wiki/Levenshtein_distance
 * 计算两条path的编辑距离
 */
var levenshteinDistance = function levenshteinDistance(source, target) {
  var sourceLen = source.length;
  var targetLen = target.length;
  var sourceSegment = void 0,
      targetSegment = void 0;
  var temp = 0;
  if (sourceLen === 0 || targetLen === 0) {
    return null;
  }
  var dist = [];
  for (var i = 0; i <= sourceLen; i++) {
    dist[i] = [];
    dist[i][0] = { min: i };
  }
  for (var j = 0; j <= targetLen; j++) {
    dist[0][j] = { min: j };
  }

  for (var _i = 1; _i <= sourceLen; _i++) {
    sourceSegment = source[_i - 1];
    for (var _j = 1; _j <= targetLen; _j++) {
      targetSegment = target[_j - 1];
      if (isEqual(sourceSegment, targetSegment)) {
        temp = 0;
      } else {
        temp = 1;
      }
      var del = dist[_i - 1][_j].min + 1;
      var add = dist[_i][_j - 1].min + 1;
      var modify = dist[_i - 1][_j - 1].min + temp;
      dist[_i][_j] = getMinDiff(del, add, modify);
    }
  }
  return dist;
};

module.exports = function fillPathByDiff(source, target) {
  var diffMatrix = levenshteinDistance(source, target);
  var sourceLen = source.length;
  var targetLen = target.length;
  var changes = [];
  var index = 1;
  var minPos = 1;
  // 如果source和target不是完全不相等
  if (diffMatrix[sourceLen][targetLen] !== sourceLen) {
    // 获取从source到target所需改动
    for (var i = 1; i <= sourceLen; i++) {
      var min = diffMatrix[i][i].min;
      minPos = i;
      for (var j = index; j <= targetLen; j++) {
        if (diffMatrix[i][j].min < min) {
          min = diffMatrix[i][j].min;
          minPos = j;
        }
      }
      index = minPos;
      if (diffMatrix[i][index].type) {
        changes.push({ index: i - 1, type: diffMatrix[i][index].type });
      }
    }
    // 对source进行增删path
    for (var _i2 = changes.length - 1; _i2 >= 0; _i2--) {
      index = changes[_i2].index;
      if (changes[_i2].type === 'add') {
        source.splice(index, 0, [].concat(source[index]));
      } else {
        source.splice(index, 1);
      }
    }
  }

  // source尾部补齐
  sourceLen = source.length;
  if (sourceLen < targetLen) {
    for (var _i3 = 0; _i3 < targetLen - sourceLen; _i3++) {
      if (source[sourceLen - 1][0] === 'z' || source[sourceLen - 1][0] === 'Z') {
        source.splice(sourceLen - 2, 0, source[sourceLen - 2]);
      } else {
        source.push(source[sourceLen - 1]);
      }
    }
  }
  return source;
};