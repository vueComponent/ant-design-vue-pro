const {
  registerTransform
} = require('../data-set');

registerTransform('default', dataView => {
  return dataView;
});

