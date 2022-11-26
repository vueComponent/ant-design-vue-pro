const isString = require('@antv/util/lib/type/is-string');
const {
  feature
} = require('topojson-client');
const GeoJSONConnector = require('./geojson');
const {
  registerConnector
} = require('../data-set');

function TopoJSONConnector(data, options, dataView) {
  const object = options.object;
  if (!isString(object)) {
    throw new TypeError('Invalid object: must be a string!');
  }
  const geoData = feature(data, data.objects[object]);
  return GeoJSONConnector(geoData, options, dataView);
}

registerConnector('topojson', TopoJSONConnector);
registerConnector('TopoJSON', TopoJSONConnector);
