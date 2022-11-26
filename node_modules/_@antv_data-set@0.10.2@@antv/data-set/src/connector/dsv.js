const isString = require('@antv/util/lib/type/is-string');
const {
  dsvFormat,
  csvParse,
  tsvParse
} = require('d3-dsv');
const {
  registerConnector
} = require('../data-set');

registerConnector('dsv', (str, options = {}) => {
  const delimiter = options.delimiter || ',';
  if (!isString(delimiter)) {
    throw new TypeError('Invalid delimiter: must be a string!');
  }
  return dsvFormat(delimiter).parse(str);
});

registerConnector('csv', str => {
  return csvParse(str);
});

registerConnector('tsv', str => {
  return tsvParse(str);
});
