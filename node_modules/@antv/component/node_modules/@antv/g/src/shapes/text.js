const Util = require('../util/index');
const Shape = require('../core/shape');

const CText = function(cfg) {
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
  getDefaultAttrs() {
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
  initTransform() {
    const fontSize = this._attrs.fontSize;
    if (fontSize && +fontSize < 12) { // 小于 12 像素的文本进行 scale 处理
      this.transform([
        [ 't', -1 * this._attrs.x, -1 * this._attrs.y ],
        [ 's', +fontSize / 12, +fontSize / 12 ],
        [ 't', this._attrs.x, this._attrs.y ]
      ]);
    }
  },
  _assembleFont() {
    // var self = this;
    const attrs = this._attrs;
    const fontSize = attrs.fontSize;
    const fontFamily = attrs.fontFamily;
    const fontWeight = attrs.fontWeight;
    const fontStyle = attrs.fontStyle; // self.attr('fontStyle');
    const fontVariant = attrs.fontVariant; // self.attr('fontVariant');
    // self.attr('font', [fontStyle, fontVariant, fontWeight, fontSize + 'px', fontFamily].join(' '));
    attrs.font = [ fontStyle, fontVariant, fontWeight, fontSize + 'px', fontFamily ].join(' ');
  },
  _setAttrText() {
    const attrs = this._attrs;
    const text = attrs.text;
    let textArr = null;
    if (Util.isString(text) && (text.indexOf('\n') !== -1)) {
      textArr = text.split('\n');
      const lineCount = textArr.length;
      attrs.lineCount = lineCount;
    }
    attrs.textArr = textArr;
  },
  _getTextHeight() {
    const attrs = this._attrs;
    const lineCount = attrs.lineCount;
    const fontSize = attrs.fontSize * 1;
    if (lineCount > 1) {
      const spaceingY = this._getSpaceingY();
      return fontSize * lineCount + spaceingY * (lineCount - 1);
    }
    return fontSize;
  },
  isHitBox() {
    return false;
  },
  calculateBox() {
    const self = this;
    const attrs = self._attrs;
    const cfg = this._cfg;
    if (!cfg.attrs || cfg.hasUpdate) {
      this._assembleFont();
      this._setAttrText();
    }
    if (!attrs.textArr) {
      this._setAttrText();
    }
    const x = attrs.x;
    const y = attrs.y;
    const width = self.measureText(); // attrs.width
    if (!width) {
      // 如果width不存在，四点共其实点
      return {
        minX: x,
        minY: y,
        maxX: x,
        maxY: y
      };
    }
    const height = self._getTextHeight(); // attrs.height
    const textAlign = attrs.textAlign;
    const textBaseline = attrs.textBaseline;
    const lineWidth = self.getHitLineWidth();
    const point = {
      x,
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
    const halfWidth = lineWidth / 2;
    return {
      minX: point.x - halfWidth,
      minY: point.y - halfWidth,
      maxX: point.x + width + halfWidth,
      maxY: point.y + height + halfWidth
    };
  },
  _getSpaceingY() {
    const attrs = this._attrs;
    const lineHeight = attrs.lineHeight;
    const fontSize = attrs.fontSize * 1;
    return lineHeight ? (lineHeight - fontSize) : fontSize * 0.14;
  },
  drawInner(context) {
    const self = this;
    const attrs = self._attrs;
    const cfg = this._cfg;
    if (!cfg.attrs || cfg.hasUpdate) {
      this._assembleFont();
      this._setAttrText();
    }
    context.font = attrs.font;
    const text = attrs.text;
    if (!text) {
      return;
    }
    const textArr = attrs.textArr;
    const x = attrs.x;
    const y = attrs.y;

    context.beginPath();
    if (self.hasStroke()) {
      const strokeOpacity = attrs.strokeOpacity;
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
      const fillOpacity = attrs.fillOpacity;
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
  _drawTextArr(context, fill) {
    const textArr = this._attrs.textArr;
    const textBaseline = this._attrs.textBaseline;
    const fontSize = this._attrs.fontSize * 1;
    const spaceingY = this._getSpaceingY();
    const x = this._attrs.x;
    const y = this._attrs.y;
    const box = this.getBBox();
    const height = box.maxY - box.minY;
    let subY;

    Util.each(textArr, (subText, index) => {
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
  measureText() {
    const self = this;
    const attrs = self._attrs;
    const text = attrs.text;
    const font = attrs.font;
    const textArr = attrs.textArr;
    let measureWidth;
    let width = 0;

    if (Util.isNil(text)) return undefined;
    const context = document.createElement('canvas').getContext('2d');
    context.save();
    context.font = font;
    if (textArr) {
      Util.each(textArr, subText => {
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
