var isArray = require('@antv/util/lib/type/is-array');

var sortBy = require('@antv/util/lib/array/sort-by');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../util/option-parser'),
    getFields = _require2.getFields;
/*
 * options: {
 *   type: 'sort-by',
 *   fields: [],
 *   order: 'ASC' // 'DESC'
 * }
 */


var VALID_ORDERS = ['ASC', 'DESC'];

function transform(dataView, options) {
  if (options === void 0) {
    options = {};
  }

  var fields = getFields(options, [dataView.getColumnName(0)]);

  if (!isArray(fields)) {
    throw new TypeError('Invalid fields: must be an array with strings!');
  }

  dataView.rows = sortBy(dataView.rows, fields);
  var order = options.order;

  if (order && VALID_ORDERS.indexOf(order) === -1) {
    throw new TypeError("Invalid order: " + order + " must be one of " + VALID_ORDERS.join(', '));
  } else if (order === 'DESC') {
    dataView.rows.reverse();
  }
}

registerTransform('sort-by', transform);
registerTransform('sortBy', transform);