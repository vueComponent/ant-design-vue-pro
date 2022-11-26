const Util = require('../util');
const Guide = require('./base');

class DataMarker extends Guide {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();

    return Util.mix({}, cfg, {
      name: 'dataMarker',
      zIndex: 1,
      top: true,
      position: null,
      style: {
        point: {
          r: 3,
          fill: '#FFFFFF',
          stroke: '#1890FF',
          lineWidth: 2
        },
        line: {
          stroke: '#A3B1BF',
          lineWidth: 1
        },
        text: {
          fill: '#000000',
          opacity: 0.65,
          fontSize: 12,
          textAlign: 'start'
        }
      }, // end of style
      display: {
        point: true,
        line: true,
        text: true
      },
      lineLength: 20,
      direction: 'upward',
      autoAdjust: true
    });
  }

  render(coord, group) {
    const self = this;
    const point = self.parsePoint(coord, self.get('position'));
    if (!point) {
      return;
    }
    // container
    const markerGroup = group.addGroup();
    markerGroup.name = 'guide-data-marker';
    // markerGroup.translate(point.x, point.y);
    const positions = self._getElementPosition(point);
    const display = self.get('display');
    let lineShape;
    let textShape;
    // add line
    if (display.line) {
      const lineData = positions.line;
      lineShape = self._drawLine(lineData, markerGroup);
    }
    // add text
    if (display.text && self.get('content')) {
      const textPosition = positions.text;
      textShape = self._drawText(textPosition, markerGroup);
    }
    // add circle
    if (display.point) {
      const pointPoisition = positions.point;
      self._drawPoint(pointPoisition, markerGroup);
    }

    if (self.get('autoAdjust')) {
      const bbox = markerGroup.getBBox();
      const { minX, minY, maxX, maxY } = bbox;
      const { start, end } = coord;

      if (textShape) {
        if (minX <= start.x) { // 左侧超出
          textShape.attr('textAlign', 'start');
        }
        if (maxX >= end.x) { // 右侧超出
          textShape.attr('textAlign', 'end');
        }

        const direction = self.get('direction');
        if ((direction === 'upward' && minY <= end.y) || (direction !== 'upward' && maxY >= start.y)) { // 上方或者下方超出
          let textBaseline;
          let dir;
          if (direction === 'upward' && minY <= end.y) {
            textBaseline = 'top';
            dir = 1;
          } else {
            textBaseline = 'bottom';
            dir = -1;
          }

          textShape.attr('textBaseline', textBaseline);
          let lineLength = 0;
          if (self.get('display').line) {
            lineLength = self.get('lineLength');
            const linePath = [
              [ 'M', point.x, point.y ],
              [ 'L', point.x, point.y + lineLength * dir ]
            ];
            lineShape.attr('path', linePath);
          }
          const newY = point.y + (lineLength + 2) * dir;
          textShape.attr('y', newY);
        }
      }
    }

    self.get('appendInfo') && markerGroup.setSilent('appendInfo', self.get('appendInfo'));
    self.set('el', markerGroup);
  }

  _getElementPosition(position) {
    const self = this;
    const { x, y } = position;
    const lineLength = self.get('display').line ? self.get('lineLength') : 0;
    const direction = self.get('direction');
    const textStyle = self.get('style').text;
    textStyle.textBaseline = direction === 'upward' ? 'bottom' : 'top';
    const dir = direction === 'upward' ? -1 : 1;
    const pointPoisition = { x, y };
    const lineStart = { x, y };
    const lineEnd = { x, y: lineLength * dir + y };
    const textPosition = { x, y: (lineLength + 2) * dir + y };

    return {
      point: pointPoisition,
      line: [ lineStart, lineEnd ],
      text: textPosition
    };
  }

  _drawLine(lineData, g) {
    const self = this;
    const lineStyle = self.get('style').line;
    const linePath = [
      [ 'M', lineData[0].x, lineData[0].y ],
      [ 'L', lineData[1].x, lineData[1].y ]
    ];
    const lineShape = g.addShape('path', {
      attrs: Util.mix({
        path: linePath
      }, lineStyle)
    });
    return lineShape;
  }

  _drawText(position, g) {
    const self = this;
    const textStyle = this.get('style').text;
    const textShape = g.addShape('text', {
      attrs: Util.mix({
        text: self.get('content')
      }, textStyle, position)
    });
    return textShape;
  }

  _drawPoint(position, g) {
    const self = this;
    const pointStyle = self.get('style').point;
    const pointShape = g.addShape('circle', {
      attrs: Util.mix({}, pointStyle, position)
    });
    return pointShape;
  }
}

module.exports = DataMarker;
