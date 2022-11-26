var _require = require('../data-set'),
    registerTransform = _require.registerTransform;
/*
 * options: {
 *   type: 'sort',
 *   callback,
 * }
 */


registerTransform('sort', function (dataView, options) {
  if (options === void 0) {
    options = {};
  }

  var columnName = dataView.getColumnName(0);
  dataView.rows.sort(options.callback || function (a, b) {
    return a[columnName] - b[columnName];
  });
});