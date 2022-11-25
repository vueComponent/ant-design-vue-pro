var isArray = require('@antv/util/lib/type/is-array');

var isFunction = require('@antv/util/lib/type/is-function');

var isString = require('@antv/util/lib/type/is-string');

var groupBy = require('@antv/util/lib/group-by');

var simpleSortBy = require('./simple-sort-by');

module.exports = function (rows, group_by, order_by) {
  if (order_by === void 0) {
    order_by = [];
  }

  var newRows = rows;

  if (order_by && order_by.length) {
    newRows = simpleSortBy(rows, order_by);
  }

  var groupingFn;

  if (isFunction(group_by)) {
    groupingFn = group_by;
  } else if (isArray(group_by)) {
    groupingFn = function groupingFn(row) {
      return "_" + group_by.map(function (col) {
        return row[col];
      }).join('-');
    }; // NOTE: Object.keys({'b': 'b', '2': '2', '1': '1', 'a': 'a'}) => [ '1', '2', 'b', 'a' ]
    // that is why we have to add a prefix

  } else if (isString(group_by)) {
    groupingFn = function groupingFn(row) {
      return "_" + row[group_by];
    };
  }

  var groups = groupBy(newRows, groupingFn);
  return groups;
};