var getPointAtLength = require('point-at-length');

var cloneDeep = require('@antv/util/lib/clone');

var _require = require('d3-geo'),
    geoPath = _require.geoPath;

var _require2 = require('../data-set'),
    GEO = _require2.GEO,
    registerConnector = _require2.registerConnector;

var geoPathGenerator = geoPath();

function GeoJSONConnector(data, options, dataView) {
  dataView.dataType = GEO;
  var features = cloneDeep(data.features); // pre-process

  features.forEach(function (feature) {
    feature.name = feature.properties.name;
    feature.longitude = [];
    feature.latitude = [];
    var pathData = feature.pathData = geoPathGenerator(feature);
    var points = getPointAtLength(pathData);

    points._path.forEach(function (point) {
      feature.longitude.push(point[1]);
      feature.latitude.push(point[2]);
    });

    var centroid = geoPathGenerator.centroid(feature);
    feature.centroidX = centroid[0];
    feature.centroidY = centroid[1];
  }); // dataView.origin = features;

  return features;
}

registerConnector('geo', GeoJSONConnector);
registerConnector('geojson', GeoJSONConnector);
registerConnector('GeoJSON', GeoJSONConnector);
module.exports = GeoJSONConnector;