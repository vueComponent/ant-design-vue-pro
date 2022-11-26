var _require = require('../data-set'),
    registerTransform = _require.registerTransform;
/*
 * options: {
 *   type: 'map',
 *   callback,
 * }
 */


function defaultCallback(row) {
  return row;
}

registerTransform('map', function (dataView, options) {
  if (options === void 0) {
    options = {};
  }

  dataView.rows = dataView.rows.map(options.callback || defaultCallback);
});