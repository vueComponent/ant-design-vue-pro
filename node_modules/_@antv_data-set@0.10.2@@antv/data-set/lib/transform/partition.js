var assign = require('@antv/util/lib/mix');

var values = require('@antv/util/lib/object/values');

var partition = require('../util/partition');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var DEFAULT_OPTIONS = {
  groupBy: [],
  // optional
  orderBy: []
};
registerTransform('partition', function (dataView, options) {
  if (options === void 0) {
    options = {};
  }

  options = assign({}, DEFAULT_OPTIONS, options);
  dataView.rows = partition(dataView.rows, options.groupBy, options.orderBy);
});

function group(dataView, options) {
  if (options === void 0) {
    options = {};
  }

  options = assign({}, DEFAULT_OPTIONS, options);
  dataView.rows = values(partition(dataView.rows, options.groupBy, options.orderBy));
}

registerTransform('group', group);
registerTransform('groups', group);