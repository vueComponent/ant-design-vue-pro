const {
  registerTransform
} = require('../data-set');

/*
 * options: {
 *   type: 'reverse',
 * }
 */

registerTransform('reverse', dataView => {
  dataView.rows.reverse();
});

