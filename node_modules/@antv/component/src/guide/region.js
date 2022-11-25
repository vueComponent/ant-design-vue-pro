const Util = require('../util');
const Guide = require('./base');

class Region extends Guide {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();

    return Util.mix({}, cfg, {
      name: 'region',
      zIndex: 1,
      start: null,
      end: null,
      style: {
        lineWidth: 0,
        fill: '#CCD7EB',
        opacity: 0.4
      }
    });
  }

  render(coord, group) {
    const self = this;
    const rectStyle = self.get('style');
    const path = self._getPath(coord);
    if (!path.length) { // path 为空时不绘制
      return;
    }
    const regionGroup = group.addShape('path', {
      zIndex: self.get('zIndex'),
      attrs: Util.mix({
        path
      }, rectStyle)
    });
    regionGroup.name = 'guide-region';
    self.get('appendInfo') && regionGroup.setSilent('appendInfo', self.get('appendInfo'));
    self.set('el', regionGroup);
  }

  _getPath(coord) {
    const self = this;
    const start = self.parsePoint(coord, self.get('start'));
    const end = self.parsePoint(coord, self.get('end'));
    if (!start || !end) {
      return [];
    }
    const path = [
      [ 'M', start.x, start.y ],
      [ 'L', end.x, start.y ],
      [ 'L', end.x, end.y ],
      [ 'L', start.x, end.y ],
      [ 'z' ]
    ];

    return path;
  }
}

module.exports = Region;
