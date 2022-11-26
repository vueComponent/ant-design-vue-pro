var assign = require('@antv/util/lib/mix');

var isArray = require('@antv/util/lib/type/is-array');

var isNumber = require('@antv/util/lib/type/is-number');

var regression = require('regression');

var getSeriesValues = require('../util/get-series-values');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../util/option-parser'),
    getFields = _require2.getFields;

var _require3 = require('../util/bandwidth'),
    silverman = _require3.silverman;

var DEFAULT_OPTIONS = {
  as: ['x', 'y'],
  // fields: [ 'x', 'y' ], // required two fields
  method: 'linear',
  // regression method: linear, exponential, logarithmic, power, polynomial
  // extent: [], // extent to execute regression function, default: [ min(x), max(x) ]
  // bandwidth: 1, // bandWidth to execute regression function
  order: 2,
  // order of the polynomial curve
  precision: 2 // the number of significant figures the output is rounded to

};
var REGRESSION_METHODS = ['linear', 'exponential', 'logarithmic', 'power', 'polynomial'];

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var fields = getFields(options);

  if (!isArray(fields) || fields.length !== 2) {
    throw new TypeError('invalid fields: must be an array of 2 strings.');
  }

  var xField = fields[0],
      yField = fields[1];
  var method = options.method;

  if (REGRESSION_METHODS.indexOf(method) === -1) {
    throw new TypeError("invalid method: " + method + ". Must be one of " + REGRESSION_METHODS.join(', '));
  }

  var points = dataView.rows.map(function (row) {
    return [row[xField], row[yField]];
  });
  var regressionResult = regression[method](points, options);
  var extent = options.extent;

  if (!isArray(extent) || extent.length !== 2) {
    extent = dataView.range(xField);
  }

  var bandwidth = options.bandwidth;

  if (!isNumber(bandwidth) || bandwidth <= 0) {
    bandwidth = silverman(dataView.getColumn(xField));
  }

  var valuesToPredict = getSeriesValues(extent, bandwidth);
  var result = [];
  var _options$as = options.as,
      asX = _options$as[0],
      asY = _options$as[1];
  valuesToPredict.forEach(function (value) {
    var row = {};

    var _regressionResult$pre = regressionResult.predict(value),
        x = _regressionResult$pre[0],
        y = _regressionResult$pre[1];

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
  REGRESSION_METHODS: REGRESSION_METHODS
};