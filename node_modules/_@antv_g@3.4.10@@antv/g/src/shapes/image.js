const Util = require('../util/index');
const Shape = require('../core/shape');

const CImage = function(cfg) {
  CImage.superclass.constructor.call(this, cfg);
};

CImage.ATTRS = {
  x: 0,
  y: 0,
  img: undefined,
  width: 0,
  height: 0,
  sx: null,
  sy: null,
  swidth: null,
  sheight: null
};

Util.extend(CImage, Shape);

Util.augment(CImage, {
  type: 'image',
  isHitBox() {
    return false;
  },
  calculateBox() {
    const attrs = this._attrs;

    if (!this._cfg.attrs || this._cfg.attrs.img !== attrs.img) {
      this._setAttrImg();
    }
    const x = attrs.x;
    const y = attrs.y;
    const width = attrs.width;
    const height = attrs.height;

    return {
      minX: x,
      minY: y,
      maxX: x + width,
      maxY: y + height
    };
  },
  _beforeSetLoading(loading) {
    const canvas = this.get('canvas');
    if (loading === false && this.get('toDraw') === true) {
      this._cfg.loading = false;
      canvas.draw();
    }
    return loading;
  },
  _setAttrImg() {
    const self = this;
    const attrs = self._attrs;
    const img = attrs.img;
    if (Util.isString(img)) {
      const image = new Image();
      image.onload = function() {
        if (self.get('destroyed')) return false;
        self.attr('imgSrc', img);
        self.attr('img', image);
        const callback = self.get('callback');
        if (callback) {
          callback.call(self);
        }
        self.set('loading', false);
      };
      image.src = img;
      image.crossOrigin = 'Anonymous';
      self.set('loading', true);
    } else if (img instanceof Image) {
      if (!attrs.width) {
        self.attr('width', img.width);
      }

      if (!attrs.height) {
        self.attr('height', img.height);
      }
      return img;
    } else if (img instanceof HTMLElement && Util.isString(img.nodeName) && img.nodeName.toUpperCase() === 'CANVAS') {
      if (!attrs.width) {
        self.attr('width', Number(img.getAttribute('width')));
      }

      if (!attrs.height) {
        self.attr('height', Number(img.getAttribute('height')));
      }
      return img;
    } else if (img instanceof ImageData) {
      if (!attrs.width) {
        self.attr('width', img.width);
      }

      if (!attrs.height) {
        self.attr('height', img.height);
      }
      return img;
    } else {
      return null;
    }
  },
  drawInner(context) {
    if (this._cfg.hasUpdate) {
      this._setAttrImg();
    }
    if (this.get('loading')) {
      this.set('toDraw', true);
      return;
    }
    this._drawImage(context);
    this._cfg.hasUpdate = false;
  },
  _drawImage(context) {
    const attrs = this._attrs;
    const x = attrs.x;
    const y = attrs.y;
    const image = attrs.img;
    const width = attrs.width;
    const height = attrs.height;
    const sx = attrs.sx;
    const sy = attrs.sy;
    const swidth = attrs.swidth;
    const sheight = attrs.sheight;
    this.set('toDraw', false);

    let img = image;
    if (img instanceof ImageData) {
      img = new Image();
      img.src = image;
    }
    if (img instanceof Image || (img instanceof HTMLElement && Util.isString(img.nodeName) && img.nodeName.toUpperCase() === 'CANVAS')) {
      if (
        Util.isNil(sx) ||
        Util.isNil(sy) ||
        Util.isNil(swidth) ||
        Util.isNil(sheight)
      ) {
        context.drawImage(img, x, y, width, height);
        return;
      }
      if (
        !Util.isNil(sx) &&
        !Util.isNil(sy) &&
        !Util.isNil(swidth) &&
        !Util.isNil(sheight)
      ) {
        context.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
        return;
      }
    }
    return;
  }
});

module.exports = CImage;
