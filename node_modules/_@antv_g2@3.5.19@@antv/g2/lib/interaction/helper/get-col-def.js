var getColDefs = require('./get-col-defs');

module.exports = function (chart, field) {
  var colDefs = getColDefs(chart);

  if (colDefs && colDefs[field]) {
    return colDefs[field];
  }
};