/*
 * @reference: https://github.com/Planeshifter/kernel-smooth/blob/master/lib/index.js
 */
const assign = require('@antv/util/lib/mix');
const isArray = require('@antv/util/lib/type/is-array');
const isFunction = require('@antv/util/lib/type/is-function');
const isNil = require('@antv/util/lib/type/is-nil');
const isNumber = require('@antv/util/lib/type/is-number');
const isString = require('@antv/util/lib/type/is-string');
const keys = require('@antv/util/lib/object/keys');
// const regression = require('regression');
const {
  sum
} = require('simple-statistics');
const getSeriesValues = require('../../util/get-series-values');
// const enclideanDistance = require('../../util/euclidean-distance');
const kernel = require('../../util/kernel');
const {
  registerTransform
} = require('../../data-set');
const {
  getFields
} = require('../../util/option-parser');
const {
  silverman
} = require('../../util/bandwidth');

const DEFAULT_OPTIONS = {
  as: [ 'x', 'y' ],
  // fields: [ 'x', 'y' ], // required, one or two fields
  method: 'gaussian' // kernel method: should be one of keys(kernel)
  // extent: [], // extent to execute regression function, default: [ min(x), max(x) ]
  // bandwidth: 0.5 // bandWidth to execute kernel function
};

const KERNEL_METHODS = keys(kernel);

// calculates weight for i-th obs
function weight(kernel, bandwidth, x_0, x_i) {
  const arg = (x_i - x_0) / bandwidth;
  return kernel(arg);
}
// calculates weight for i-th obs when p > 1
// function weight_vectors(kernel, bandwidth, x_0, x_i) {
//   const arg = enclideanDistance(x_i, x_0) / bandwidth;
//   return kernel(arg);
// }
function vectorize(fun) {
  return function(x) {
    if (!isArray(x)) {
      return fun(x);
    }
    return x.map(function(x) {
      return fun(x);
    });
  };
}

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  if (!isArray(fields) || (fields.length !== 1 && fields.length !== 2)) {
    throw new TypeError('invalid fields: must be an array of 1 or 2 strings!');
  }
  const [ asX, asY ] = options.as;
  if (!isString(asX) || !isString(asY)) {
    throw new TypeError('invalid as: must be an array of 2 strings!');
  }
  let method = options.method;
  if (isString(method)) {
    if (KERNEL_METHODS.indexOf(method) === -1) {
      throw new TypeError(`invalid method: ${method}. Must be one of ${KERNEL_METHODS.join(', ')}`);
    }
    method = kernel[method];
  }
  if (!isFunction(method)) {
    throw new TypeError('invalid method: kernel method must be a function!');
  }

  const [ xField, yField ] = fields;
  const xs = dv.getColumn(xField);

  let extent = options.extent;
  if (!isArray(extent)) {
    extent = dv.range(xField);
  }
  let bandwidth = options.bandwidth;
  if (!isNumber(bandwidth) || bandwidth <= 0) {
    bandwidth = silverman(xs);
  }
  const seriesValues = getSeriesValues(extent, bandwidth);
  const xCount = xs.length;
  const weightFunc = weight.bind(null, method, bandwidth);
  let kernelSmoother;

  if (isNil(yField)) {
    // KDE
    kernelSmoother = vectorize(x => {
      const weights = xs.map(x_i => weightFunc(x, x_i));
      const num = sum(weights);
      const denom = xCount * bandwidth;
      if (!num || !denom) return 0;
      return num / denom;
    });
  } else {
    // kernel regression smoothing
    const ys = dv.getColumn(yField);
    kernelSmoother = vectorize(x => {
      const weights = xs.map(x_i => weightFunc(x, x_i));
      const num = sum(weights.map((w, i) => w * ys[i]));
      const denom = sum(weights);
      if (!num || !denom) return 0;
      return num / denom;
    });
  }

  const result = seriesValues.map(x => {
    const row = {};
    row[asX] = x;
    row[asY] = kernelSmoother(x);
    return row;
  });
  dv.rows = result;
}

registerTransform('kernel-smooth.regression', transform);
registerTransform('kernel.regression', transform);

module.exports = {
  KERNEL_METHODS
};
