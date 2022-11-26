var isString = require('@antv/util/lib/type/is-string');

var _require = require('topojson-client'),
    feature = _require.feature;

var GeoJSONConnector = require('./geojson');

var _require2 = require('../data-set'),
    registerConnector = _require2.registerConnector;

function TopoJSONConnector(data, options, dataView) {
  var object = options.object;

  if (!isString(object)) {
    throw new TypeError('Invalid object: must be a string!');
  }

  var geoData = feature(data, data.objects[object]);
  return GeoJSONConnector(geoData, options, dataView);
}

registerConnector('topojson', TopoJSONConnector);
registerConnector('TopoJSON', TopoJSONConnector);