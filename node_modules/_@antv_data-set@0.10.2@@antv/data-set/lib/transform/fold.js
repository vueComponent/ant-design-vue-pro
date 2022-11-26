var assign = require('@antv/util/lib/mix');

var difference = require('@antv/util/lib/array/difference');

var pick = require('@antv/util/lib/pick');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../util/option-parser'),
    getFields = _require2.getFields;

var DEFAULT_OPTIONS = {
  fields: [],
  key: 'key',
  retains: [],
  value: 'value'
};
registerTransform('fold', function (dataView, options) {
  var columns = dataView.getColumnNames();
  options = assign({}, DEFAULT_OPTIONS, options);
  var fields = getFields(options);

  if (fields.length === 0) {
    console.warn('warning: option fields is not specified, will fold all columns.');
    fields = columns;
  }

  var key = options.key;
  var value = options.value;
  var retains = options.retains;

  if (retains.length === 0) {
    retains = difference(columns, fields);
  }

  var resultRows = [];
  dataView.rows.forEach(function (row) {
    fields.forEach(function (field) {
      var resultRow = pick(row, retains);
      resultRow[key] = field;
      resultRow[value] = row[field];
      resultRows.push(resultRow);
    });
  });
  dataView.rows = resultRows;
});