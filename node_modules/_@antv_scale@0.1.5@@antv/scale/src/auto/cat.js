/**
 * @fileOverview 计算分类的的坐标点
 * @author dxq613@gmail.com
 */
const each = require('@antv/util/lib/each');
const MAX_COUNT = 8;
const SUB_COUNT = 4; // 控制个数不能过小

function getSimpleArray(data) {
  let arr = [];
  each(data, function(sub) {
    arr = arr.concat(sub);
  });
  return arr;
}
function getGreatestFactor(count, number) {
  let i;
  for (i = number; i > 0; i--) {
    if (count % i === 0) {
      break;
    }
  }
  // 如果是素数，没有可以整除的数字
  if (i === 1) {
    for (i = number; i > 0; i--) {
      if ((count - 1) % i === 0) {
        break;
      }
    }
  }
  return i;
}

module.exports = function(info) {
  const rst = {};
  let ticks = [];
  const isRounding = info.isRounding;
  const categories = getSimpleArray(info.data);
  const length = categories.length;
  const maxCount = info.maxCount || MAX_COUNT;
  let tickCount;

  if (isRounding) { // 取整操作
    tickCount = getGreatestFactor(length - 1, maxCount - 1) + 1;
    // 如果计算出来只有两个坐标点，则直接使用传入的 maxCount
    if (tickCount === 2) {
      tickCount = maxCount;
    } else if (tickCount < maxCount - SUB_COUNT) {
      tickCount = maxCount - SUB_COUNT;
    }
  } else {
    tickCount = maxCount;
  }

  if (!isRounding && length <= tickCount + tickCount / 2) {
    ticks = [].concat(categories);
  } else {
    const step = parseInt(length / (tickCount - 1), 10);

    const groups = categories.map(function(e, i) {
      return i % step === 0 ? categories.slice(i, i + step) : null;
    }).filter(function(e) {
      return e;
    });

    for (let i = 1, groupLen = groups.length;
      (i < groupLen) && (isRounding ? i * step < length - step : i < tickCount - 1); i++) {
      ticks.push(groups[i][0]);
    }
    if (categories.length) {
      ticks.unshift(categories[0]);
      const last = categories[length - 1];
      if (ticks.indexOf(last) === -1) {
        ticks.push(last);
      }
    }
  }

  rst.categories = categories;
  rst.ticks = ticks;
  return rst;
};
