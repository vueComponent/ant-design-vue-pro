module.exports = function (chart) {
  var scaleController = chart.get('scaleController') || {};
  return scaleController.defs;
};