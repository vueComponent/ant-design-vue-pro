var isString = require('@antv/util/lib/type/is-string');

var cloneDeep = require('@antv/util/lib/clone');

var _require = require('../data-set'),
    registerConnector = _require.registerConnector;

registerConnector('default', function (dataView, dataSet) {
  if (isString(dataView)) {
    dataView = dataSet.getView(dataView);
  }

  if (!dataView) {
    throw new TypeError('Invalid dataView');
  }

  return cloneDeep(dataView.rows);
});