const assign = require('@antv/util/lib/mix');
const isArray = require('@antv/util/lib/type/is-array');
const isString = require('@antv/util/lib/type/is-string');
const {
  registerTransform
} = require('../../data-set');
const {
  getField
} = require('../../util/option-parser');

const DEFAULT_OPTIONS = {
  // field: 'name', // required
  // geoView: view, // required
  // geoDataView: view, // alias
  as: [ '_x', '_y' ]
};

function transform(view, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = getField(options);
  let geoView = options.geoView || options.geoDataView; // alias
  if (isString(geoView)) {
    geoView = view.dataSet.getView(geoView);
  }
  if (!geoView || geoView.dataType !== 'geo') {
    throw new TypeError('Invalid geoView: must be a DataView of GEO dataType!');
  }
  const as = options.as;
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!');
  }
  const lonField = as[0];
  const latField = as[1];
  view.rows.forEach(row => {
    const feature = geoView.geoFeatureByName(row[field]);
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
