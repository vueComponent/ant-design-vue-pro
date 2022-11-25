/*
 * for Arc Diagram (edges without weight) / Chord Diagram (edges with source and target weight)
 * graph data required (nodes, edges)
 */
var assign = require('@antv/util/lib/mix');

var forIn = require('@antv/util/lib/each');

var isArray = require('@antv/util/lib/type/is-array');

var values = require('@antv/util/lib/object/values');

var isFunction = require('@antv/util/lib/type/is-function');

var _require = require('../../data-set'),
    registerTransform = _require.registerTransform;

var DEFAULT_OPTIONS = {
  y: 0,
  thickness: 0.05,
  // thickness of the node, (0, 1)
  weight: false,
  marginRatio: 0.1,
  // margin ratio, [0, 1)
  id: function id(node) {
    return node.id;
  },
  source: function source(edge) {
    return edge.source;
  },
  target: function target(edge) {
    return edge.target;
  },
  sourceWeight: function sourceWeight(edge) {
    return edge.value || 1;
  },
  targetWeight: function targetWeight(edge) {
    return edge.value || 1;
  },
  sortBy: null // optional, id | weight | frequency | {function}

};

function _nodesFromEdges(edges, options, map) {
  if (map === void 0) {
    map = {};
  }

  edges.forEach(function (edge) {
    var sId = options.edgeSource(edge);
    var tId = options.edgeTarget(edge);

    if (!map[sId]) {
      map[sId] = {
        id: sId
      };
    }

    if (!map[tId]) {
      map[tId] = {
        id: tId
      };
    }
  });
  return values(map);
}

function _processGraph(nodeById, edges, options) {
  forIn(nodeById, function (node, id) {
    // in edges, out edges
    node.inEdges = edges.filter(function (edge) {
      return "" + options.target(edge) === "" + id;
    });
    node.outEdges = edges.filter(function (edge) {
      return "" + options.source(edge) === "" + id;
    }); // frequency

    node.edges = node.outEdges.concat(node.inEdges);
    node.frequency = node.edges.length; // weight

    node.value = 0;
    node.inEdges.forEach(function (edge) {
      node.value += options.targetWeight(edge);
    });
    node.outEdges.forEach(function (edge) {
      node.value += options.sourceWeight(edge);
    });
  });
}

function _sortNodes(nodes, options) {
  var sortMethods = {
    weight: function weight(a, b) {
      return b.value - a.value;
    },
    frequency: function frequency(a, b) {
      return b.frequency - a.frequency;
    },
    id: function id(a, b) {
      return ("" + options.id(a)).localeCompare("" + options.id(b));
    }
  };
  var method = sortMethods[options.sortBy];

  if (!method && isFunction(options.sortBy)) {
    method = options.sortBy;
  }

  if (method) {
    nodes.sort(method);
  }
}

function _layoutNodes(nodes, options) {
  var len = nodes.length;

  if (!len) {
    throw new TypeError('Invalid nodes: it\'s empty!');
  }

  if (options.weight) {
    var marginRatio = options.marginRatio;

    if (marginRatio < 0 || marginRatio >= 1) {
      throw new TypeError('Invalid marginRatio: it must be in range [0, 1)!');
    }

    var margin = marginRatio / (2 * len);
    var thickness = options.thickness;

    if (thickness <= 0 || thickness >= 1) {
      throw new TypeError('Invalid thickness: it must be in range (0, 1)!');
    }

    var totalValue = 0;
    nodes.forEach(function (node) {
      totalValue += node.value;
    });
    nodes.forEach(function (node) {
      node.weight = node.value / totalValue;
      node.width = node.weight * (1 - marginRatio);
      node.height = thickness;
    });
    nodes.forEach(function (node, index) {
      // x
      var deltaX = 0;

      for (var i = index - 1; i >= 0; i--) {
        deltaX += nodes[i].width + 2 * margin;
      }

      var minX = node.minX = margin + deltaX;
      var maxX = node.maxX = node.minX + node.width;
      var minY = node.minY = options.y - thickness / 2;
      var maxY = node.maxY = minY + thickness;
      node.x = [minX, maxX, maxX, minX];
      node.y = [minY, minY, maxY, maxY];
      /* points
       * 3---2
       * |   |
       * 0---1
       */
      // node.x = minX + 0.5 * node.width;
      // node.y = options.y;
    });
  } else {
    var deltaX = 1 / len;
    nodes.forEach(function (node, index) {
      node.x = (index + 0.5) * deltaX;
      node.y = options.y;
    });
  }
}

function _locatingEdges(nodeById, edges, options) {
  if (options.weight) {
    var valueById = {};
    forIn(nodeById, function (node, id) {
      valueById[id] = node.value;
    });
    edges.forEach(function (edge) {
      var sId = options.source(edge);
      var tId = options.target(edge);
      var sNode = nodeById[sId];
      var tNode = nodeById[tId];

      if (sNode && tNode) {
        var sValue = valueById[sId];
        var currentSValue = options.sourceWeight(edge);
        var sStart = sNode.minX + (sNode.value - sValue) / sNode.value * sNode.width;
        var sEnd = sStart + currentSValue / sNode.value * sNode.width;
        valueById[sId] -= currentSValue;
        var tValue = valueById[tId];
        var currentTValue = options.targetWeight(edge);
        var tStart = tNode.minX + (tNode.value - tValue) / tNode.value * tNode.width;
        var tEnd = tStart + currentTValue / tNode.value * tNode.width;
        valueById[tId] -= currentTValue;
        var y = options.y;
        edge.x = [sStart, sEnd, tStart, tEnd];
        edge.y = [y, y, y, y];
      }
    });
  } else {
    edges.forEach(function (edge) {
      var sNode = nodeById[options.source(edge)];
      var tNode = nodeById[options.target(edge)];

      if (sNode && tNode) {
        edge.x = [sNode.x, tNode.x];
        edge.y = [sNode.y, tNode.y];
      }
    });
  }
}

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var nodeById = {};
  var nodes = dv.nodes;
  var edges = dv.edges;

  if (!isArray(nodes) || nodes.length === 0) {
    nodes = _nodesFromEdges(edges, options, nodeById);
  }

  nodes.forEach(function (node) {
    var id = options.id(node);
    nodeById[id] = node;
  });

  _processGraph(nodeById, edges, options);

  _sortNodes(nodes, options);

  _layoutNodes(nodes, options);

  _locatingEdges(nodeById, edges, options);

  dv.nodes = nodes;
  dv.edges = edges;
}

registerTransform('diagram.arc', transform);
registerTransform('arc', transform);