var isString = require('@antv/util/lib/type/is-string');

var _require = require('d3-dsv'),
    dsvFormat = _require.dsvFormat,
    csvParse = _require.csvParse,
    tsvParse = _require.tsvParse;

var _require2 = require('../data-set'),
    registerConnector = _require2.registerConnector;

registerConnector('dsv', function (str, options) {
  if (options === void 0) {
    options = {};
  }

  var delimiter = options.delimiter || ',';

  if (!isString(delimiter)) {
    throw new TypeError('Invalid delimiter: must be a string!');
  }

  return dsvFormat(delimiter).parse(str);
});
registerConnector('csv', function (str) {
  return csvParse(str);
});
registerConnector('tsv', function (str) {
  return tsvParse(str);
});