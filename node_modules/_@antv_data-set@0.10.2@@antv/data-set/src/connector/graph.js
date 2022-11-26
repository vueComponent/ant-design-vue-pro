const assign = require('@antv/util/lib/mix');
const isFunction = require('@antv/util/lib/type/is-function');
const {
  GRAPH,
  registerConnector
} = require('../data-set');

const DEFAULT_OPTIONS = {
  nodes(d) { // optional
    return d.nodes;
  },
  edges(d) { // optional
    return d.edges;
  }
};

function connector(data, options, dataView) {
  options = assign({}, DEFAULT_OPTIONS, options);
  dataView.dataType = GRAPH;
  const { nodes, edges } = options;
  if (nodes && !isFunction(nodes)) {
    throw new TypeError('Invalid nodes: must be a function!');
  }
  if (edges && !isFunction(edges)) {
    throw new TypeError('Invalid edges: must be a function!');
  }
  dataView.rows = dataView.graph = {
    nodes: nodes(data),
    edges: edges(data)
  };
  assign(dataView, dataView.graph);
  return dataView.rows;
}

registerConnector('graph', connector);
registerConnector('diagram', connector);
