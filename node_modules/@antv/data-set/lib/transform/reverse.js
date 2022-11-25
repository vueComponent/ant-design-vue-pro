var _require = require('../data-set'),
    registerTransform = _require.registerTransform;
/*
 * options: {
 *   type: 'reverse',
 * }
 */


registerTransform('reverse', function (dataView) {
  dataView.rows.reverse();
});