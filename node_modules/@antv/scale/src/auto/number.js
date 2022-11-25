/**
 * @fileOverview 自动计算数字坐标轴
 * @author dxq613@gmail.com
 */

const isNil = require('@antv/util/lib/type/is-nil');
const isNumber = require('@antv/util/lib/type/is-number');
const AutoUtil = require('./util');

const MIN_COUNT = 5;
const MAX_COUNT = 7;
const SNAP_COUNT_ARRAY = [ 1, 1.2, 1.5, 1.6, 2, 2.2, 2.4, 2.5, 3, 4, 5, 6, 7.5, 8, 10 ];
const SNAP_ARRAY = [ 1, 2, 4, 5, 10 ];
const EPS = 1e-12;

module.exports = function(info) {
  let min = info.min;
  let max = info.max;
  let interval = info.interval;
  const minTickInterval = info.minTickInterval;
  const ticks = [];
  const minCount = info.minCount || MIN_COUNT;
  const maxCount = info.maxCount || MAX_COUNT;
  const isFixedCount = minCount === maxCount; // 是否限定死了个数
  const minLimit = isNil(info.minLimit) ? -Infinity : info.minLimit; // 限定的最小值
  const maxLimit = isNil(info.maxLimit) ? Infinity : info.maxLimit; // 限定最大值
  let avgCount = (minCount + maxCount) / 2;
  let count = avgCount;
  // 用户传入的逼近数组
  const snapArray = info.snapArray ? info.snapArray : (isFixedCount ? SNAP_COUNT_ARRAY : SNAP_ARRAY);

  // 如果限定大小范围，同时大小范围等于用户传入的范围，同时限定了个数，interval 按照个数均分
  if (min === minLimit && max === maxLimit && isFixedCount) {
    interval = (max - min) / (count - 1);
  }

  if (isNil(min)) {
    min = 0;
  }
  if (isNil(max)) {
    max = 0;
  }
  if (Math.abs(max - min) < EPS) {
    if (min === 0) {
      max = 1;
    } else {
      if (min > 0) {
        min = 0;
      } else {
        max = 0;
      }
    }
    if (max - min < 5 && !interval && max - min >= 1) {
      interval = 1;
    }
  }

  if (isNil(interval)) {
    // 计算间距
    const temp = (max - min) / (avgCount - 1);
    interval = AutoUtil.snapFactorTo(temp, snapArray, 'ceil');
    if (maxCount !== minCount) {
      count = parseInt((max - min) / interval, 10);
      if (count > maxCount) {
        count = maxCount;
      }
      if (count < minCount) {
        count = minCount;
      }
      // 不确定tick的个数时，使得tick偏小
      interval = AutoUtil.snapFactorTo((max - min) / (count - 1), snapArray);
    }
  }
  // interval should not be less than minTickInterval
  if (isNumber(minTickInterval) && interval < minTickInterval) {
    interval = minTickInterval;
  }
  if (info.interval || maxCount !== minCount) {
    // 校正 max 和 min
    max = Math.min(AutoUtil.snapMultiple(max, interval, 'ceil'), maxLimit); // 向上逼近
    min = Math.max(AutoUtil.snapMultiple(min, interval, 'floor'), minLimit); // 向下逼近

    count = Math.round((max - min) / interval);
    min = AutoUtil.fixedBase(min, interval); // 当min为负数的时候，fixedBase后，min可能会大于minLimit，导致最终产出的tick是大于minLimit的，所以必须进行修正
    max = AutoUtil.fixedBase(max, interval);

    let prevMin = null;
    while (min > minLimit && minLimit > -Infinity && (prevMin === null || min < prevMin)) { // 保证计算出来的刻度最小值 min， 不大于数据最小值 min
      prevMin = min;
      min = AutoUtil.fixedBase(min - interval, interval);
    }
  } else {
    avgCount = parseInt(avgCount, 10); // 取整
    const avg = (max + min) / 2;
    const avgTick = AutoUtil.snapMultiple(avg, interval, 'ceil');
    const sideCount = Math.floor((avgCount - 2) / 2);
    let maxTick = avgTick + sideCount * interval;
    let minTick;
    if (avgCount % 2 === 0) {
      minTick = avgTick - sideCount * interval;
    } else {
      minTick = avgTick - (sideCount + 1) * interval;
    }

    let prevMaxTick = null;
    // 如果减去intervl, fixBase后，新的minTick没有大于之前的值，就退出，防止死循环
    while (maxTick < max && (prevMaxTick === null || maxTick > prevMaxTick)) { // 保证计算出来的刻度最大值 maxTick 不小于数据最大值 max
      prevMaxTick = maxTick;
      maxTick = AutoUtil.fixedBase(maxTick + interval, interval);
    }

    let prevMinTick = null;
    // 如果减去intervl, fixBase后，新的minTick没有小于之前的值，就退出，防止死循环
    while (minTick > min && (prevMinTick === null || minTick < prevMinTick)) { // 保证计算出来的刻度最小值 minTick 不大于数据最小值 min
      prevMinTick = minTick;
      minTick = AutoUtil.fixedBase(minTick - interval, interval); // 防止超常浮点数计算问题
    }
    max = maxTick;
    min = minTick;
  }

  max = Math.min(max, maxLimit);
  min = Math.max(min, minLimit);

  ticks.push(min);
  for (let i = 1; i < count; i++) {
    const tickValue = AutoUtil.fixedBase(interval * i + min, interval);
    if (tickValue < max) {
      ticks.push(tickValue);
    }
  }
  if (ticks[ticks.length - 1] < max) {
    ticks.push(max);
  }
  return {
    min,
    max,
    interval,
    count,
    ticks
  };
};
