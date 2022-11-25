var isFunction = require('@antv/util/lib/type/is-function');

var _require = require('d3-hierarchy'),
    hierarchy = _require.hierarchy;

var _require2 = require('../data-set'),
    HIERARCHY = _require2.HIERARCHY,
    registerConnector = _require2.registerConnector;
/*
 * options: {
 *   children(d) { // optional
 *     return d.children
 *   },
 * }
 */


function connector(data, options, dataView) {
  dataView.dataType = HIERARCHY;
  var children = options && options.children ? options.children : null;

  if (children && !isFunction(children)) {
    throw new TypeError('Invalid children: must be a function!');
  }

  if (!options.pureData) {
    dataView.rows = dataView.root = hierarchy(data, children);
  } else {
    dataView.rows = dataView.root = data;
  }

  return data;
}

registerConnector('hierarchy', connector);
registerConnector('tree', connector);