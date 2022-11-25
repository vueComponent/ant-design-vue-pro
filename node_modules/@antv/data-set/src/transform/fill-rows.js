const assign = require('@antv/util/lib/mix');
const forIn = require('@antv/util/lib/each');
const partition = require('../util/partition');
const {
  registerTransform
} = require('../data-set');

const DEFAULT_OPTIONS = {
  fillBy: 'group', // group | order
  groupBy: [],
  orderBy: []
};

function arrayDifference(arr1, arr2) {
  // arrayDifference([1, 1, 1, 2], [1, 2]) => [1, 1]
  const shadow = arr1.map(item => item); // shadow copy
  arr2.forEach(item => {
    const index = shadow.indexOf(item);
    if (index > -1) {
      shadow.splice(index, 1);
    }
  });
  return shadow;
}

function transform(dataView, options = {}) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const rows = dataView.rows;
  const groupBy = options.groupBy;
  const orderBy = options.orderBy;
  const groups = partition(rows, groupBy, orderBy);
  let maxLength = 0;
  let referenceGroup = [];
  forIn(groups, group => {
    if (group.length > maxLength) {
      maxLength = group.length;
      referenceGroup = group;
    }
  });
  const referenceOrderByKeys = [];
  const referenceRowByOrderByKey = {};
  referenceGroup.forEach(row => {
    const key = orderBy.map(col => row[col]).join('-');
    referenceOrderByKeys.push(key);
    referenceRowByOrderByKey[key] = row;
  });
  if (options.fillBy === 'order') {
    const first = referenceGroup[0];
    const allOrderByKeys = [];
    const rowByOrderByKey = {};
    rows.forEach(row => {
      const key = orderBy.map(col => row[col]).join('-');
      if (allOrderByKeys.indexOf(key) === -1) {
        allOrderByKeys.push(key);
        rowByOrderByKey[key] = row;
      }
    });
    const _missingOrderByKeys = arrayDifference(allOrderByKeys, referenceOrderByKeys);
    _missingOrderByKeys.forEach(key => {
      const row = {};
      groupBy.forEach(col => {
        row[col] = first[col];
      });
      orderBy.forEach(col => {
        row[col] = rowByOrderByKey[key][col];
      });
      rows.push(row);
      referenceGroup.push(row);
      referenceOrderByKeys.push(key);
      referenceRowByOrderByKey[key] = row;
    });
    maxLength = referenceGroup.length;
  }
  forIn(groups, group => {
    if (group !== referenceGroup && group.length < maxLength) {
      const first = group[0];
      // missing orderBy keys
      const orderByKeys = [];
      group.forEach(row => {
        orderByKeys.push(orderBy.map(col => row[col]).join('-'));
      });
      const missingOrderByKeys = arrayDifference(referenceOrderByKeys, orderByKeys);
      missingOrderByKeys.some((key, i) => {
        if (i >= (maxLength - group.length)) { // group length overflow
          return true;
        }
        const referenceRow = referenceRowByOrderByKey[key];
        const row = {};
        groupBy.forEach(col => {
          row[col] = first[col];
        });
        orderBy.forEach(col => {
          row[col] = referenceRow[col];
        });
        rows.push(row);
        return false;
      });
    }
  });
}

registerTransform('fill-rows', transform);
registerTransform('fillRows', transform);
