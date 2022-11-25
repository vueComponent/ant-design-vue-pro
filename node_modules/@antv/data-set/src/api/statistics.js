const assign = require('@antv/util/lib/mix');
const flattenDeep = require('@antv/util/lib/array/flatten-deep');
const isArray = require('@antv/util/lib/type/is-array');
const simpleStatistics = require('simple-statistics');
const View = require('../view');
const pByFraction = require('../util/p-by-fraction');
const {
  STATISTICS_METHODS
} = require('../constants');

function getColumnValues(me, column) {
  let values = me.getColumn(column);
  if (isArray(values) && isArray(values[0])) {
    values = flattenDeep(values);
  }
  return values;
}

// statistics
STATISTICS_METHODS.forEach(method => {
  View.prototype[method] = function(column) {
    return simpleStatistics[method](getColumnValues(this, column));
  };
});

const {
  quantile
} = simpleStatistics;

assign(View.prototype, {
  average: View.prototype.mean,
  quantile(column, p) {
    return quantile(getColumnValues(this, column), p);
  },
  quantiles(column, pArr) {
    const columnArr = getColumnValues(this, column);
    return pArr.map(p => quantile(columnArr, p));
  },
  quantilesByFraction(column, fraction) {
    return this.quantiles(column, pByFraction(fraction));
  },
  range(column) {
    const me = this;
    return [ me.min(column), me.max(column) ];
  },
  extent(column) { // alias
    return this.range(column);
  }
});
