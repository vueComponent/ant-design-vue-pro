var assign = require('@antv/util/lib/mix');

var forIn = require('@antv/util/lib/each');

var isArray = require('@antv/util/lib/type/is-array');

var isString = require('@antv/util/lib/type/is-string');

var _require = require('simple-statistics'),
    sum = _require.sum;

var partition = require('../util/partition');

var _require2 = require('../data-set'),
    registerTransform = _require2.registerTransform;

var _require3 = require('../util/option-parser'),
    getField = _require3.getField;

var DEFAULT_OPTIONS = {
  // field: 'y', // required
  // dimension: 'x', // required
  groupBy: [],
  // optional
  as: '_percent'
};

function transform(dataView, options) {
  if (options === void 0) {
    options = {};
  }

  options = assign({}, DEFAULT_OPTIONS, options);
  var field = getField(options);
  var dimension = options.dimension;
  var groupBy = options.groupBy;
  var as = options.as;

  if (!isString(dimension)) {
    throw new TypeError('Invalid dimension: must be a string!');
  }

  if (isArray(as)) {
    console.warn('Invalid as: must be a string, will use the first element of the array specified.');
    as = as[0];
  }

  if (!isString(as)) {
    throw new TypeError('Invalid as: must be a string!');
  }

  var rows = dataView.rows;
  var result = [];
  var groups = partition(rows, groupBy);
  forIn(groups, function (group) {
    var totalSum = sum(group.map(function (row) {
      return row[field];
    }));

    if (totalSum === 0) {
      console.warn("Invalid data: total sum of field " + field + " is 0!");
    }

    var innerGroups = partition(group, [dimension]);
    forIn(innerGroups, function (innerGroup) {
      var innerSum = sum(innerGroup.map(function (row) {
        return row[field];
      })); // const resultRow = pick(innerGroup[0], union(groupBy, [ dimension ]));

      var resultRow = innerGroup[0]; // FIXME in case dimension and field is the same

      var dimensionValue = resultRow[dimension];
      resultRow[field] = innerSum;
      resultRow[dimension] = dimensionValue;

      if (totalSum === 0) {
        resultRow[as] = 0;
      } else {
        resultRow[as] = innerSum / totalSum;
      }

      result.push(resultRow);
    });
  });
  dataView.rows = result;
}

registerTransform('percent', transform);