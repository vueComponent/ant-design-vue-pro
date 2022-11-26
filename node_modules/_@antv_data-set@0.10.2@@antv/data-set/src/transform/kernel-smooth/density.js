/*
 * @reference: https://github.com/Planeshifter/kernel-smooth/blob/master/lib/index.js
 */
const assign = require('@antv/util/lib/mix');
const isArray = require('@antv/util/lib/type/is-array');
const isFunction = require('@antv/util/lib/type/is-function');
const isNumber = require('@antv/util/lib/type/is-number');
const isString = require('@antv/util/lib/type/is-string');
const keys = require('@antv/util/lib/object/keys');
// const regression = require('regression');
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
  as: [ 'x', 'y', 'z' ],
  // fields: [ 'x', 'y' ], // required, one or two fields
  method: 'gaussian', // kernel method: should be one of keys(kernel)
  extent: [], // extent to execute regression function, default: [ [ min(x), max(x) ], [ min(y), max(y) ] ]
  bandwidth: [] // bandWidth to execute kernel function
};

const KERNEL_METHODS = keys(kernel);

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const fields = getFields(options);
  if (!isArray(fields) || fields.length !== 2) {
    throw new TypeError('invalid fields: must be an array of 2 strings!');
  }
  const [ asX, asY, asZ ] = options.as;
  if (!isString(asX) || !isString(asY) || !isString(asZ)) {
    throw new TypeError('invalid as: must be an array of 3 strings!');
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
  let [ extentX, extentY ] = options.extent;
  if (!isArray(extentX) || !isArray(extentY)) {
    extentX = dv.range(xField);
    extentY = dv.range(yField);
  }
  let [ bwX, bwY ] = options.bandwidth;
  if (!isNumber(bwX) || bwX <= 0 || !isNumber(bwY) || bwY <= 0) {
    bwX = silverman(dv.getColumn(xField));
    bwY = silverman(dv.getColumn(yField));
  }
  const seriesValuesX = getSeriesValues(extentX, bwX);
  const seriesValuesY = getSeriesValues(extentY, bwY);
  const count = dv.rows.length;
  const result = [];

  for (let i = 0; i < seriesValuesX.length; i++) {
    for (let j = 0; j < seriesValuesY.length; j++) {
      let sum = 0;
      const x = seriesValuesX[i];
      const y = seriesValuesY[j];
      for (let k = 0; k < count; k++) {
        sum += method((x - dv.rows[k][xField]) / bwX) * method((y - dv.rows[k][yField]) / bwY);
      }
      const z = (1 / (count * bwX * bwY)) * sum;
      const row = {};
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
  KERNEL_METHODS
};
