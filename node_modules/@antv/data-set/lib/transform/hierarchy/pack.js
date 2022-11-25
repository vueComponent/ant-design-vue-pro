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
  padding: 0,
  as: ['x', 'y', 'r']
};

function transform(dataView, options) {
  if (dataView.dataType !== HIERARCHY) {
    throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
  }

  var root = dataView.root;
  options = assign({}, DEFAULT_OPTIONS, options);
  var as = options.as;

  if (!isArray(as) || as.length !== 3) {
    throw new TypeError('Invalid as: it must be an array with 3 strings (e.g. [ "x", "y", "r" ])!');
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
    }).sort(function (a, b) {
      return b[field] - a[field];
    });
  }

  var packLayout = d3Hierarchy.pack();
  packLayout.size(options.size);

  if (options.padding) {
    packLayout.padding(options.padding);
  }

  packLayout(root);
  var x = as[0];
  var y = as[1];
  var r = as[2];
  root.each(function (node) {
    node[x] = node.x;
    node[y] = node.y;
    node[r] = node.r;
  });
}

registerTransform('hierarchy.pack', transform);
registerTransform('hierarchy.circle-packing', transform);
registerTransform('circle-packing', transform);