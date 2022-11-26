var assign = require('@antv/util/lib/mix');

var d3Hierarchy = require('d3-hierarchy');

var isArray = require('@antv/util/lib/type/is-array');

var _require = require('../../data-set'),
    HIERARCHY = _require.HIERARCHY,
    registerTransform = _require.registerTransform;

var _require2 = require('../../util/option-parser'),
    getField = _require2.getField;

var DEFAULT_OPTIONS = {
  field: 'value',
  size: [1, 1],
  // width, height
  nodeSize: null,
  separation: null,
  as: ['x', 'y']
};

function transform(dataView, options) {
  if (dataView.dataType !== HIERARCHY) {
    throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
  }

  var root = dataView.root;
  options = assign({}, DEFAULT_OPTIONS, options);
  var as = options.as;

  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!');
  }

  var field;

  try {
    field = getField(options);
  } catch (e) {
    console.warn(e);
  }

  if (field) {
    root.sum(function (d) {
      return d[field];
    });
  }

  var clusterLayout = d3Hierarchy.cluster();
  clusterLayout.size(options.size);

  if (options.nodeSize) {
    clusterLayout.nodeSize(options.nodeSize);
  }

  if (options.separation) {
    clusterLayout.separation(options.separation);
  }

  clusterLayout(root);
  var x = as[0];
  var y = as[1];
  root.each(function (node) {
    node[x] = node.x;
    node[y] = node.y;
  });
}

registerTransform('hierarchy.cluster', transform);
registerTransform('dendrogram', transform);