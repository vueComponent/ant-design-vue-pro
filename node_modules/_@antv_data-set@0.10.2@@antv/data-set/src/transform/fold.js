const assign = require('@antv/util/lib/mix');
const difference = require('@antv/util/lib/array/difference');
const pick = require('@antv/util/lib/pick');
const {
  registerTransform
} = require('../data-set');
const {
  getFields
} = require('../util/option-parser');

const DEFAULT_OPTIONS = {
  fields: [],
  key: 'key',
  retains: [],
  value: 'value'
};

registerTransform('fold', (dataView, options) => {
  const columns = dataView.getColumnNames();
  options = assign({}, DEFAULT_OPTIONS, options);
  let fields = getFields(options);
  if (fields.length === 0) {
    console.warn('warning: option fields is not specified, will fold all columns.');
    fields = columns;
  }
  const key = options.key;
  const value = options.value;
  let retains = options.retains;
  if (retains.length === 0) {
    retains = difference(columns, fields);
  }
  const resultRows = [];
  dataView.rows.forEach(row => {
    fields.forEach(field => {
      const resultRow = pick(row, retains);
      resultRow[key] = field;
      resultRow[value] = row[field];
      resultRows.push(resultRow);
    });
  });
  dataView.rows = resultRows;
});
