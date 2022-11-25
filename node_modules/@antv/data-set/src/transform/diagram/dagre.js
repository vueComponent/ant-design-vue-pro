/*
 * for DAG
 * graph data required (nodes, edges)
 */
const assign = require('@antv/util/lib/mix');
const dagre = require('dagre');
const {
  registerTransform
} = require('../../data-set');

const DEFAULT_OPTIONS = {
  // nodeId: node => node.index,
  rankdir: 'TB',
  align: 'TB',
  nodesep: 50,
  edgesep: 10,
  ranksep: 50,
  source: edge => edge.source,
  target: edge => edge.target
};

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const g = new dagre.graphlib.Graph();
  // Set an object for the graph label
  g.setGraph({});
  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function() {
    return {};
  });

  dv.nodes.forEach(node => {
    const nodeId = options.nodeId ? options.nodeId(node) : node.id;
    if (!node.height && !node.width) {
      node.height = node.width = options.edgesep;
    }
    g.setNode(nodeId, node);
  });
  dv.edges.forEach(edge => {
    g.setEdge(options.source(edge), options.target(edge));
  });
  dagre.layout(g);

  const nodes = [];
  const edges = [];

  g.nodes().forEach(node => {
    const n = g.node(node);
    const { x, y, height, width } = n;
    /* points
     * 3---2
     * |   |
     * 0---1
     */
    n.x = [ x - width / 2, x + width / 2, x + width / 2, x - width / 2 ];
    n.y = [ y + height / 2, y + height / 2, y - height / 2, y - height / 2 ];
    nodes.push(n);
  });

  g.edges().forEach(edge => {
    const { points } = g.edge(edge);
    const e = {};
    e.x = points.map(p => p.x);
    e.y = points.map(p => p.y);
    edges.push(e);
  });

  dv.nodes = nodes;
  dv.edges = edges;
}

registerTransform('diagram.dagre', transform);
registerTransform('dagre', transform);
