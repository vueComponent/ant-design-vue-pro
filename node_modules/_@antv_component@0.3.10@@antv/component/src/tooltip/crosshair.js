const Component = require('../component');
const Util = require('../util');

class Crosshair extends Component {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
     /**
       * crosshair的类型
       * @type {String}
       */
      type: null,
      /**
       * 画在哪层视图
       * @type {G-Element}
       */
      plot: null,
      /**
       * x轴上，移动到位置的偏移量
       * @type {Number}
       */
      plotRange: null,
      /**
       * 默认rect crosshair样式
       * @type {Object}
       */
      rectStyle: {
        fill: '#CCD6EC',
        opacity: 0.3
      },
     /**
       * 默认line crosshair样式
       * @type {Object}
       */
      lineStyle: {
        stroke: 'rgba(0, 0, 0, 0.25)',
        lineWidth: 1
      },
      isTransposed: false
    });
  }

  constructor(cfg) {
    super(cfg);
    this._init_();
    this.render();
  }

  _init_() {
    const self = this;
    const plot = self.get('plot');
    let group;
    if (self.type === 'rect') {
      group = plot.addGroup({
        zIndex: 0
      });
    } else {
      group = plot.addGroup();
    }
    this.set('container', group);
  }

  _addLineShape(attrs, type) {
    const container = this.get('container');
    const shape = container.addShape('line', {
      capture: false,
      attrs
    });
    // shape.hide();
    this.set('crossLineShape' + type, shape);
    return shape;
  }

  _renderHorizontalLine(canvas, plotRange) {
    const style = Util.mix(this.get('lineStyle'), this.get('style'));
    const attrs = Util.mix({
      x1: plotRange ? plotRange.bl.x : canvas.get('width'),
      y1: 0,
      x2: plotRange ? plotRange.br.x : 0,
      y2: 0
    }, style);
    this._addLineShape(attrs, 'X');
  }

  _renderVerticalLine(canvas, plotRange) {
    const style = Util.mix(this.get('lineStyle'), this.get('style'));
    const attrs = Util.mix({
      x1: 0,
      y1: plotRange ? plotRange.bl.y : canvas.get('height'),
      x2: 0,
      y2: plotRange ? plotRange.tl.y : 0
    }, style);

    this._addLineShape(attrs, 'Y');
  }

  _renderBackground(canvas, plotRange) {
    const style = Util.mix(this.get('rectStyle'), this.get('style'));
    const container = this.get('container');
    const attrs = Util.mix({
      x: plotRange ? plotRange.tl.x : 0,
      y: plotRange ? plotRange.tl.y : canvas.get('height'),
      width: plotRange ? plotRange.br.x - plotRange.bl.x : canvas.get('width'),
      height: plotRange ? Math.abs(plotRange.tl.y - plotRange.bl.y) : canvas.get('height')
    }, style);

    const shape = container.addShape('rect', {
      attrs,
      capture: false
    });
    // shape.hide();
    this.set('crosshairsRectShape', shape);
    return shape;
  }

  _updateRectShape(items) {
    let offset;
    const crosshairsRectShape = this.get('crosshairsRectShape');
    const isTransposed = this.get('isTransposed');
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const dim = isTransposed ? 'y' : 'x';
    const attr = isTransposed ? 'height' : 'width';
    let startDim = firstItem[dim];
    if (items.length > 1 && firstItem[dim] > lastItem[dim]) {
      startDim = lastItem[dim];
    }
    if (this.get('width')) { // 用户定义了 width
      crosshairsRectShape.attr(dim, startDim - this.get('crosshairs').width / 2);
      crosshairsRectShape.attr(attr, this.get('width'));
    } else {
      if (Util.isArray(firstItem.point[dim]) && !firstItem.size) { // 直方图
        const width = firstItem.point[dim][1] - firstItem.point[dim][0];
        crosshairsRectShape.attr(dim, firstItem.point[dim][0]);
        crosshairsRectShape.attr(attr, width);
      } else {
        offset = (3 * firstItem.size) / 4;
        crosshairsRectShape.attr(dim, startDim - offset);

        if (items.length === 1) {
          crosshairsRectShape.attr(attr, (3 * firstItem.size) / 2);
        } else {
          crosshairsRectShape.attr(attr, Math.abs(lastItem[dim] - firstItem[dim]) + 2 * offset);
        }
      }
    }

  }

  render() {
    const canvas = this.get('canvas');
    const plotRange = this.get('plotRange');
    const isTransposed = this.get('isTransposed');
    this.clear();
    switch (this.get('type')) {
      case 'x':
        this._renderHorizontalLine(canvas, plotRange);
        break;
      case 'y':
        this._renderVerticalLine(canvas, plotRange);
        break;
      case 'cross':
        this._renderHorizontalLine(canvas, plotRange);
        this._renderVerticalLine(canvas, plotRange);
        break;
      case 'rect':
        this._renderBackground(canvas, plotRange);
        break;
      default:
        isTransposed ? this._renderHorizontalLine(canvas, plotRange) : this._renderVerticalLine(canvas, plotRange);
    }
  }

  show() {
    const container = this.get('container');
    super.show();
    container.show();
  }

  hide() {
    const container = this.get('container');
    super.hide();
    container.hide();
  }

  clear() {
    const container = this.get('container');
    this.set('crossLineShapeX', null);
    this.set('crossLineShapeY', null);
    this.set('crosshairsRectShape', null);
    super.clear();
    container.clear();
  }

  destroy() {
    const container = this.get('container');
    super.destroy();
    container.remove();
  }

  setPosition(x, y, items) {
    const crossLineShapeX = this.get('crossLineShapeX');
    const crossLineShapeY = this.get('crossLineShapeY');
    const crosshairsRectShape = this.get('crosshairsRectShape');
    if (crossLineShapeY && !crossLineShapeY.get('destroyed')) { // 第一次进入时，画布需要单独绘制，所以需要先设定corss的位置
      crossLineShapeY.move(x, 0);
    }
    if (crossLineShapeX && !crossLineShapeX.get('destroyed')) {
      crossLineShapeX.move(0, y);
    }
    if (crosshairsRectShape && !crosshairsRectShape.get('destroyed')) {
      this._updateRectShape(items);
    }
  }
}

module.exports = Crosshair;
