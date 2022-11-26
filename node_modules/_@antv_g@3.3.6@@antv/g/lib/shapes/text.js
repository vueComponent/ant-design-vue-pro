var Util = require('../util/index');

var Shape = require('../core/shape');

var CText = function CText(cfg) {
  CText.superclass.constructor.call(this, cfg);
};

CText.ATTRS = {
  x: 0,
  y: 0,
  text: null,
  fontSize: 12,
  fontFamily: 'sans-serif',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontVariant: 'normal',
  textAlign: 'start',
  textBaseline: 'bottom',
  lineHeight: null,
  textArr: null
};
Util.extend(CText, Shape);
Util.augment(CText, {
  canFill: true,
  canStroke: true,
  type: 'text',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1,
      lineCount: 1,
      fontSize: 12,
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontVariant: 'normal',
      textAlign: 'start',
      textBaseline: 'bottom'
    };
  },
  initTransform: function initTransform() {
    var fontSize = this._attrs.fontSize;

    if (fontSize && +fontSize < 12) {
      // 小于 12 像素的文本进行 scale 处理
      this.transform([['t', -1 * this._attrs.x, -1 * this._attrs.y], ['s', +fontSize / 12, +fontSize / 12], ['t', this._attrs.x, this._attrs.y]]);
    }
  },
  _assembleFont: function _assembleFont() {
    // var self = this;
    var attrs = this._attrs;
    var fontSize = attrs.fontSize;
    var fontFamily = attrs.fontFamily;
    var fontWeight = attrs.fontWeight;
    var fontStyle = attrs.fontStyle; // self.attr('fontStyle');

    var fontVariant = attrs.fontVariant; // self.attr('fontVariant');
    // self.attr('font', [fontStyle, fontVariant, fontWeight, fontSize + 'px', fontFamily].join(' '));

    attrs.font = [fontStyle, fontVariant, fontWeight, fontSize + 'px', fontFamily].join(' ');
  },
  _setAttrText: function _setAttrText() {
    var attrs = this._attrs;
    var text = attrs.text;
    var textArr = null;

    if (Util.isString(text) && text.indexOf('\n') !== -1) {
      textArr = text.split('\n');
      var lineCount = textArr.length;
      attrs.lineCount = lineCount;
    }

    attrs.textArr = textArr;
  },
  _getTextHeight: function _getTextHeight() {
    var attrs = this._attrs;
    var lineCount = attrs.lineCount;
    var fontSize = attrs.fontSize * 1;

    if (lineCount > 1) {
      var spaceingY = this._getSpaceingY();

      return fontSize * lineCount + spaceingY * (lineCount - 1);
    }

    return fontSize;
  },
  isHitBox: function isHitBox() {
    return false;
  },
  calculateBox: function calculateBox() {
    var self = this;
    var attrs = self._attrs;
    var cfg = this._cfg;

    if (!cfg.attrs || cfg.hasUpdate) {
      this._assembleFont();

      this._setAttrText();
    }

    if (!attrs.textArr) {
      this._setAttrText();
    }

    var x = attrs.x;
    var y = attrs.y;
    var width = self.measureText(); // attrs.width

    if (!width) {
      // 如果width不存在，四点共其实点
      return {
        minX: x,
        minY: y,
        maxX: x,
        maxY: y
      };
    }

    var height = self._getTextHeight(); // attrs.height


    var textAlign = attrs.textAlign;
    var textBaseline = attrs.textBaseline;
    var lineWidth = self.getHitLineWidth();
    var point = {
      x: x,
      y: y - height
    };

    if (textAlign) {
      if (textAlign === 'end' || textAlign === 'right') {
        point.x -= width;
      } else if (textAlign === 'center') {
        point.x -= width / 2;
      }
    }

    if (textBaseline) {
      if (textBaseline === 'top') {
        point.y += height;
      } else if (textBaseline === 'middle') {
        point.y += height / 2;
      }
    }

    this.set('startPoint', point);
    var halfWidth = lineWidth / 2;
    return {
      minX: point.x - halfWidth,
      minY: point.y - halfWidth,
      maxX: point.x + width + halfWidth,
      maxY: point.y + height + halfWidth
    };
  },
  _getSpaceingY: function _getSpaceingY() {
    var attrs = this._attrs;
    var lineHeight = attrs.lineHeight;
    var fontSize = attrs.fontSize * 1;
    return lineHeight ? lineHeight - fontSize : fontSize * 0.14;
  },
  drawInner: function drawInner(context) {
    var self = this;
    var attrs = self._attrs;
    var cfg = this._cfg;

    if (!cfg.attrs || cfg.hasUpdate) {
      this._assembleFont();

      this._setAttrText();
    }

    context.font = attrs.font;
    var text = attrs.text;

    if (!text) {
      return;
    }

    var textArr = attrs.textArr;
    var x = attrs.x;
    var y = attrs.y;
    context.beginPath();

    if (self.hasStroke()) {
      var strokeOpacity = attrs.strokeOpacity;

      if (!Util.isNil(strokeOpacity) && strokeOpacity !== 1) {
        context.globalAlpha = strokeOpacity;
      }

      if (textArr) {
        self._drawTextArr(context, false);
      } else {
        context.strokeText(text, x, y);
      }

      context.globalAlpha = 1;
    }

    if (self.hasFill()) {
      var fillOpacity = attrs.fillOpacity;

      if (!Util.isNil(fillOpacity) && fillOpacity !== 1) {
        context.globalAlpha = fillOpacity;
      }

      if (textArr) {
        self._drawTextArr(context, true);
      } else {
        context.fillText(text, x, y);
      }
    }

    cfg.hasUpdate = false;
  },
  _drawTextArr: function _drawTextArr(context, fill) {
    var textArr = this._attrs.textArr;
    var textBaseline = this._attrs.textBaseline;
    var fontSize = this._attrs.fontSize * 1;

    var spaceingY = this._getSpaceingY();

    var x = this._attrs.x;
    var y = this._attrs.y;
    var box = this.getBBox();
    var height = box.maxY - box.minY;
    var subY;
    Util.each(textArr, function (subText, index) {
      subY = y + index * (spaceingY + fontSize) - height + fontSize; // bottom;

      if (textBaseline === 'middle') subY += height - fontSize - (height - fontSize) / 2;
      if (textBaseline === 'top') subY += height - fontSize;

      if (fill) {
        context.fillText(subText, x, subY);
      } else {
        context.strokeText(subText, x, subY);
      }
    });
  },
  measureText: function measureText() {
    var self = this;
    var attrs = self._attrs;
    var text = attrs.text;
    var font = attrs.font;
    var textArr = attrs.textArr;
    var measureWidth;
    var width = 0;
    if (Util.isNil(text)) return undefined;
    var context = document.createElement('canvas').getContext('2d');
    context.save();
    context.font = font;

    if (textArr) {
      Util.each(textArr, function (subText) {
        measureWidth = context.measureText(subText).width;

        if (width < measureWidth) {
          width = measureWidth;
        }

        context.restore();
      });
    } else {
      width = context.measureText(text).width;
      context.restore();
    }

    return width;
  }
});
module.exports = CText;