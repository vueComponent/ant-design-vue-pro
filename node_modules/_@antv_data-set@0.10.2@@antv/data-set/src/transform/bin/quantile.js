const assign = require('@antv/util/lib/mix');
const forIn = require('@antv/util/lib/each');
const isArray = require('@antv/util/lib/type/is-array');
const isString = require('@antv/util/lib/type/is-string');
const {
  quantile
} = require('simple-statistics');
const partition = require('../../util/partition');
const pByFraction = require('../../util/p-by-fraction');
const {
  registerTransform
} = require('../../data-set');
const {
  getField
} = require('../../util/option-parser');

const DEFAULT_OPTIONS = {
  as: '_bin',
  groupBy: [], // optional
  fraction: 4 // default
  // p: [0.5, 0.3], // array of p parameter
  // field: 'y', // required
};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = getField(options);
  const as = options.as;
  if (!isString(as)) {
    throw new TypeError('Invalid as: it must be a string (e.g. "_bin")!');
  }
  let pArray = options.p;
  const fraction = options.fraction;
  if (!isArray(pArray) || pArray.length === 0) {
    pArray = pByFraction(fraction);
  }
  const rows = dataView.rows;
  const groupBy = options.groupBy;
  const groups = partition(rows, groupBy);
  const result = [];
  forIn(groups, group => {
    // const resultRow = pick(group[0], groupBy);
    const resultRow = group[0];
    const binningColumn = group.map(row => row[field]);
    const quantiles = pArray.map(p => quantile(binningColumn, p));
    resultRow[as] = quantiles;
    result.push(resultRow);
  });
  dataView.rows = result;
}

registerTransform('bin.quantile', transform);
