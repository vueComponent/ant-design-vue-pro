/*
 * @reference: https://github.com/Planeshifter/kernel-smooth/blob/master/lib/index.js
 */
var assign = require('@antv/util/lib/mix');

var isArray = require('@antv/util/lib/type/is-array');

var isFunction = require('@antv/util/lib/type/is-function');

var isNil = require('@antv/util/lib/type/is-nil');

var isNumber = require('@antv/util/lib/type/is-number');

var isString = require('@antv/util/lib/type/is-string');

var keys = require('@antv/util/lib/object/keys'); // const regression = require('regression');


var _require = require('simple-statistics'),
    sum = _require.sum;

var getSeriesValues = require('../../util/get-series-values'); // const enclideanDistance = require('../../util/euclidean-distance');


var kernel = require('../../util/kernel');

var _require2 = require('../../data-set'),
    registerTransform = _require2.registerTransform;

var _require3 = require('../../util/option-parser'),
    getFields = _require3.getFields;

var _require4 = require('../../util/bandwidth'),
    silverman = _require4.silverman;

var DEFAULT_OPTIONS = {
  as: ['x', 'y'],
  // fields: [ 'x', 'y' ], // required, one or two fields
  method: 'gaussian' // kernel method: should be one of keys(kernel)
  // extent: [], // extent to execute regression function, default: [ min(x), max(x) ]
  // bandwidth: 0.5 // bandWidth to execute kernel function

};
var KERNEL_METHODS = keys(kernel); // calculates weight for i-th obs

function weight(kernel, bandwidth, x_0, x_i) {
  var arg = (x_i - x_0) / bandwidth;
  return kernel(arg);
} // calculates weight for i-th obs when p > 1
// function weight_vectors(kernel, bandwidth, x_0, x_i) {
//   const arg = enclideanDistance(x_i, x_0) / bandwidth;
//   return kernel(arg);
// }


function vectorize(fun) {
  return function (x) {
    if (!isArray(x)) {
      return fun(x);
    }

    return x.map(function (x) {
      return fun(x);
    });
  };
}

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var fields = getFields(options);

  if (!isArray(fields) || fields.length !== 1 && fields.length !== 2) {
    throw new TypeError('invalid fields: must be an array of 1 or 2 strings!');
  }

  var _options$as = options.as,
      asX = _options$as[0],
      asY = _options$as[1];

  if (!isString(asX) || !isString(asY)) {
    throw new TypeError('invalid as: must be an array of 2 strings!');
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
  var xs = dv.getColumn(xField);
  var extent = options.extent;

  if (!isArray(extent)) {
    extent = dv.range(xField);
  }

  var bandwidth = options.bandwidth;

  if (!isNumber(bandwidth) || bandwidth <= 0) {
    bandwidth = silverman(xs);
  }

  var seriesValues = getSeriesValues(extent, bandwidth);
  var xCount = xs.length;
  var weightFunc = weight.bind(null, method, bandwidth);
  var kernelSmoother;

  if (isNil(yField)) {
    // KDE
    kernelSmoother = vectorize(function (x) {
      var weights = xs.map(function (x_i) {
        return weightFunc(x, x_i);
      });
      var num = sum(weights);
      var denom = xCount * bandwidth;
      if (!num || !denom) return 0;
      return num / denom;
    });
  } else {
    // kernel regression smoothing
    var ys = dv.getColumn(yField);
    kernelSmoother = vectorize(function (x) {
      var weights = xs.map(function (x_i) {
        return weightFunc(x, x_i);
      });
      var num = sum(weights.map(function (w, i) {
        return w * ys[i];
      }));
      var denom = sum(weights);
      if (!num || !denom) return 0;
      return num / denom;
    });
  }

  var result = seriesValues.map(function (x) {
    var row = {};
    row[asX] = x;
    row[asY] = kernelSmoother(x);
    return row;
  });
  dv.rows = result;
}

registerTransform('kernel-smooth.regression', transform);
registerTransform('kernel.regression', transform);
module.exports = {
  KERNEL_METHODS: KERNEL_METHODS
};