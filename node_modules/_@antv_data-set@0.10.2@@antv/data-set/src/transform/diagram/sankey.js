/*
 * for Sankey Diagram
 * graph data required (nodes, edges)
 */
const assign = require('@antv/util/lib/mix');
const isString = require('@antv/util/lib/type/is-string');
const isFunction = require('@antv/util/lib/type/is-function');
const {
  sankey,
  sankeyLeft,
  sankeyRight,
  sankeyCenter,
  sankeyJustify
} = require('d3-sankey');
const {
  registerTransform
} = require('../../data-set');

const ALIGN_METHOD = {
  sankeyLeft,
  sankeyRight,
  sankeyCenter,
  sankeyJustify
};

const DEFAULT_OPTIONS = {
  // nodeId: node => node.index,
  value: node => node.value,
  source: edge => edge.source,
  target: edge => edge.target,
  nodeAlign: 'sankeyJustify',
  nodeWidth: 0.02,
  nodePadding: 0.02
};

function transform(dv, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  let nodeAlign = null;
  if (isString(options.nodeAlign)) {
    nodeAlign = ALIGN_METHOD[options.nodeAlign];
  } else if (isFunction(options.nodeAlign)) {
    nodeAlign = options.nodeAlign;
  }
  const sankeyProcessor = sankey()
    .links(d => d.edges)
    .nodeWidth(options.nodeWidth)
    .nodePadding(options.nodePadding)
    .extent([[ 0, 0 ], [ 1, 1 ]]);
  if (isFunction(options.nodeId)) {
    sankeyProcessor.nodeId(options.nodeId);
  }
  if (nodeAlign) {
    sankeyProcessor.nodeAlign(nodeAlign);
  }
  sankeyProcessor(dv);
  // post process (x, y), etc.
  dv.nodes.forEach(node => {
    const { x0, x1, y0, y1 } = node;
    /* points
     * 3---2
     * |   |
     * 0---1
     */
    node.x = [ x0, x1, x1, x0 ];
    node.y = [ y0, y0, y1, y1 ];
  });
  dv.edges.forEach(edge => {
    const {
      source,
      target
    } = edge;
    const sx = source.x1;
    const tx = target.x0;
    edge.x = [ sx, sx, tx, tx ];
    const offset = edge.width / 2;
    edge.y = [ edge.y0 + offset, edge.y0 - offset, edge.y1 + offset, edge.y1 - offset ];
  });
}

registerTransform('diagram.sankey', transform);
registerTransform('sankey', transform);
