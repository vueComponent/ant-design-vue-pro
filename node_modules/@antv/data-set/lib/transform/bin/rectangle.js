var assign = require('@antv/util/lib/mix');

var forIn = require('@antv/util/lib/each');

var _require = require('../../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../../util/option-parser'),
    getFields = _require2.getFields;

var DEFAULT_OPTIONS = {
  as: ['x', 'y', 'count'],
  bins: [30, 30],
  // Numeric vector giving number of bins in both horizontal and vertical directions
  offset: [0, 0],
  sizeByCount: false // calculate bin size by binning count
  // fields: ['field0', 'field1'], // required
  // binWidth: [ 30, 30 ], // Numeric vector giving bin width in both horizontal and vertical directions. Overrides bins if both set.

};

function nearestBin(value, scale, offset) {
  var temp = value - offset;
  var div = Math.floor(temp / scale);
  return [div * scale + offset, (div + 1) * scale + offset];
}

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);

  var _getFields = getFields(options),
      fieldX = _getFields[0],
      fieldY = _getFields[1];

  if (!fieldX || !fieldY) {
    throw new TypeError('Invalid fields: must be an array with 2 strings!');
  }

  var rangeFieldX = dataView.range(fieldX);
  var rangeFieldY = dataView.range(fieldY);
  var widthX = rangeFieldX[1] - rangeFieldX[0];
  var widthY = rangeFieldY[1] - rangeFieldY[0];
  var binWidth = options.binWidth || [];

  if (binWidth.length !== 2) {
    var _options$bins = options.bins,
        binsX = _options$bins[0],
        binsY = _options$bins[1];

    if (binsX <= 0 || binsY <= 0) {
      throw new TypeError('Invalid bins: must be an array with 2 positive numbers (e.g. [ 30, 30 ])!');
    }

    binWidth = [widthX / binsX, widthY / binsY];
  }

  var points = dataView.rows.map(function (row) {
    return [row[fieldX], row[fieldY]];
  });
  var bins = {};
  var _options$offset = options.offset,
      offsetX = _options$offset[0],
      offsetY = _options$offset[1];
  points.forEach(function (point) {
    var _nearestBin = nearestBin(point[0], binWidth[0], offsetX),
        x0 = _nearestBin[0],
        x1 = _nearestBin[1];

    var _nearestBin2 = nearestBin(point[1], binWidth[1], offsetY),
        y0 = _nearestBin2[0],
        y1 = _nearestBin2[1];

    var binKey = x0 + "-" + x1 + "-" + y0 + "-" + y1;
    bins[binKey] = bins[binKey] || {
      x0: x0,
      x1: x1,
      y0: y0,
      y1: y1,
      count: 0
    };
    bins[binKey].count++;
  });
  var rows = [];
  var _options$as = options.as,
      asX = _options$as[0],
      asY = _options$as[1],
      asCount = _options$as[2];

  if (!asX || !asY || !asCount) {
    throw new TypeError('Invalid as: it must be an array with 3 strings (e.g. [ "x", "y", "count" ])!');
  }
  /* points
   * 3---2
   * |   |
   * 0---1
   */


  if (!options.sizeByCount) {
    forIn(bins, function (bin) {
      var row = {};
      row[asX] = [bin.x0, bin.x1, bin.x1, bin.x0];
      row[asY] = [bin.y0, bin.y0, bin.y1, bin.y1];
      row[asCount] = bin.count;
      rows.push(row);
    });
  } else {
    var maxCount = 0;
    forIn(bins, function (bin) {
      if (bin.count > maxCount) {
        maxCount = bin.count;
      }
    });
    forIn(bins, function (bin) {
      var x0 = bin.x0,
          x1 = bin.x1,
          y0 = bin.y0,
          y1 = bin.y1,
          count = bin.count;
      var scale = count / maxCount;
      var cx = (x0 + x1) / 2,
          cy = (y0 + y1) / 2;
      var rx = (x1 - x0) * scale / 2;
      var ry = (y1 - y0) * scale / 2;
      var x01 = cx - rx;
      var x11 = cx + rx;
      var y01 = cy - ry;
      var y11 = cy + ry;
      var row = {};
      row[asX] = [x01, x11, x11, x01];
      row[asY] = [y01, y01, y11, y11];
      row[asCount] = count;
      rows.push(row);
    });
  }

  dataView.rows = rows;
}

registerTransform('bin.rectangle', transform);
registerTransform('bin.rect', transform);