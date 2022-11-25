const assign = require('@antv/util/lib/mix');
const d3Hierarchy = require('d3-hierarchy');
const isArray = require('@antv/util/lib/type/is-array');
const {
  HIERARCHY,
  registerTransform
} = require('../../data-set');
const {
  getField
} = require('../../util/option-parser');

const DEFAULT_OPTIONS = {
  field: 'value',
  size: [ 1, 1 ], // width, height
  nodeSize: null,
  separation: null,
  as: [ 'x', 'y' ]
};

function transform(dataView, options) {
  if (dataView.dataType !== HIERARCHY) {
    throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
  }
  const root = dataView.root;
  options = assign({}, DEFAULT_OPTIONS, options);

  const as = options.as;
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!');
  }

  let field;
  try {
    field = getField(options);
  } catch (e) {
    console.warn(e);
  }
  if (field) {
    root.sum(d => d[field]);
  }

  const treeLayout = d3Hierarchy.tree();
  treeLayout
    .size(options.size);
  if (options.nodeSize) {
    treeLayout.nodeSize(options.nodeSize);
  }
  if (options.separation) {
    treeLayout.separation(options.separation);
  }
  treeLayout(root);

  const x = as[0];
  const y = as[1];
  root.each(node => {
    node[x] = node.x;
    node[y] = node.y;
  });
}

registerTransform('hierarchy.tree', transform);
registerTransform('tree', transform);
