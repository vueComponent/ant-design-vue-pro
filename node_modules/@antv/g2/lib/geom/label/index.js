var GeomLabels = require('./geom-labels');

var PolarLabels = require('./polar-labels');

var PieLabels = require('./pie-labels');

var IntervalLabels = require('./interval-labels');

var Labels = {
  getLabelsClass: function getLabelsClass(coordType, type) {
    var rst = GeomLabels;

    if (coordType === 'polar') {
      rst = PolarLabels;
    } else if (coordType === 'theta') {
      // pie chart
      rst = PieLabels;
    } else if (type === 'interval' || type === 'polygon') {
      // bar
      rst = IntervalLabels;
    }

    return rst;
  }
};
module.exports = Labels;