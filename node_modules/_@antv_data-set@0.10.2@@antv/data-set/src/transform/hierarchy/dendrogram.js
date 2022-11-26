const hierarchy = require('@antv/hierarchy/lib');
const {
  HIERARCHY,
  registerTransform
} = require('../../data-set');

const DEFAULT_OPTIONS = {
};

function transform(dataView, options) {
  const root = dataView.root;
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  if (dataView.dataType !== HIERARCHY) {
    throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
  }

  dataView.root = hierarchy.dendrogram(root, options);
}

registerTransform('hierarchy.dendrogram', transform);
registerTransform('dendrogram', transform);
