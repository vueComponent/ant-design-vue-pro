const assign = require('@antv/util/lib/mix');
const forIn = require('@antv/util/lib/each');
const isArray = require('@antv/util/lib/type/is-array');
const isString = require('@antv/util/lib/type/is-string');
const {
  sum
} = require('simple-statistics');
const partition = require('../util/partition');
const {
  registerTransform
} = require('../data-set');
const {
  getField
} = require('../util/option-parser');

const DEFAULT_OPTIONS = {
  // field: 'y', // required
  // dimension: 'x', // required
  groupBy: [], // optional
  as: '_percent'
};

function transform(dataView, options = {}) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = getField(options);
  const dimension = options.dimension;
  const groupBy = options.groupBy;
  let as = options.as;
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
  const rows = dataView.rows;
  const result = [];
  const groups = partition(rows, groupBy);
  forIn(groups, group => {
    const totalSum = sum(group.map(row => row[field]));
    if (totalSum === 0) {
      console.warn(`Invalid data: total sum of field ${field} is 0!`);
    }
    const innerGroups = partition(group, [ dimension ]);
    forIn(innerGroups, innerGroup => {
      const innerSum = sum(innerGroup.map(row => row[field]));
      // const resultRow = pick(innerGroup[0], union(groupBy, [ dimension ]));
      const resultRow = innerGroup[0];
      // FIXME in case dimension and field is the same
      const dimensionValue = resultRow[dimension];
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
