const assign = require('@antv/util/lib/mix');
const isArray = require('@antv/util/lib/type/is-array');
const isNumber = require('@antv/util/lib/type/is-number');
const regression = require('regression');
const getSeriesValues = require('../util/get-series-values');
const {
  registerTransform
} = require('../data-set');
const {
  getFields
} = require('../util/option-parser');
const {
  silverman
} = require('../util/bandwidth');

const DEFAULT_OPTIONS = {
  as: [ 'x', 'y' ],
  // fields: [ 'x', 'y' ], // required two fields
  method: 'linear', // regression method: linear, exponential, logarithmic, power, polynomial
  // extent: [], // extent to execute regression function, default: [ min(x), max(x) ]
  // bandwidth: 1, // bandWidth to execute regression function
  order: 2, // order of the polynomial curve
  precision: 2 // the number of significant figures the output is rounded to
};

const REGRESSION_METHODS = [
  'linear',
  'exponential',
  'logarithmic',
  'power',
  'polynomial'
];

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  if (!isArray(fields) || fields.length !== 2) {
    throw new TypeError('invalid fields: must be an array of 2 strings.');
  }
  const [ xField, yField ] = fields;
  const method = options.method;
  if (REGRESSION_METHODS.indexOf(method) === -1) {
    throw new TypeError(`invalid method: ${method}. Must be one of ${REGRESSION_METHODS.join(', ')}`);
  }
  const points = dataView.rows.map(row => [ row[xField], row[yField] ]);
  const regressionResult = regression[method](points, options);
  let extent = options.extent;
  if (!isArray(extent) || extent.length !== 2) {
    extent = dataView.range(xField);
  }
  let bandwidth = options.bandwidth;
  if (!isNumber(bandwidth) || bandwidth <= 0) {
    bandwidth = silverman(dataView.getColumn(xField));
  }
  const valuesToPredict = getSeriesValues(extent, bandwidth);
  const result = [];
  const [ asX, asY ] = options.as;
  valuesToPredict.forEach(value => {
    const row = {};
    const [ x, y ] = regressionResult.predict(value);
    row[asX] = x;
    row[asY] = y;
    if (isFinite(y)) {
      result.push(row);
    }
  });
  dataView.rows = result;
}

registerTransform('regression', transform);

module.exports = {
  REGRESSION_METHODS
};
