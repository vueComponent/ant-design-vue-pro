var Util = require('../util/index');

var Shape = require('../core/shape');

var CImage = function CImage(cfg) {
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
  isHitBox: function isHitBox() {
    return false;
  },
  calculateBox: function calculateBox() {
    var attrs = this._attrs;

    if (!this._cfg.attrs || this._cfg.attrs.img !== attrs.img) {
      this._setAttrImg();
    }

    var x = attrs.x;
    var y = attrs.y;
    var width = attrs.width;
    var height = attrs.height;
    return {
      minX: x,
      minY: y,
      maxX: x + width,
      maxY: y + height
    };
  },
  _beforeSetLoading: function _beforeSetLoading(loading) {
    var canvas = this.get('canvas');

    if (loading === false && this.get('toDraw') === true) {
      this._cfg.loading = false;
      canvas.draw();
    }

    return loading;
  },
  _setAttrImg: function _setAttrImg() {
    var self = this;
    var attrs = self._attrs;
    var img = attrs.img;

    if (Util.isString(img)) {
      var image = new Image();

      image.onload = function () {
        if (self.get('destroyed')) return false;
        self.attr('imgSrc', img);
        self.attr('img', image);
        var callback = self.get('callback');

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
  drawInner: function drawInner(context) {
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
  _drawImage: function _drawImage(context) {
    var attrs = this._attrs;
    var x = attrs.x;
    var y = attrs.y;
    var image = attrs.img;
    var width = attrs.width;
    var height = attrs.height;
    var sx = attrs.sx;
    var sy = attrs.sy;
    var swidth = attrs.swidth;
    var sheight = attrs.sheight;
    this.set('toDraw', false);
    var img = image;

    if (img instanceof ImageData) {
      img = new Image();
      img.src = image;
    }

    if (img instanceof Image || img instanceof HTMLElement && Util.isString(img.nodeName) && img.nodeName.toUpperCase() === 'CANVAS') {
      if (Util.isNil(sx) || Util.isNil(sy) || Util.isNil(swidth) || Util.isNil(sheight)) {
        context.drawImage(img, x, y, width, height);
        return;
      }

      if (!Util.isNil(sx) && !Util.isNil(sy) && !Util.isNil(swidth) && !Util.isNil(sheight)) {
        context.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
        return;
      }
    }

    return;
  }
});
module.exports = CImage;