var assign = require('@antv/util/lib/mix');

var forIn = require('@antv/util/lib/each');

var isArray = require('@antv/util/lib/type/is-array');

var isString = require('@antv/util/lib/type/is-string');

var _require = require('simple-statistics'),
    quantile = _require.quantile;

var partition = require('../../util/partition');

var pByFraction = require('../../util/p-by-fraction');

var _require2 = require('../../data-set'),
    registerTransform = _require2.registerTransform;

var _require3 = require('../../util/option-parser'),
    getField = _require3.getField;

var DEFAULT_OPTIONS = {
  as: '_bin',
  groupBy: [],
  // optional
  fraction: 4 // default
  // p: [0.5, 0.3], // array of p parameter
  // field: 'y', // required

};

function transform(dataView, options) {
  options = assign({}, DEFAULT_OPTIONS, options);
  var field = getField(options);
  var as = options.as;

  if (!isString(as)) {
    throw new TypeError('Invalid as: it must be a string (e.g. "_bin")!');
  }

  var pArray = options.p;
  var fraction = options.fraction;

  if (!isArray(pArray) || pArray.length === 0) {
    pArray = pByFraction(fraction);
  }

  var rows = dataView.rows;
  var groupBy = options.groupBy;
  var groups = partition(rows, groupBy);
  var result = [];
  forIn(groups, function (group) {
    // const resultRow = pick(group[0], groupBy);
    var resultRow = group[0];
    var binningColumn = group.map(function (row) {
      return row[field];
    });
    var quantiles = pArray.map(function (p) {
      return quantile(binningColumn, p);
    });
    resultRow[as] = quantiles;
    result.push(resultRow);
  });
  dataView.rows = result;
}

registerTransform('bin.quantile', transform);