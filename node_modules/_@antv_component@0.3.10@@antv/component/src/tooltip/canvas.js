const G = require('@antv/g/lib');
const Crosshair = require('./crosshair');
const MarkerGroupMixin = require('./mixin/marker-group');
const PositionMixin = require('./mixin/position');
const Tooltip = require('./base');
const Util = require('../util');
const {
  FONT_FAMILY
} = require('../const');

const DomUtil = Util.DomUtil;
const MatrixUtil = Util.MatrixUtil;


class CanvasTooltip extends Tooltip {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * 默认背景板样式
       * @type {Object}
       */
      boardStyle: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        fill: 'rgba(255, 255, 255, 0.9)',
        radius: 4,
        stroke: '#e2e2e2',
        lineWidth: 1
      },
      /**
       * 默认title样式
       * @type {Object}
       */
      titleStyle: {
        fontFamily: FONT_FAMILY,
        text: '',
        textBaseline: 'top',
        fontSize: 12,
        fill: 'rgb(87, 87, 87)',
        lineHeight: 20,
        padding: 20
      },
      /**
       * 默认marker样式
       * @type {Object}
       */
      markerStyle: {
        radius: 4
      },
      /**
       * 默认name样式
       * @type {Object}
       */
      nameStyle: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fill: 'rgb(87, 87, 87)',
        textBaseline: 'middle',
        textAlign: 'start',
        padding: 8
      },
      /**
       * 默认value样式
       * @type {Object}
       */
      valueStyle: {
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        fill: 'rgb(87, 87, 87)',
        textBaseline: 'middle',
        textAlign: 'start',
        padding: 30
      },
      /**
       * 默认padding值
       * @type {Object}
       */
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      /**
       * 默认item之间的gap
       * @type {Number}
       */
      itemGap: 10,
      /**
       * 默认tooltip位置移动动画的时长
       * @type {Number}
       */
      animationDuration: 200
    });
  }

  constructor(cfg) {
    super(cfg);
    Util.assign(this, PositionMixin);
    Util.assign(this, MarkerGroupMixin);
    // crosshair
    const crosshair = this.get('crosshairs');
    if (crosshair) {
      const plot = crosshair.type === 'rect' ? this.get('backPlot') : this.get('frontPlot');
      const crosshairGroup = new Crosshair(Util.mix({
        plot,
        plotRange: this.get('plotRange'),
        canvas: this.get('canvas')
      }, this.get('crosshairs')));
      crosshairGroup.hide();
      this.set('crosshairGroup', crosshairGroup);
    }

    this._init_();
    if (this.get('items')) {
      this.render();
    }
  }

  _init_() {
    const self = this;
    const padding = self.get('padding');
    const parent = self.get('frontPlot');
    // marker group
    const markerGroup = parent.addGroup({
      capture: false
    });
    self.set('markerGroup', markerGroup);
    // container
    const container = parent.addGroup();
    container.hide();
    self.set('container', container);
    // board
    const board = container.addShape('rect', {
      attrs: Util.mix({}, self.get('boardStyle'))
    });
    self.set('board', board);
    // title
    const titleStyle = self.get('titleStyle');
    if (self.get('showTitle')) {
      const titleShape = container.addShape('text', {
        attrs: Util.mix({
          x: padding.left,
          y: padding.top
        }, titleStyle)
      });
      self.set('titleShape', titleShape);
      titleShape.name = 'tooltip-title';
    }
    // items
    const itemsGroup = container.addGroup();
    itemsGroup.move(padding.left, padding.top + titleStyle.lineHeight + titleStyle.padding);
    self.set('itemsGroup', itemsGroup);
  }

  render() {
    const self = this;
    self.clear();
    const container = self.get('container');
    const board = self.get('board');
    const showTitle = self.get('showTitle');
    const titleContent = self.get('titleContent');
    const titleShape = this.get('titleShape');
    const itemsGroup = this.get('itemsGroup');
    const items = self.get('items');
    const padding = self.get('padding');

    if (titleShape && showTitle) {
      titleShape.attr('text', titleContent);
    }

    if (itemsGroup) {
      const itemGap = self.get('itemGap');
      const x = 0;
      let y = 0;
      Util.each(items, item => {
        const itemGroup = self._addItem(item);
        itemGroup.move(x, y);
        itemsGroup.add(itemGroup);
        const itemHeight = itemGroup.getBBox().height;
        y += itemHeight + itemGap;
      });
    }
    // update board based on bbox
    const bbox = container.getBBox();
    const width = bbox.width + padding.right;
    const height = bbox.height + padding.bottom;
    board.attr('width', width);
    board.attr('height', height);
    // align value text to right
    self._alignToRight(width);
  }

  clear() {
    const titleShape = this.get('titleShape');
    const itemsGroup = this.get('itemsGroup');
    const board = this.get('board');
    titleShape.text = '';
    itemsGroup.clear();
    board.attr('width', 0);
    board.attr('height', 0);
  }

  show() {
    const container = this.get('container');
    container.show();
    const crosshairGroup = this.get('crosshairGroup');
    crosshairGroup && crosshairGroup.show();
    const markerGroup = this.get('markerGroup');
    markerGroup && markerGroup.show();
    super.show();
    this.get('canvas').draw();
  }

  hide() {
    const container = this.get('container');
    container.hide();
    const crosshairGroup = this.get('crosshairGroup');
    crosshairGroup && crosshairGroup.hide();
    const markerGroup = this.get('markerGroup');
    markerGroup && markerGroup.hide();
    super.hide();
    this.get('canvas').draw();
  }

  destroy() {
    const container = this.get('container');
    const crosshairGroup = this.get('crosshairGroup');
    crosshairGroup && crosshairGroup.destroy();
    const markerGroup = this.get('markerGroup');
    markerGroup && markerGroup.remove();
    super.destroy();
    container.remove();
  }

  setPosition(x, y, target) {
    const container = this.get('container');
    const outterNode = this.get('canvas').get('el');
    const viewWidth = DomUtil.getWidth(outterNode);
    const viewHeight = DomUtil.getHeight(outterNode);
    const bbox = container.getBBox();
    const containerWidth = bbox.width;
    const containerHeight = bbox.height;

    let endx = x;
    let endy = y;

    let position;
    if (this.get('position')) {
      const containerWidth = bbox.width;
      const containerHeight = bbox.height;
      position = this._calcTooltipPosition(x, y, this.get('position'), containerWidth, containerHeight, target);
      x = position[0];
      y = position[1];
    } else {
      position = this._constraintPositionInBoundary(x, y, containerWidth, containerHeight, viewWidth, viewHeight);
      x = position[0];
      y = position[1];
    }


    if (this.get('inPlot')) { // tooltip 必须限制在绘图区域内
      const plotRange = this.get('plotRange');
      position = this._constraintPositionInPlot(x, y, containerWidth, containerHeight, plotRange, this.get('enterable'));
      x = position[0];
      y = position[1];
    }

    const markerItems = this.get('markerItems');
    if (!Util.isEmpty(markerItems)) {
      endx = markerItems[0].x;
      endy = markerItems[0].y;
    }

    const ulMatrix = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
    const mat = MatrixUtil.transform(ulMatrix, [
        [ 't', x, y ]
    ]);
    container.stopAnimate();
    container.animate({
      matrix: mat
    }, this.get('animationDuration'));

    const crosshairGroup = this.get('crosshairGroup');
    if (crosshairGroup) {
      const items = this.get('items');
      crosshairGroup.setPosition(endx, endy, items);
    }
    super.setPosition(x, y);
  }

  _addItem(item) {
    const group = new G.Group();
    let markerRadius = this.get('markerStyle').radius;
    // marker
    if (item.marker) {
      const markerAttrs = Util.mix({}, item.marker, {
        x: item.marker.radius / 2,
        y: 0,
        symbol: item.marker.activeSymbol || item.marker.symbol
      });

      group.addShape('marker', {
        attrs: markerAttrs
      });
      markerRadius = item.marker.radius;
    }
    // name
    const nameStyle = this.get('nameStyle');
    group.addShape('text', {
      attrs: Util.mix({
        x: markerRadius + nameStyle.padding,
        y: 0,
        text: item.name
      }, nameStyle)
    });
    // value
    const valueStyle = this.get('valueStyle');
    group.addShape('text', {
      attrs: Util.mix({
        x: group.getBBox().width + valueStyle.padding,
        y: 0,
        text: item.value
      }, valueStyle)
    });

    return group;
  }

  _alignToRight(width) {
    const itemsGroup = this.get('itemsGroup');
    const groups = itemsGroup.get('children');
    Util.each(groups, g => {
      const children = g.get('children');
      const valueText = children[2];
      const w = valueText.getBBox().width;
      const x = width - w - this.get('padding').right * 2;
      valueText.attr('x', x);
    });
  }
}

module.exports = CanvasTooltip;
