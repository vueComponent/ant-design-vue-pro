const {
  registerTransform
} = require('../data-set');

/*
 * options: {
 *   type: 'sort',
 *   callback,
 * }
 */

registerTransform('sort', (dataView, options = {}) => {
  const columnName = dataView.getColumnName(0);
  dataView.rows.sort(options.callback || ((a, b) => a[columnName] - b[columnName]));
});
