const assign = require('@antv/util/lib/mix');
const cloneDeep = require('@antv/util/lib/clone');
const {
  getGridForHexJSON,
  renderHexJSON
} = require('d3-hexjson');
const {
  HEX,
  registerConnector
} = require('../data-set');

const DEFAULT_OPTIONS = {
  width: 1,
  height: 1
};

function processRow(row) {
  row.cx = row.x;
  row.cy = row.y;
  row.x = [];
  row.y = [];
  row.vertices.forEach(v => {
    row.x.push(v.x + row.cx);
    row.y.push(v.y + row.cy);
  });
  return row;
}

function HexJSONConnector(data, options, dataView) {
  dataView.dataType = HEX;
  options = assign({}, DEFAULT_OPTIONS, options);
  const { width, height } = options;
  const HexJSON = cloneDeep(data);
  dataView._HexJSON = HexJSON;
  const grid = dataView._GridHexJSON = getGridForHexJSON(HexJSON);
  const rows = dataView.rows = renderHexJSON(HexJSON, width, height).map(processRow);
  dataView._gridRows = renderHexJSON(grid, width, height).map(processRow);
  return rows;
}

registerConnector('hex', HexJSONConnector);
registerConnector('hexjson', HexJSONConnector);
registerConnector('hex-json', HexJSONConnector);
registerConnector('HexJSON', HexJSONConnector);

module.exports = HexJSONConnector;
