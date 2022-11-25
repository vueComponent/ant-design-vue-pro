/*
 * for DAG
 * graph data required (nodes, edges)
 */
var assign = require('@antv/util/lib/mix');

var dagre = require('dagre');

var _require = require('../../data-set'),
    registerTransform = _require.registerTransform;

var DEFAULT_OPTIONS = {
  // nodeId: node => node.index,
  rankdir: 'TB',
  align: 'TB',
  nodesep: 50,
  edgesep: 10,
  ranksep: 50,
  source: function source(edge) {
    return edge.source;
  },
  target: function target(edge) {
    return edge.target;
  }
};

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var g = new dagre.graphlib.Graph(); // Set an object for the graph label

  g.setGraph({}); // Default to assigning a new object as a label for each new edge.

  g.setDefaultEdgeLabel(function () {
    return {};
  });
  dv.nodes.forEach(function (node) {
    var nodeId = options.nodeId ? options.nodeId(node) : node.id;

    if (!node.height && !node.width) {
      node.height = node.width = options.edgesep;
    }

    g.setNode(nodeId, node);
  });
  dv.edges.forEach(function (edge) {
    g.setEdge(options.source(edge), options.target(edge));
  });
  dagre.layout(g);
  var nodes = [];
  var edges = [];
  g.nodes().forEach(function (node) {
    var n = g.node(node);
    var x = n.x,
        y = n.y,
        height = n.height,
        width = n.width;
    /* points
     * 3---2
     * |   |
     * 0---1
     */

    n.x = [x - width / 2, x + width / 2, x + width / 2, x - width / 2];
    n.y = [y + height / 2, y + height / 2, y - height / 2, y - height / 2];
    nodes.push(n);
  });
  g.edges().forEach(function (edge) {
    var _g$edge = g.edge(edge),
        points = _g$edge.points;

    var e = {};
    e.x = points.map(function (p) {
      return p.x;
    });
    e.y = points.map(function (p) {
      return p.y;
    });
    edges.push(e);
  });
  dv.nodes = nodes;
  dv.edges = edges;
}

registerTransform('diagram.dagre', transform);
registerTransform('dagre', transform);