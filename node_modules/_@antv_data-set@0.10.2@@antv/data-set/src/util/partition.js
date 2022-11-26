const isArray = require('@antv/util/lib/type/is-array');
const isFunction = require('@antv/util/lib/type/is-function');
const isString = require('@antv/util/lib/type/is-string');
const groupBy = require('@antv/util/lib/group-by');
const simpleSortBy = require('./simple-sort-by');

module.exports = (rows, group_by, order_by = []) => {
  let newRows = rows;
  if (order_by && order_by.length) {
    newRows = simpleSortBy(rows, order_by);
  }

  let groupingFn;
  if (isFunction(group_by)) {
    groupingFn = group_by;
  } else if (isArray(group_by)) {
    groupingFn = row => `_${group_by.map(col => row[col]).join('-')}`;
    // NOTE: Object.keys({'b': 'b', '2': '2', '1': '1', 'a': 'a'}) => [ '1', '2', 'b', 'a' ]
    // that is why we have to add a prefix
  } else if (isString(group_by)) {
    groupingFn = row => `_${row[group_by]}`;
  }
  const groups = groupBy(newRows, groupingFn);
  return groups;
};
