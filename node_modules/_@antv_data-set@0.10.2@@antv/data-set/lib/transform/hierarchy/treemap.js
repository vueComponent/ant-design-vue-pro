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
  tile: 'treemapSquarify',
  // treemapBinary, treemapDice, treemapSlice, treemapSliceDice, treemapSquarify, treemapResquarify
  size: [1, 1],
  // width, height
  round: false,
  // ratio: 1.618033988749895, // golden ratio
  padding: 0,
  paddingInner: 0,
  paddingOuter: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
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

  var treemapLayout = d3Hierarchy.treemap();
  treemapLayout.tile(d3Hierarchy[options.tile]).size(options.size).round(options.round).padding(options.padding).paddingInner(options.paddingInner).paddingOuter(options.paddingOuter).paddingTop(options.paddingTop).paddingRight(options.paddingRight).paddingBottom(options.paddingBottom).paddingLeft(options.paddingLeft);
  treemapLayout(root);
  /*
   * points:
   *   3  2
   *   0  1
   */

  var x = as[0];
  var y = as[1];
  root.each(function (node) {
    node[x] = [node.x0, node.x1, node.x1, node.x0];
    node[y] = [node.y1, node.y1, node.y0, node.y0];
    ['x0', 'x1', 'y0', 'y1'].forEach(function (prop) {
      if (as.indexOf(prop) === -1) {
        delete node[prop];
      }
    });
  });
}

registerTransform('hierarchy.treemap', transform);
registerTransform('treemap', transform);