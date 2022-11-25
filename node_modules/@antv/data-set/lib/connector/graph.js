var assign = require('@antv/util/lib/mix');

var isFunction = require('@antv/util/lib/type/is-function');

var _require = require('../data-set'),
    GRAPH = _require.GRAPH,
    registerConnector = _require.registerConnector;

var DEFAULT_OPTIONS = {
  nodes: function nodes(d) {
    // optional
    return d.nodes;
  },
  edges: function edges(d) {
    // optional
    return d.edges;
  }
};

function connector(data, options, dataView) {
  options = assign({}, DEFAULT_OPTIONS, options);
  dataView.dataType = GRAPH;
  var _options = options,
      nodes = _options.nodes,
      edges = _options.edges;

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