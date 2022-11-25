var assign = require('@antv/util/lib/mix');

var flattenDeep = require('@antv/util/lib/array/flatten-deep');

var isArray = require('@antv/util/lib/type/is-array');

var simpleStatistics = require('simple-statistics');

var View = require('../view');

var pByFraction = require('../util/p-by-fraction');

var _require = require('../constants'),
    STATISTICS_METHODS = _require.STATISTICS_METHODS;

function getColumnValues(me, column) {
  var values = me.getColumn(column);

  if (isArray(values) && isArray(values[0])) {
    values = flattenDeep(values);
  }

  return values;
} // statistics


STATISTICS_METHODS.forEach(function (method) {
  View.prototype[method] = function (column) {
    return simpleStatistics[method](getColumnValues(this, column));
  };
});
var _quantile = simpleStatistics.quantile;
assign(View.prototype, {
  average: View.prototype.mean,
  quantile: function quantile(column, p) {
    return _quantile(getColumnValues(this, column), p);
  },
  quantiles: function quantiles(column, pArr) {
    var columnArr = getColumnValues(this, column);
    return pArr.map(function (p) {
      return _quantile(columnArr, p);
    });
  },
  quantilesByFraction: function quantilesByFraction(column, fraction) {
    return this.quantiles(column, pByFraction(fraction));
  },
  range: function range(column) {
    var me = this;
    return [me.min(column), me.max(column)];
  },
  extent: function extent(column) {
    // alias
    return this.range(column);
  }
});