const isEqual = require('./is-segment-equal');

function getMinDiff(del, add, modify) {
  let type = null;
  let min = modify;
  if (add < min) {
    min = add;
    type = 'add';
  }
  if (del < min) {
    min = del;
    type = 'del';
  }
  return {
    type,
    min
  };
}

/*
 * https://en.wikipedia.org/wiki/Levenshtein_distance
 * 计算两条path的编辑距离
 */
const levenshteinDistance = function(source, target) {
  const sourceLen = source.length;
  const targetLen = target.length;
  let sourceSegment,
    targetSegment;
  let temp = 0;
  if (sourceLen === 0 || targetLen === 0) {
    return null;
  }
  const dist = [];
  for (let i = 0; i <= sourceLen; i++) {
    dist[i] = [];
    dist[i][0] = { min: i };
  }
  for (let j = 0; j <= targetLen; j++) {
    dist[0][j] = { min: j };
  }

  for (let i = 1; i <= sourceLen; i++) {
    sourceSegment = source[i - 1];
    for (let j = 1; j <= targetLen; j++) {
      targetSegment = target[j - 1];
      if (isEqual(sourceSegment, targetSegment)) {
        temp = 0;
      } else {
        temp = 1;
      }
      const del = dist[i - 1][j].min + 1;
      const add = dist[i][j - 1].min + 1;
      const modify = dist[i - 1][j - 1].min + temp;
      dist[i][j] = getMinDiff(del, add, modify);
    }
  }
  return dist;
};

module.exports = function fillPathByDiff(source, target) {
  const diffMatrix = levenshteinDistance(source, target);
  let sourceLen = source.length;
  const targetLen = target.length;
  const changes = [];
  let index = 1;
  let minPos = 1;
  // 如果source和target不是完全不相等
  if (diffMatrix[sourceLen][targetLen] !== sourceLen) {
    // 获取从source到target所需改动
    for (let i = 1; i <= sourceLen; i++) {
      let min = diffMatrix[i][i].min;
      minPos = i;
      for (let j = index; j <= targetLen; j++) {
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
    for (let i = changes.length - 1; i >= 0; i--) {
      index = changes[i].index;
      if (changes[i].type === 'add') {
        source.splice(index, 0, [].concat(source[index]));
      } else {
        source.splice(index, 1);
      }
    }
  }

  // source尾部补齐
  sourceLen = source.length;
  if (sourceLen < targetLen) {
    for (let i = 0; i < (targetLen - sourceLen); i++) {
      if (source[sourceLen - 1][0] === 'z' || source[sourceLen - 1][0] === 'Z') {
        source.splice(sourceLen - 2, 0, source[sourceLen - 2]);
      } else {
        source.push(source[sourceLen - 1]);
      }

    }
  }
  return source;
};
