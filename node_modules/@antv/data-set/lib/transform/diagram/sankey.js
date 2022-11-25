/*
 * for Sankey Diagram
 * graph data required (nodes, edges)
 */
var assign = require('@antv/util/lib/mix');

var isString = require('@antv/util/lib/type/is-string');

var isFunction = require('@antv/util/lib/type/is-function');

var _require = require('d3-sankey'),
    sankey = _require.sankey,
    sankeyLeft = _require.sankeyLeft,
    sankeyRight = _require.sankeyRight,
    sankeyCenter = _require.sankeyCenter,
    sankeyJustify = _require.sankeyJustify;

var _require2 = require('../../data-set'),
    registerTransform = _require2.registerTransform;

var ALIGN_METHOD = {
  sankeyLeft: sankeyLeft,
  sankeyRight: sankeyRight,
  sankeyCenter: sankeyCenter,
  sankeyJustify: sankeyJustify
};
var DEFAULT_OPTIONS = {
  // nodeId: node => node.index,
  value: function value(node) {
    return node.value;
  },
  source: function source(edge) {
    return edge.source;
  },
  target: function target(edge) {
    return edge.target;
  },
  nodeAlign: 'sankeyJustify',
  nodeWidth: 0.02,
  nodePadding: 0.02
};

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var nodeAlign = null;

  if (isString(options.nodeAlign)) {
    nodeAlign = ALIGN_METHOD[options.nodeAlign];
  } else if (isFunction(options.nodeAlign)) {
    nodeAlign = options.nodeAlign;
  }

  var sankeyProcessor = sankey().links(function (d) {
    return d.edges;
  }).nodeWidth(options.nodeWidth).nodePadding(options.nodePadding).extent([[0, 0], [1, 1]]);

  if (isFunction(options.nodeId)) {
    sankeyProcessor.nodeId(options.nodeId);
  }

  if (nodeAlign) {
    sankeyProcessor.nodeAlign(nodeAlign);
  }

  sankeyProcessor(dv); // post process (x, y), etc.

  dv.nodes.forEach(function (node) {
    var x0 = node.x0,
        x1 = node.x1,
        y0 = node.y0,
        y1 = node.y1;
    /* points
     * 3---2
     * |   |
     * 0---1
     */

    node.x = [x0, x1, x1, x0];
    node.y = [y0, y0, y1, y1];
  });
  dv.edges.forEach(function (edge) {
    var source = edge.source,
        target = edge.target;
    var sx = source.x1;
    var tx = target.x0;
    edge.x = [sx, sx, tx, tx];
    var offset = edge.width / 2;
    edge.y = [edge.y0 + offset, edge.y0 - offset, edge.y1 + offset, edge.y1 - offset];
  });
}

registerTransform('diagram.sankey', transform);
registerTransform('sankey', transform);