var assign = require('@antv/util/lib/mix');

var forIn = require('@antv/util/lib/each');

var isArray = require('@antv/util/lib/type/is-array');

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
var SQRT3 = Math.sqrt(3);
var THIRD_PI = Math.PI / 3;
var ANGLES = [0, THIRD_PI, 2 * THIRD_PI, 3 * THIRD_PI, 4 * THIRD_PI, 5 * THIRD_PI];

function distance(x0, y0, x1, y1) {
  return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}

function nearestBinsCenters(value, scale, offset) {
  var temp = value - offset;
  scale = scale / 2;
  var div = Math.floor(temp / scale);
  var rounded = scale * (div + (Math.abs(div % 2) === 1 ? 1 : 0));
  var roundedScaled = scale * (div + (Math.abs(div % 2) === 1 ? 0 : 1));
  return [rounded + offset, roundedScaled + offset];
}

function generateBins(points, binWidth, offset) {
  if (binWidth === void 0) {
    binWidth = [1, 1];
  }

  if (offset === void 0) {
    offset = [0, 0];
  }

  // processing aligned data
  var bins = {};
  var _binWidth = binWidth,
      binWidthX = _binWidth[0],
      binWidthY = _binWidth[1];
  var _offset = offset,
      offsetX = _offset[0],
      offsetY = _offset[1];
  points.forEach(function (point) {
    var x = point[0],
        y = point[1]; // step3.1: nearest two centers

    var _nearestBinsCenters = nearestBinsCenters(x, binWidthX, offsetX),
        xRounded = _nearestBinsCenters[0],
        xRoundedScaled = _nearestBinsCenters[1];

    var _nearestBinsCenters2 = nearestBinsCenters(y, binWidthY, offsetY),
        yRounded = _nearestBinsCenters2[0],
        yRoundedScaled = _nearestBinsCenters2[1]; // step3.2: compare distances


    var d1 = distance(x, y, xRounded, yRounded);
    var d2 = distance(x, y, xRoundedScaled, yRoundedScaled);
    var binKey;
    var binX;
    var binY;

    if (d1 < d2) {
      binKey = "x" + xRounded + "y" + yRounded;
      binX = xRounded;
      binY = yRounded;
    } else {
      binKey = "x" + xRoundedScaled + "y" + yRoundedScaled;
      binX = xRoundedScaled;
      binY = yRoundedScaled;
    }

    bins[binKey] = bins[binKey] || {
      x: binX,
      y: binY,
      count: 0
    };
    bins[binKey].count++;
  });
  return bins;
}

function transform(dataView, options) {
  // step1: get binWidth, etc.
  options = assign({}, DEFAULT_OPTIONS, options);
  var fields = getFields(options);

  if (!isArray(fields) || fields.length !== 2) {
    throw new TypeError('Invalid fields: it must be an array with 2 strings!');
  }

  var fieldX = fields[0],
      fieldY = fields[1];
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
      throw new TypeError('Invalid bins: must be an array with two positive numbers (e.g. [ 30, 30 ])!');
    }

    binWidth = [widthX / binsX, widthY / binsY];
  } // step2: align scale (squash Y)

  /*
   * binWidthX / binWidthY should be Math.sqrt3 / 1.5
   * -: binWidthX |: binWidthY
   *           3
   *           |
   *   4       |        2
   *           |
   *           |
   *   5----------------1
   *
   *           0
   */


  var _options$offset = options.offset,
      offsetX = _options$offset[0],
      offsetY = _options$offset[1];
  var yScale = 3 * binWidth[0] / (SQRT3 * binWidth[1]); // const yScale = binWidth[0] / (SQRT3 * binWidth[1]);

  var points = dataView.rows.map(function (row) {
    return [row[fieldX], yScale * row[fieldY]];
  }); // step3: binning

  var bins = generateBins(points, [binWidth[0], yScale * binWidth[1]], [offsetX, yScale * offsetY]); // step4: restore scale (for Y)

  var _options$as = options.as,
      asX = _options$as[0],
      asY = _options$as[1],
      asCount = _options$as[2];

  if (!asX || !asY || !asCount) {
    throw new TypeError('Invalid as: it must be an array with three elements (e.g. [ "x", "y", "count" ])!');
  }

  var radius = binWidth[0] / SQRT3;
  var hexagonPoints = ANGLES.map(function (angle) {
    return [Math.sin(angle) * radius, -Math.cos(angle) * radius];
  });
  var result = [];
  var maxCount = 0;

  if (options.sizeByCount) {
    forIn(bins, function (bin) {
      if (bin.count > maxCount) {
        maxCount = bin.count;
      }
    });
  }

  forIn(bins, function (bin) {
    var x = bin.x,
        y = bin.y,
        count = bin.count;
    var row = {};
    row[asCount] = count;

    if (options.sizeByCount) {
      row[asX] = hexagonPoints.map(function (p) {
        return x + bin.count / maxCount * p[0];
      });
      row[asY] = hexagonPoints.map(function (p) {
        return (y + bin.count / maxCount * p[1]) / yScale;
      });
    } else {
      row[asX] = hexagonPoints.map(function (p) {
        return x + p[0];
      });
      row[asY] = hexagonPoints.map(function (p) {
        return (y + p[1]) / yScale;
      });
    }

    result.push(row);
  });
  dataView.rows = result;
}

registerTransform('bin.hexagon', transform);
registerTransform('bin.hex', transform);
registerTransform('hexbin', transform);