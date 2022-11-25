var _require = require('d3-geo'),
    geoGraticule = _require.geoGraticule;

var _require2 = require('../data-set'),
    registerConnector = _require2.registerConnector;

function connector(options, dataView) {
  dataView.dataType = 'geo-graticule';
  var data = geoGraticule().lines();
  data.map(function (row, index) {
    row.index = "" + index;
    return row;
  });
  dataView.rows = data;
  return data;
}

registerConnector('geo-graticule', connector);
module.exports = connector;