var assign = require('@antv/util/lib/mix');

var cloneDeep = require('@antv/util/lib/clone');

var _require = require('d3-hexjson'),
    getGridForHexJSON = _require.getGridForHexJSON,
    renderHexJSON = _require.renderHexJSON;

var _require2 = require('../data-set'),
    HEX = _require2.HEX,
    registerConnector = _require2.registerConnector;

var DEFAULT_OPTIONS = {
  width: 1,
  height: 1
};

function processRow(row) {
  row.cx = row.x;
  row.cy = row.y;
  row.x = [];
  row.y = [];
  row.vertices.forEach(function (v) {
    row.x.push(v.x + row.cx);
    row.y.push(v.y + row.cy);
  });
  return row;
}

function HexJSONConnector(data, options, dataView) {
  dataView.dataType = HEX;
  options = assign({}, DEFAULT_OPTIONS, options);
  var _options = options,
      width = _options.width,
      height = _options.height;
  var HexJSON = cloneDeep(data);
  dataView._HexJSON = HexJSON;
  var grid = dataView._GridHexJSON = getGridForHexJSON(HexJSON);
  var rows = dataView.rows = renderHexJSON(HexJSON, width, height).map(processRow);
  dataView._gridRows = renderHexJSON(grid, width, height).map(processRow);
  return rows;
}

registerConnector('hex', HexJSONConnector);
registerConnector('hexjson', HexJSONConnector);
registerConnector('hex-json', HexJSONConnector);
registerConnector('HexJSON', HexJSONConnector);
module.exports = HexJSONConnector;