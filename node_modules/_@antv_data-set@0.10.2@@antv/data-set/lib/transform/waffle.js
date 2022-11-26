var assign = require('@antv/util/lib/mix');

var each = require('@antv/util/lib/each');

var forIn = require('@antv/util/lib/each');

var keys = require('@antv/util/lib/object/keys');

var map = require('@antv/util/lib/map');

var pick = require('@antv/util/lib/pick');

var _require = require('simple-statistics'),
    sum = _require.sum;

var partition = require('../util/partition');

var _require2 = require('../data-set'),
    registerTransform = _require2.registerTransform;

var _require3 = require('../util/option-parser'),
    getFields = _require3.getFields;

var DEFAULT_OPTIONS = {
  fields: ['name', 'value'],
  // fields
  rows: 5,
  size: [1, 1],
  scale: 1,
  groupBy: [],
  maxCount: 1000,
  gapRatio: 0.1,
  as: ['x', 'y']
};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var fields = getFields(options);
  var nameField = fields[0],
      valueField = fields[1];
  var _options$as = options.as,
      asX = _options$as[0],
      asY = _options$as[1];
  var groupBy = options.groupBy;
  var groups = partition(dataView.rows, groupBy);
  var groupKeys = keys(groups);
  var _options$size = options.size,
      width = _options$size[0],
      height = _options$size[1];
  var maxCount = options.maxCount;
  var groupCount = groupKeys.length;
  var partHeight = height / groupCount;
  var rows = options.rows;
  var gapRatio = options.gapRatio;
  var result = [];
  var scale = options.scale;
  var currentGroupIndex = 0;
  var wStep = 0; // getting suitable scale and width step

  forIn(groups, function (group) {
    var totalValue = sum(map(group, function (row) {
      return row[valueField];
    }));
    var cols = Math.ceil(totalValue * scale / rows);

    if (totalValue * scale > maxCount) {
      scale = maxCount / totalValue;
      cols = Math.ceil(totalValue * scale / rows);
    }

    wStep = width / cols;
  }); // distributing values into grid

  forIn(groups, function (group) {
    var heightRange = [currentGroupIndex * partHeight, (currentGroupIndex + 1) * partHeight];
    var h = heightRange[1] - heightRange[0];
    var hStep = h * (1 - gapRatio) / rows;
    var currentCol = 0;
    var currentRow = 0;
    each(group, function (row) {
      var value = row[valueField];
      var count = Math.round(value * scale);

      for (var i = 0; i < count; i++) {
        if (currentRow === rows) {
          currentRow = 0;
          currentCol++;
        }

        var resultRow = pick(row, [nameField, valueField].concat(groupBy));
        resultRow[asX] = currentCol * wStep + wStep / 2;
        resultRow[asY] = currentRow * hStep + hStep / 2 + heightRange[0];
        resultRow._wStep = wStep;
        resultRow._hStep = hStep;
        currentRow++;
        result.push(resultRow);
      }
    });
    currentGroupIndex += 1;
  });
  dataView.rows = result;
}

registerTransform('waffle', transform);