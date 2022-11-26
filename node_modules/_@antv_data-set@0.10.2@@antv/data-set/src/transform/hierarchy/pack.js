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
  padding: 0,
  as: [ 'x', 'y', 'r' ]
};

function transform(dataView, options) {
  if (dataView.dataType !== HIERARCHY) {
    throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
  }
  const root = dataView.root;
  options = assign({}, DEFAULT_OPTIONS, options);

  const as = options.as;
  if (!isArray(as) || as.length !== 3) {
    throw new TypeError('Invalid as: it must be an array with 3 strings (e.g. [ "x", "y", "r" ])!');
  }

  let field;
  try {
    field = getField(options);
  } catch (e) {
    console.warn(e);
  }
  if (field) {
    root.sum(d => d[field])
      .sort((a, b) => b[field] - a[field]);
  }

  const packLayout = d3Hierarchy.pack();
  packLayout.size(options.size);

  if (options.padding) {
    packLayout.padding(options.padding);
  }
  packLayout(root);

  const x = as[0];
  const y = as[1];
  const r = as[2];
  root.each(node => {
    node[x] = node.x;
    node[y] = node.y;
    node[r] = node.r;
  });
}

registerTransform('hierarchy.pack', transform);
registerTransform('hierarchy.circle-packing', transform);
registerTransform('circle-packing', transform);
