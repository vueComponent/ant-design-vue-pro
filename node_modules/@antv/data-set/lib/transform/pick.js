var pick = require('@antv/util/lib/pick');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../util/option-parser'),
    getFields = _require2.getFields;
/*
 * options: {
 *   type: 'pick',
 *   fields: [],
 * }
 */


registerTransform('pick', function (dataView, options) {
  if (options === void 0) {
    options = {};
  }

  var columns = getFields(options, dataView.getColumnNames());
  dataView.rows = dataView.rows.map(function (row) {
    return pick(row, columns);
  });
});