var assign = require('@antv/util/lib/mix');

var d3Geo = require('d3-geo');

var getPointAtLength = require('point-at-length');

var isArray = require('@antv/util/lib/type/is-array');

var _require = require('../../data-set'),
    registerTransform = _require.registerTransform;

var getGeoProjection = require('../../util/get-geo-projection');

var geoPath = d3Geo.geoPath;
var DEFAULT_OPTIONS = {
  // projection: '', // default to null
  as: ['_x', '_y', '_centroid_x', '_centroid_y']
};

function transform(dataView, options) {
  if (dataView.dataType !== 'geo' && dataView.dataType !== 'geo-graticule') {
    throw new TypeError('Invalid dataView: this transform is for Geo data only!');
  }

  options = assign({}, DEFAULT_OPTIONS, options);
  var projection = options.projection;

  if (!projection) {
    throw new TypeError('Invalid projection!');
  }

  projection = getGeoProjection(projection);
  var geoPathGenerator = geoPath(projection);
  var as = options.as;

  if (!isArray(as) || as.length !== 4) {
    throw new TypeError('Invalid as: it must be an array with 4 strings (e.g. [ "x", "y", "cX", "cY" ])!');
  }

  dataView._projectedAs = as;
  var lonField = as[0],
      latField = as[1],
      centroidX = as[2],
      centroidY = as[3];
  dataView.rows.forEach(function (row) {
    row[lonField] = [];
    row[latField] = [];
    var pathData = geoPathGenerator(row);

    if (pathData) {
      // TODO projection returns null
      var points = getPointAtLength(pathData);

      points._path.forEach(function (point) {
        row[lonField].push(point[1]);
        row[latField].push(point[2]);
      });

      var centroid = geoPathGenerator.centroid(row);
      row[centroidX] = centroid[0];
      row[centroidY] = centroid[1];
    }
  });
  dataView.rows = dataView.rows.filter(function (row) {
    return row[lonField].length !== 0;
  });
}

registerTransform('geo.projection', transform);