/*
 * @reference: https://github.com/Planeshifter/kernel-smooth/blob/master/lib/index.js
 */
var assign = require('@antv/util/lib/mix');

var isArray = require('@antv/util/lib/type/is-array');

var isFunction = require('@antv/util/lib/type/is-function');

var isNumber = require('@antv/util/lib/type/is-number');

var isString = require('@antv/util/lib/type/is-string');

var keys = require('@antv/util/lib/object/keys'); // const regression = require('regression');


var getSeriesValues = require('../../util/get-series-values'); // const enclideanDistance = require('../../util/euclidean-distance');


var kernel = require('../../util/kernel');

var _require = require('../../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../../util/option-parser'),
    getFields = _require2.getFields;

var _require3 = require('../../util/bandwidth'),
    silverman = _require3.silverman;

var DEFAULT_OPTIONS = {
  as: ['x', 'y', 'z'],
  // fields: [ 'x', 'y' ], // required, one or two fields
  method: 'gaussian',
  // kernel method: should be one of keys(kernel)
  extent: [],
  // extent to execute regression function, default: [ [ min(x), max(x) ], [ min(y), max(y) ] ]
  bandwidth: [] // bandWidth to execute kernel function

};
var KERNEL_METHODS = keys(kernel);

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var fields = getFields(options);

  if (!isArray(fields) || fields.length !== 2) {
    throw new TypeError('invalid fields: must be an array of 2 strings!');
  }

  var _options$as = options.as,
      asX = _options$as[0],
      asY = _options$as[1],
      asZ = _options$as[2];

  if (!isString(asX) || !isString(asY) || !isString(asZ)) {
    throw new TypeError('invalid as: must be an array of 3 strings!');
  }

  var method = options.method;

  if (isString(method)) {
    if (KERNEL_METHODS.indexOf(method) === -1) {
      throw new TypeError("invalid method: " + method + ". Must be one of " + KERNEL_METHODS.join(', '));
    }

    method = kernel[method];
  }

  if (!isFunction(method)) {
    throw new TypeError('invalid method: kernel method must be a function!');
  }

  var xField = fields[0],
      yField = fields[1];
  var _options$extent = options.extent,
      extentX = _options$extent[0],
      extentY = _options$extent[1];

  if (!isArray(extentX) || !isArray(extentY)) {
    extentX = dv.range(xField);
    extentY = dv.range(yField);
  }

  var _options$bandwidth = options.bandwidth,
      bwX = _options$bandwidth[0],
      bwY = _options$bandwidth[1];

  if (!isNumber(bwX) || bwX <= 0 || !isNumber(bwY) || bwY <= 0) {
    bwX = silverman(dv.getColumn(xField));
    bwY = silverman(dv.getColumn(yField));
  }

  var seriesValuesX = getSeriesValues(extentX, bwX);
  var seriesValuesY = getSeriesValues(extentY, bwY);
  var count = dv.rows.length;
  var result = [];

  for (var i = 0; i < seriesValuesX.length; i++) {
    for (var j = 0; j < seriesValuesY.length; j++) {
      var sum = 0;
      var x = seriesValuesX[i];
      var y = seriesValuesY[j];

      for (var k = 0; k < count; k++) {
        sum += method((x - dv.rows[k][xField]) / bwX) * method((y - dv.rows[k][yField]) / bwY);
      }

      var z = 1 / (count * bwX * bwY) * sum;
      var row = {};
      row[asX] = x;
      row[asY] = y;
      row[asZ] = z;
      result.push(row);
    }
  }

  dv.rows = result;
}

registerTransform('kernel-smooth.density', transform);
registerTransform('kernel.density', transform);
module.exports = {
  KERNEL_METHODS: KERNEL_METHODS
};