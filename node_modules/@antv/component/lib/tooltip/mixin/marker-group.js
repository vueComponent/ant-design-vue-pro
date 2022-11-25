var Util = require('../../util');

var MarkerGroupMixin = {
  setMarkers: function setMarkers(markerItems, markerCfg) {
    var self = this;
    var markerGroup = self.get('markerGroup');
    var frontPlot = self.get('frontPlot');

    if (!markerGroup) {
      markerGroup = frontPlot.addGroup({
        zIndex: 1,
        capture: false // 不进行拾取

      });
      self.set('markerGroup', markerGroup);
    } else {
      markerGroup.clear();
    }

    Util.each(markerItems, function (item) {
      var attrs = Util.mix({
        fill: item.color,
        symbol: 'circle',
        shadowColor: item.color
      }, markerCfg, {
        x: item.x,
        y: item.y
      });

      if (item.marker && item.marker.activeSymbol) {
        attrs.symbol = item.marker.activeSymbol;
      }

      markerGroup.addShape('marker', {
        color: item.color,
        attrs: attrs
      });
    });
    this.set('markerItems', markerItems);
  },
  clearMarkers: function clearMarkers() {
    var markerGroup = this.get('markerGroup');
    markerGroup && markerGroup.clear();
  }
};
module.exports = MarkerGroupMixin;