var hierarchy = require('@antv/hierarchy/lib');

var _require = require('../../data-set'),
    HIERARCHY = _require.HIERARCHY,
    registerTransform = _require.registerTransform;

var DEFAULT_OPTIONS = {};

function transform(dataView, options) {
  var root = dataView.root;
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  if (dataView.dataType !== HIERARCHY) {
    throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
  }

  dataView.root = hierarchy.indented(root, options);
}

registerTransform('hierarchy.indented', transform);
registerTransform('indented-tree', transform);