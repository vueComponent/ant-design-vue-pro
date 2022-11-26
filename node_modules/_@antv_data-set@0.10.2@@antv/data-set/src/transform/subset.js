const {
  registerTransform
} = require('../data-set');
const {
  getFields
} = require('../util/option-parser');

/*
 * options: {
 *   type: 'subset',
 *   startRowIndex: 0,
 *   endRowIndex: 1,
 *   fields: [],
 * }
 */

registerTransform('subset', (dataView, options = {}) => {
  const startIndex = options.startRowIndex || 0;
  const endIndex = options.endRowIndex || dataView.rows.length - 1;
  const columns = getFields(options, dataView.getColumnNames());
  dataView.rows = dataView.getSubset(startIndex, endIndex, columns);
});
