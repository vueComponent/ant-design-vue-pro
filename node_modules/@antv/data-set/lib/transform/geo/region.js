var assign = require('@antv/util/lib/mix');

var isArray = require('@antv/util/lib/type/is-array');

var isString = require('@antv/util/lib/type/is-string');

var _require = require('../../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../../util/option-parser'),
    getField = _require2.getField;

var DEFAULT_OPTIONS = {
  // field: 'name', // required
  // geoView: view, // required
  // geoDataView: view, // alias
  as: ['_x', '_y']
};

function transform(view, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var field = getField(options);
  var geoView = options.geoView || options.geoDataView; // alias

  if (isString(geoView)) {
    geoView = view.dataSet.getView(geoView);
  }

  if (!geoView || geoView.dataType !== 'geo') {
    throw new TypeError('Invalid geoView: must be a DataView of GEO dataType!');
  }

  var as = options.as;

  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!');
  }

  var lonField = as[0];
  var latField = as[1];
  view.rows.forEach(function (row) {
    var feature = geoView.geoFeatureByName(row[field]);

    if (feature) {
      if (geoView._projectedAs) {
        row[lonField] = feature[geoView._projectedAs[0]];
        row[latField] = feature[geoView._projectedAs[1]];
      } else {
        row[lonField] = feature.longitude;
        row[latField] = feature.latitude;
      }
    }
  });
}

registerTransform('geo.region', transform);