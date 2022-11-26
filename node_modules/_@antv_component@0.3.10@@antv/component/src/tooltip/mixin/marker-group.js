const Util = require('../../util');

const MarkerGroupMixin = {
  setMarkers(markerItems, markerCfg) {
    const self = this;
    let markerGroup = self.get('markerGroup');
    const frontPlot = self.get('frontPlot');
    if (!markerGroup) {
      markerGroup = frontPlot.addGroup({
        zIndex: 1,
        capture: false // 不进行拾取
      });
      self.set('markerGroup', markerGroup);
    } else {
      markerGroup.clear();
    }
    Util.each(markerItems, item => {
      const attrs = Util.mix({
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
        attrs
      });
    });
    this.set('markerItems', markerItems);
  },

  clearMarkers() {
    const markerGroup = this.get('markerGroup');
    markerGroup && markerGroup.clear();
  }

};
module.exports = MarkerGroupMixin;

