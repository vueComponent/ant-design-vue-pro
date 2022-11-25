const {
  registerTransform
} = require('../data-set');

/*
 * options: {
 *   type: 'filter',
 *   callback,
 * }
 */

function defaultCallback(row) {
  return !!row;
}

registerTransform('filter', (dataView, options = {}) => {
  dataView.rows = dataView.rows.filter(options.callback || defaultCallback);
});
