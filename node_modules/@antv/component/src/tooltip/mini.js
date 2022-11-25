const Util = require('../util');
const CanvasTooltip = require('./canvas');
const {
  FONT_FAMILY
} = require('../const');

const DomUtil = Util.DomUtil;
const MatrixUtil = Util.MatrixUtil;

class MiniTooltip extends CanvasTooltip {
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
        width: 0,
        height: 0,
        // fill: 'rgba(50, 50, 50, 1)',
        radius: 3
      },
      /**
       * 默认value样式
       * @type {Object}
       * */
      valueStyle: {
        x: 0,
        y: 0,
        text: '',
        fontFamily: FONT_FAMILY,
        fontSize: 12,
        stroke: '#fff',
        lineWidth: 2,
        fill: 'black',
        textBaseline: 'top',
        textAlign: 'start'
      },
      /**
       * 默认padding值
       * @type {Object}
       */
      padding: { top: 5, right: 5, bottom: 0, left: 5 },
      triangleWidth: 10,
      triangleHeight: 4
    });
  }

  _init_() {
    const self = this;
    const padding = self.get('padding');
    const parent = self.get('frontPlot');
    // container
    const container = parent.addGroup();
    self.set('container', container);
    // board
    const board = container.addShape('rect', {
      attrs: Util.mix({}, self.get('boardStyle'))
    });
    self.set('board', board);
    // triangleShpe
    const triangleShape = container.addShape('path', {
      attrs: {
        fill: self.get('boardStyle').fill
      }
    });
    self.set('triangleShape', triangleShape);
    // itemGroup
    const itemGroup = container.addGroup();
    itemGroup.move(padding.left, padding.top);
    // value
    const valueShape = itemGroup.addShape('text', {
      attrs: Util.mix({}, self.get('valueStyle'))
    });
    self.set('valueShape', valueShape);
  }

  render() {
    const self = this;
    self.clear();
    const board = self.get('board');
    const valueShape = self.get('valueShape');
    const padding = self.get('padding');
    const item = self.get('items')[0];
    if (valueShape) {
      valueShape.attr('text', item.value);
    }
    // update board based on bbox
    const bbox = valueShape ? valueShape.getBBox() : { width: 80, height: 30 };
    const width = padding.left + bbox.width + padding.right;
    const height = padding.top + bbox.height + padding.bottom;
    board.attr('width', width);
    board.attr('height', height);
    // update triangle shape
    self._centerTriangleShape();
  }

  clear() {
    const valueShape = this.get('valueShape');
    valueShape.attr('text', '');
  }

  setPosition(x, y, target) {
    const self = this;
    const container = self.get('container');
    const plotRange = self.get('plotRange');
    const bbox = container.getBBox();
    const width = bbox.width;
    const height = bbox.height;

    x -= width / 2;
    if (target && (target.name === 'point' || target.name === 'interval')) {
      const targetY = target.getBBox().y;
      y = targetY;
    }
    y -= height;

    if (this.get('inPlot')) { // constrain in plot

      if (x < plotRange.tl.x) {
        x = plotRange.tl.x;
        self._leftTriangleShape();
      } else if (x + width / 2 > plotRange.tr.x) {
        x = plotRange.tr.x - width;
        self._rightTriangleShape();
      } else {
        self._centerTriangleShape();
      }

      if (y < plotRange.tl.y) {
        y = plotRange.tl.y;
      } else if (y + height > plotRange.bl.y) {
        y = plotRange.bl.y - height;
      }

    } else { // constrain in dom
      const outterNode = this.get('canvas').get('el');
      const viewWidth = DomUtil.getWidth(outterNode);
      const viewHeight = DomUtil.getHeight(outterNode);
      if (x < 0) {
        x = 0;
        self._leftTriangleShape();
      } else if (x + width / 2 > viewWidth) {
        x = viewWidth - width;
        self._rightTriangleShape();
      } else {
        self._centerTriangleShape();
      }
      if (y < 0) {
        y = 0;
      } else if (y + height > viewHeight) {
        y = viewHeight - height;
      }

    }
    const ulMatrix = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
    const mat = MatrixUtil.transform(ulMatrix, [
        [ 't', x, y ]
    ]);
    container.stopAnimate();
    container.animate({
      matrix: mat
    }, this.get('animationDuration'));
  }


  _centerTriangleShape() {
    const triangle = this.get('triangleShape');
    const width = this.get('triangleWidth');
    const height = this.get('triangleHeight');
    const boardBBox = this.get('board').getBBox();
    const boardWidth = boardBBox.width;
    const boardHeight = boardBBox.height;
    const pathArray = [
      [ 'M', 0, 0 ],
      [ 'L', width, 0 ],
      [ 'L', width / 2, height ],
      [ 'L', 0, 0 ],
      [ 'Z' ]
    ];
    triangle.attr('path', pathArray);
    triangle.move(boardWidth / 2 - width / 2, boardHeight - 1);
  }

  _leftTriangleShape() {
    const triangle = this.get('triangleShape');
    const width = this.get('triangleWidth');
    const height = this.get('triangleHeight');
    const boardBBox = this.get('board').getBBox();
    const boardHeight = boardBBox.height;
    const pathArray = [
      [ 'M', 0, 0 ],
      [ 'L', width, 0 ],
      [ 'L', 0, height + 3 ],
      [ 'L', 0, 0 ],
      [ 'Z' ]
    ];
    triangle.attr('path', pathArray);
    triangle.move(0, boardHeight - 3);
  }

  _rightTriangleShape() {
    const triangle = this.get('triangleShape');
    const width = this.get('triangleWidth');
    const height = this.get('triangleHeight');
    const boardBBox = this.get('board').getBBox();
    const boardWidth = boardBBox.width;
    const boardHeight = boardBBox.height;
    const pathArray = [
      [ 'M', 0, 0 ],
      [ 'L', width, 0 ],
      [ 'L', width, height + 4 ],
      [ 'L', 0, 0 ],
      [ 'Z' ]
    ];
    triangle.attr('path', pathArray);
    triangle.move(boardWidth - width - 1, boardHeight - 4);
  }


}

module.exports = MiniTooltip;
