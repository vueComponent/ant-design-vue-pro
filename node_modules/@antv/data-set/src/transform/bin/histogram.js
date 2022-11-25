const assign = require('@antv/util/lib/mix');
const forIn = require('@antv/util/lib/each');
const pick = require('@antv/util/lib/pick');
const partition = require('../../util/partition');
const {
  registerTransform
} = require('../../data-set');
const {
  getField
} = require('../../util/option-parser');

const DEFAULT_OPTIONS = {
  as: [ 'x', 'count' ],
  bins: 30,
  offset: 0,
  groupBy: []
  // field: '', // required
  // binWidth: 10, // override bins
};

function nearestBin(value, scale, offset) {
  const temp = value - offset;
  const div = Math.floor(temp / scale);
  return [ div * scale + offset, (div + 1) * scale + offset ];
}

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  const field = getField(options);
  if (dataView.rows.length === 0) {
    return;
  }
  const range = dataView.range(field);
  const width = range[1] - range[0];
  let binWidth = options.binWidth;
  if (!binWidth) {
    const bins = options.bins;
    if (bins <= 0) {
      throw new TypeError('Invalid bins: it must be a positive number!');
    }
    binWidth = width / bins;
  }
  const offset = options.offset % binWidth;

  // grouping
  const rows = [];
  const groupBy = options.groupBy;
  const groups = partition(dataView.rows, groupBy);
  forIn(groups, group => {
    const bins = {};
    const column = group.map(row => row[field]);
    column.forEach(value => {
      const [ x0, x1 ] = nearestBin(value, binWidth, offset);
      const binKey = `${x0}-${x1}`;
      bins[binKey] = bins[binKey] || {
        x0,
        x1,
        count: 0
      };
      bins[binKey].count ++;
    });
    const [ asX, asCount ] = options.as;
    if (!asX || !asCount) {
      throw new TypeError('Invalid as: it must be an array with 2 elements (e.g. [ "x", "count" ])!');
    }

    const meta = pick(group[0], groupBy);
    forIn(bins, bin => {
      const row = assign({}, meta);
      row[asX] = [ bin.x0, bin.x1 ];
      row[asCount] = bin.count;
      rows.push(row);
    });
  });
  dataView.rows = rows;
}

registerTransform('bin.histogram', transform);
registerTransform('bin.dot', transform);
