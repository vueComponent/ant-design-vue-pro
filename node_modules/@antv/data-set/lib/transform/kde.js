/*
 * kernel density estimation
 */
var assign = require('@antv/util/lib/mix');

var each = require('@antv/util/lib/each');

var forIn = require('@antv/util/lib/each');

var isArray = require('@antv/util/lib/type/is-array');

var isFunction = require('@antv/util/lib/type/is-function');

var isNumber = require('@antv/util/lib/type/is-number');

var isString = require('@antv/util/lib/type/is-string');

var keys = require('@antv/util/lib/object/keys');

var pick = require('@antv/util/lib/pick');

var getSeriesValues = require('../util/get-series-values');

var kernel = require('../util/kernel');

var bandwidth = require('../util/bandwidth');

var partition = require('../util/partition');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../util/option-parser'),
    getFields = _require2.getFields;

var _require3 = require('simple-statistics'),
    kernelDensityEstimation = _require3.kernelDensityEstimation;

var DEFAULT_OPTIONS = {
  minSize: 0.01,
  as: ['key', 'y', 'size'],
  // fields: [ 'y1', 'y2' ], // required, one or more fields
  extent: [],
  // extent to execute regression function, default: [ [ min(x), max(x) ], [ min(y), max(y) ] ]
  method: 'gaussian',
  // kernel method: should be one of keys(kernel)
  bandwidth: 'nrd',
  // bandwidth method to execute kernel function // nrd, silverman or a fixed bandwidth value
  step: 0,
  groupBy: []
};
var KERNEL_METHODS = keys(kernel);
var BANDWIDTH_METHODS = keys(bandwidth);

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var fields = getFields(options);

  if (!isArray(fields) || fields.length < 1) {
    throw new TypeError('invalid fields: must be an array of at least 1 strings!');
  }

  var as = options.as;

  if (!isArray(as) || as.length !== 3) {
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

  var extent = options.extent;

  if (!isArray(extent) || extent.length === 0) {
    var rangeArr = [];
    each(fields, function (field) {
      var range = dv.range(field);
      rangeArr = rangeArr.concat(range);
    });
    extent = [Math.min.apply(Math, rangeArr), Math.max.apply(Math, rangeArr)];
  }

  var bw = options.bandwidth;

  if (isString(bw) && bandwidth[bw]) {
    bw = bandwidth[bw](dv.getColumn(fields[0]));
  } else if (isFunction(bw)) {
    bw = bw(dv.getColumn(fields[0]));
  } else if (!isNumber(bw) || bw <= 0) {
    bw = bandwidth.nrd(dv.getColumn(fields[0]));
  }

  var seriesValues = getSeriesValues(extent, options.step ? options.step : bw);
  var result = [];
  var groupBy = options.groupBy;
  var groups = partition(dv.rows, groupBy);
  forIn(groups, function (group) {
    var probalityDensityFunctionByField = {};
    each(fields, function (field) {
      var row = pick(group[0], groupBy);
      probalityDensityFunctionByField[field] = kernelDensityEstimation(group.map(function (item) {
        return item[field];
      }), method, bw);
      var key = as[0],
          y = as[1],
          size = as[2];
      row[key] = field;
      row[y] = [];
      row[size] = [];
      each(seriesValues, function (yValue) {
        var sizeValue = probalityDensityFunctionByField[field](yValue);

        if (sizeValue >= options.minSize) {
          row[y].push(yValue);
          row[size].push(sizeValue);
        }
      });
      result.push(row);
    });
  });
  dv.rows = result;
}

registerTransform('kernel-density-estimation', transform);
registerTransform('kde', transform);
registerTransform('KDE', transform);
module.exports = {
  KERNEL_METHODS: KERNEL_METHODS,
  BANDWIDTH_METHODS: BANDWIDTH_METHODS
};