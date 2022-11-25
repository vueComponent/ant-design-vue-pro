const Util = require('../util');
const Guide = require('./base');

class Image extends Guide {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      type: 'image',
      /**
       * the start of image
       * @type {Object | Function | Array}
       */
      start: null,
      /**
       * the end of image
       * @type {Object | Function | Array}
       */
      end: null,
      /**
       * image url
       * @type {String}
       */
      src: null,
      /**
       * Horizontal offset
       * @type {Number}
       */
      offsetX: null,
      /**
       * Vertical offset
       * @type {Number}
       */
      offsetY: null
    });
  }

  render(coord, group) {
    const self = this;
    const start = self.parsePoint(coord, self.get('start'));
    if (!start) {
      return;
    }
    const cfg = {
      x: start.x,
      y: start.y
    };
    cfg.img = self.get('src');

    if (!self.get('end')) { // 如果咩有指定结束点，则 start 为图片的左上角坐标
      cfg.width = self.get('width') || 32;
      cfg.height = self.get('height') || 32;
    } else {
      const end = self.parsePoint(coord, self.get('end'));
      if (!end) {
        return;
      }
      // cfg.width = Math.abs(end.x - start.x);
      // cfg.height = Math.abs(end.y - start.y);
      cfg.width = end.x - start.x;
      cfg.height = end.y - start.y;
    }

    if (self.get('offsetX')) {
      cfg.x += self.get('offsetX');
    }

    if (self.get('offsetY')) {
      cfg.y += self.get('offsetY');
    }

    const imgGuide = group.addShape('Image', {
      zIndex: 1,
      attrs: cfg
    });
    imgGuide.name = 'guide-image';
    self.get('appendInfo') && imgGuide.setSilent('appendInfo', self.get('appendInfo'));
    self.set('el', imgGuide);
  }
}

module.exports = Image;
