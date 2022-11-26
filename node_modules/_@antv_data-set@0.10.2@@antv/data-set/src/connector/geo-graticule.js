const {
  geoGraticule
} = require('d3-geo');
const {
  registerConnector
} = require('../data-set');

function connector(options, dataView) {
  dataView.dataType = 'geo-graticule';
  const data = geoGraticule().lines();

  data.map((row, index) => {
    row.index = `${index}`;
    return row;
  });

  dataView.rows = data;
  return data;
}

registerConnector('geo-graticule', connector);

module.exports = connector;
