const isFunction = require('@antv/util/lib/type/is-function');
const {
  hierarchy
} = require('d3-hierarchy');
const {
  HIERARCHY,
  registerConnector
} = require('../data-set');

/*
 * options: {
 *   children(d) { // optional
 *     return d.children
 *   },
 * }
 */

function connector(data, options, dataView) {
  dataView.dataType = HIERARCHY;
  const children = options && options.children ? options.children : null;

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
