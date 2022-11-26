const Util = require('../util');
const Guide = require('./base');

class Text extends Guide {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * 辅助元素类型
       * @type {String}
       */
      name: 'text',
      /**
       * 辅助文本的位置
       * @type {Object | Function | Array}
       */
      position: null,
      /**
       * 辅助文本的显示文字
       * @type {String}
       */
      content: null,
      /**
       * 辅助文本的样式配置
       * @type {Object}
       */
      style: {
        fill: '#999',
        fontSize: 12,
        fontWeight: 500,
        textAlign: 'center'
      },
      /**
       * x 方向的偏移量
       * @type {Number}
       */
      offsetX: null,
      /**
       * y 方向的偏移量
       * @type {Number}
       */
      offsetY: null,
      top: true
    });
  }

  render(coord, group) {
    const self = this;
    const point = self.parsePoint(coord, self.get('position'));
    if (!point) {
      return;
    }
    const textStyle = Util.mix({}, self.get('style'));
    const offsetX = self.get('offsetX');
    const offsetY = self.get('offsetY');
    if (offsetX) {
      point.x += offsetX;
    }

    if (offsetY) {
      point.y += offsetY;
    }

    if (textStyle.rotate) {
      textStyle.rotate = (textStyle.rotate * Math.PI) / 180; // 将角度转换为弧度
    }

    const guideText = group.addShape('Text', {
      zIndex: self.get('zIndex'),
      attrs: Util.mix({
        text: self.get('content')
      }, textStyle, point)
    });
    guideText.name = 'guide-text';
    self.get('appendInfo') && guideText.setSilent('appendInfo', self.get('appendInfo'));
    self.set('el', guideText);
  }
}

module.exports = Text;
