/**
 * @fileOverview The class of the gradient color legend
 * @author sima.zhang
 */
const Util = require('../util');
const Continuous = require('./continuous');

class Size extends Continuous {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * 类型
       * @type {String}
       */
      type: 'size-legend',
      width: 100,
      height: 200,
      /**
       * 不能滑动时圈的样式
       * @type {ATTRS}
       */
      _unslidableElementStyle: {
        fill: '#4E7CCC',
        fillOpacity: 1
      },
      /**
       * 中间 bar 的前景颜色
       * @type {ATTRS}
       */
      frontMiddleBarStyle: {
        fill: 'rgb(64, 141, 251)'
      }
    });
  }

  // render the slider shape
  _renderSliderShape() {
    const slider = this.get('slider');
    const backgroundElement = slider.get('backgroundElement');
    const layout = this.get('layout');
    const width = this.get('width');
    const height = this.get('height');
    // const x = minRadius;
    const y = this.get('height') / 2;
    const frontMiddleBarStyle = this.get('frontMiddleBarStyle');
    // background of middle bar
    const points = (layout === 'vertical') ? [
      [ 0, 0 ],
      [ width, 0 ],
      [ width, height ],
      [ width - 4, height ]
    ] : [
      [ 0, y + height / 2 ],
      [ 0, y + height / 2 - 4 ],
      [ width, y - height / 2 ],
      [ width, y + height / 2 ]
    ];
    return this._addMiddleBar(backgroundElement, 'Polygon', Util.mix({
      points
    }, frontMiddleBarStyle));
  }

  // render the middle bar while slidable === false,
  // there are no triggers for this situation
  _renderUnslidable() {
    const layout = this.get('layout');
    const width = this.get('width');
    const height = this.get('height');
    const frontMiddleBarStyle = this.get('frontMiddleBarStyle');
    const points = (layout === 'vertical') ? [
      [ 0, 0 ],
      [ width, 0 ],
      [ width, height ],
      [ width - 4, height ]
    ] : [
      [ 0, height ],
      [ 0, height - 4 ],
      [ width, 0 ],
      [ width, height ]
    ];
    const group = this.get('group');
    const bgGroup = group.addGroup();
    bgGroup.addShape('Polygon', {
      attrs: Util.mix({
        points
      }, frontMiddleBarStyle)
    });

    const minText = this._formatItemValue(this.get('firstItem').value);
    const maxText = this._formatItemValue(this.get('lastItem').value);
    if (this.get('layout') === 'vertical') {
      this._addText(width + 10, height - 3, minText); // min
      this._addText(width + 10, 3, maxText);  // max
    } else {
      this._addText(0, height, minText); // min
      this._addText(width, height, maxText);  // max
    }
  }
  // add min and max text while slidable === false
  _addText(x, y, text) {
    const group = this.get('group');
    const textGroup = group.addGroup();
    const textStyle = this.get('textStyle');
    const titleShape = this.get('titleShape');
    let titleGap = this.get('titleGap');
    if (titleShape) {
      titleGap += titleShape.getBBox().height;
    }

    if (this.get('layout') === 'vertical') {
      textGroup.addShape('text', {
        attrs: Util.mix({
          x: x + this.get('textOffset'),
          y,
          text: text === 0 ? '0' : text
        }, textStyle)
      });
    } else {
      y += titleGap + this.get('textOffset') - 20;
      if (!titleShape) y += 10;
      textGroup.addShape('text', {
        attrs: Util.mix({
          x,
          y,
          text: text === 0 ? '0' : text
        }, textStyle)
      });
    }
  }
}

module.exports = Size;
