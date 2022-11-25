const assign = require('@antv/util/lib/mix');
const forIn = require('@antv/util/lib/each');
const has = require('@antv/util/lib/object/has');
const isFunction = require('@antv/util/lib/type/is-function');
const isUndefined = require('@antv/util/lib/type/is-undefined');
const isString = require('@antv/util/lib/type/is-string');
const simpleStatistics = require('simple-statistics');
const partition = require('../util/partition');
const {
  registerTransform
} = require('../data-set');
const {
  getField
} = require('../util/option-parser');

const DEFAULT_OPTIONS = {
  // field: '', // required
  // method: 'value', // required
  // value: 10, // required if (method === 'value')
  groupBy: []
};

function notUndefinedValues(values) {
  return values.filter(value => !isUndefined(value));
}

const STATISTICS_METHODS = [
  'mean',
  'median',
  'max',
  'min'
];
const imputations = {};
STATISTICS_METHODS.forEach(method => {
  imputations[method] = (row, values) => simpleStatistics[method](values);
});
imputations.value = (row, values, value) => value;

function transform(dataView, options = {}) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = getField(options);
  const method = options.method;
  if (!method) {
    throw new TypeError('Invalid method!');
  }
  if ((method === 'value' && !has(options, 'value'))) {
    throw new TypeError('Invalid value: it is nil.');
  }
  const column = notUndefinedValues(dataView.getColumn(field));
  const groups = partition(dataView.rows, options.groupBy);
  forIn(groups, group => {
    let fieldValues = notUndefinedValues(group.map(row => row[field]));
    if (fieldValues.length === 0) {
      fieldValues = column;
    }
    group.forEach(row => {
      if (isUndefined(row[field])) {
        if (isFunction(method)) {
          row[field] = method(row, fieldValues, options.value, group);
        } else if (isString(method)) {
          row[field] = imputations[method](row, fieldValues, options.value);
        } else {
          throw new TypeError(`Invalid method: must be a function or one of ${STATISTICS_METHODS.join(', ')}`);
        }
      }
    });
  });
}

registerTransform('impute', transform);
