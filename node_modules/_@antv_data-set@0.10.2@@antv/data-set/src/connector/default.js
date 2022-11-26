const isString = require('@antv/util/lib/type/is-string');
const cloneDeep = require('@antv/util/lib/clone');
const {
  registerConnector
} = require('../data-set');

registerConnector('default', (dataView, dataSet) => {
  if (isString(dataView)) {
    dataView = dataSet.getView(dataView);
  }
  if (!dataView) {
    throw new TypeError('Invalid dataView');
  }
  return cloneDeep(dataView.rows);
});
