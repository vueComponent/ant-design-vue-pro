var _require = require('../data-set'),
    registerTransform = _require.registerTransform;
/*
 * options: {
 *   type: 'filter',
 *   callback,
 * }
 */


function defaultCallback(row) {
  return !!row;
}

registerTransform('filter', function (dataView, options) {
  if (options === void 0) {
    options = {};
  }

  dataView.rows = dataView.rows.filter(options.callback || defaultCallback);
});