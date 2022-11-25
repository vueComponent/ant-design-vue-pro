const Util = require('../util');
const Helper = require('./util/helper');
const Guide = require('./base');

class DataRegion extends Guide {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      name: 'dataRegion',
      start: null, // 只支持数值
      end: null, // 只支持数值
      content: '', // 文本内容
      style: {
        region: {
          lineWidth: 0,
          fill: '#000000',
          opacity: 0.04
        },
        text: {
          textAlign: 'center',
          textBaseline: 'bottom',
          fontSize: 12,
          fill: 'rgba(0, 0, 0, .65)'
        }
      }
    });
  }

  render(coord, group, data) {
    const self = this;
    // draw region
    const lineLength = self.get('lineLength') || 0; // TODO: 如何命名
    const regionData = self._getRegionData(coord, data);

    if (!regionData.length) return;

    const regionBBox = self._getBBox(regionData);

    const path = [];
    path.push([ 'M', regionData[0].x, regionBBox.yMin - lineLength ]);
    for (let i = 0, len = regionData.length; i < len; i++) {
      const p = [ 'L', regionData[i].x, regionData[i].y ];
      path.push(p);
    }
    path.push([ 'L', regionData[regionData.length - 1].x, regionBBox.yMin - lineLength ]);
    // draw
    const style = self.get('style');
    const regionStyle = style.region; // 兼容之前的写法
    const textStyle = style.text;

    const regionGroup = group.addGroup();
    regionGroup.name = 'guide-data-region';

    regionGroup.addShape('path', {
      attrs: Util.mix({
        path
      }, regionStyle)
    });

    const content = self.get('content');
    if (content) {
      regionGroup.addShape('Text', {
        attrs: Util.mix({
          x: (regionBBox.xMin + regionBBox.xMax) / 2,
          y: regionBBox.yMin - lineLength,
          text: content
        }, textStyle)
      });
    }

    self.get('appendInfo') && regionGroup.setSilent('appendInfo', self.get('appendInfo'));
    self.set('el', regionGroup);
  }

  _getRegionData(coord, data) {
    const self = this;
    const start = self.get('start');
    const end = self.get('end');
    const xField = Helper.getFirstScale(self.get('xScales')).field;
    const yField = Helper.getFirstScale(self.get('yScales')).field;
    const startXValue = Util.isArray(start) ? start[0] : start[xField];
    const endXValue = Util.isArray(end) ? end[0] : end[xField];
    let startIndex;
    const arr = [];
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      if (item[xField] === startXValue) {
        startIndex = i;
      }

      if (i >= startIndex) {
        const point = self.parsePoint(coord, [ item[xField], item[yField] ]);
        // 判断是否是有效点
        point && arr.push(point);
      }

      if (item[xField] === endXValue) {
        break;
      }
    }
    return arr;
  }

  _getBBox(data) {
    const xs = [];
    const ys = [];
    for (let i = 0; i < data.length; i++) {
      xs.push(data[i].x);
      ys.push(data[i].y);
    }
    const xRange = Util.arrayUtil.getRange(xs);
    const yRange = Util.arrayUtil.getRange(ys);

    return {
      xMin: xRange.min,
      xMax: xRange.max,
      yMin: yRange.min,
      yMax: yRange.max
    };
  }
}

module.exports = DataRegion;
