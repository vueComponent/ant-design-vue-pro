const {
  registerTransform
} = require('../data-set');

/*
 * options: {
 *   type: 'map',
 *   callback,
 * }
 */

function defaultCallback(row) {
  return row;
}

registerTransform('map', (dataView, options = {}) => {
  dataView.rows = dataView.rows.map(options.callback || defaultCallback);
});
