var assign = require('@antv/util/lib/mix');

var forIn = require('@antv/util/lib/each');

var partition = require('../util/partition');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var DEFAULT_OPTIONS = {
  fillBy: 'group',
  // group | order
  groupBy: [],
  orderBy: []
};

function arrayDifference(arr1, arr2) {
  // arrayDifference([1, 1, 1, 2], [1, 2]) => [1, 1]
  var shadow = arr1.map(function (item) {
    return item;
  }); // shadow copy

  arr2.forEach(function (item) {
    var index = shadow.indexOf(item);

    if (index > -1) {
      shadow.splice(index, 1);
    }
  });
  return shadow;
}

function transform(dataView, options) {
  if (options === void 0) {
    options = {};
  }

  options = assign({}, DEFAULT_OPTIONS, options);
  var rows = dataView.rows;
  var groupBy = options.groupBy;
  var orderBy = options.orderBy;
  var groups = partition(rows, groupBy, orderBy);
  var maxLength = 0;
  var referenceGroup = [];
  forIn(groups, function (group) {
    if (group.length > maxLength) {
      maxLength = group.length;
      referenceGroup = group;
    }
  });
  var referenceOrderByKeys = [];
  var referenceRowByOrderByKey = {};
  referenceGroup.forEach(function (row) {
    var key = orderBy.map(function (col) {
      return row[col];
    }).join('-');
    referenceOrderByKeys.push(key);
    referenceRowByOrderByKey[key] = row;
  });

  if (options.fillBy === 'order') {
    var first = referenceGroup[0];
    var allOrderByKeys = [];
    var rowByOrderByKey = {};
    rows.forEach(function (row) {
      var key = orderBy.map(function (col) {
        return row[col];
      }).join('-');

      if (allOrderByKeys.indexOf(key) === -1) {
        allOrderByKeys.push(key);
        rowByOrderByKey[key] = row;
      }
    });

    var _missingOrderByKeys = arrayDifference(allOrderByKeys, referenceOrderByKeys);

    _missingOrderByKeys.forEach(function (key) {
      var row = {};
      groupBy.forEach(function (col) {
        row[col] = first[col];
      });
      orderBy.forEach(function (col) {
        row[col] = rowByOrderByKey[key][col];
      });
      rows.push(row);
      referenceGroup.push(row);
      referenceOrderByKeys.push(key);
      referenceRowByOrderByKey[key] = row;
    });

    maxLength = referenceGroup.length;
  }

  forIn(groups, function (group) {
    if (group !== referenceGroup && group.length < maxLength) {
      var _first = group[0]; // missing orderBy keys

      var orderByKeys = [];
      group.forEach(function (row) {
        orderByKeys.push(orderBy.map(function (col) {
          return row[col];
        }).join('-'));
      });
      var missingOrderByKeys = arrayDifference(referenceOrderByKeys, orderByKeys);
      missingOrderByKeys.some(function (key, i) {
        if (i >= maxLength - group.length) {
          // group length overflow
          return true;
        }

        var referenceRow = referenceRowByOrderByKey[key];
        var row = {};
        groupBy.forEach(function (col) {
          row[col] = _first[col];
        });
        orderBy.forEach(function (col) {
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