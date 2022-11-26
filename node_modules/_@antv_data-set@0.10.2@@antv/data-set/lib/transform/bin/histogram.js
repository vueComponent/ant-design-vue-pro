var assign = require('@antv/util/lib/mix');

var forIn = require('@antv/util/lib/each');

var pick = require('@antv/util/lib/pick');

var partition = require('../../util/partition');

var _require = require('../../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../../util/option-parser'),
    getField = _require2.getField;

var DEFAULT_OPTIONS = {
  as: ['x', 'count'],
  bins: 30,
  offset: 0,
  groupBy: [] // field: '', // required
  // binWidth: 10, // override bins

};

function nearestBin(value, scale, offset) {
  var temp = value - offset;
  var div = Math.floor(temp / scale);
  return [div * scale + offset, (div + 1) * scale + offset];
}

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var field = getField(options);

  if (dataView.rows.length === 0) {
    return;
  }

  var range = dataView.range(field);
  var width = range[1] - range[0];
  var binWidth = options.binWidth;

  if (!binWidth) {
    var bins = options.bins;

    if (bins <= 0) {
      throw new TypeError('Invalid bins: it must be a positive number!');
    }

    binWidth = width / bins;
  }

  var offset = options.offset % binWidth; // grouping

  var rows = [];
  var groupBy = options.groupBy;
  var groups = partition(dataView.rows, groupBy);
  forIn(groups, function (group) {
    var bins = {};
    var column = group.map(function (row) {
      return row[field];
    });
    column.forEach(function (value) {
      var _nearestBin = nearestBin(value, binWidth, offset),
          x0 = _nearestBin[0],
          x1 = _nearestBin[1];

      var binKey = x0 + "-" + x1;
      bins[binKey] = bins[binKey] || {
        x0: x0,
        x1: x1,
        count: 0
      };
      bins[binKey].count++;
    });
    var _options$as = options.as,
        asX = _options$as[0],
        asCount = _options$as[1];

    if (!asX || !asCount) {
      throw new TypeError('Invalid as: it must be an array with 2 elements (e.g. [ "x", "count" ])!');
    }

    var meta = pick(group[0], groupBy);
    forIn(bins, function (bin) {
      var row = assign({}, meta);
      row[asX] = [bin.x0, bin.x1];
      row[asCount] = bin.count;
      rows.push(row);
    });
  });
  dataView.rows = rows;
}

registerTransform('bin.histogram', transform);
registerTransform('bin.dot', transform);