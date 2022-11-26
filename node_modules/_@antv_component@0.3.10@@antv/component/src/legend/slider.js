/**
 * @fileOverview The class of slider
 * @author sima.zhang
 */
const Util = require('../util');
const DomUtil = Util.DomUtil;
const Group = Util.Group;

const Slider = function(cfg) {
  Slider.superclass.constructor.call(this, cfg);
};

Util.extend(Slider, Group);
Util.augment(Slider, {
  getDefaultCfg() {
    return {
      /**
       * 范围
       * @type {Array}
       */
      range: null,
      /**
       * 中滑块属性
       * 透明的，用于用户交互
       * @type {ATTRS}
       */
      middleAttr: {
        fill: '#fff',
        fillOpacity: 0
      },
      /**
       * 背景
       * @type {G-Element}
       */
      backgroundElement: null,
      /**
       * 下滑块
       * @type {G-Element}
       */
      minHandleElement: null,
      /**
       * 上滑块
       * @type {G-Element}
       */
      maxHandleElement: null,
      /**
       * 中块，
       * 透明的，用于用户交互
       * @type {G-Element}
       */
      middleHandleElement: null,
      /**
       * 当前的激活的元素
       * @type {G-Element}
       */
      currentTarget: null,
      /**
       * 布局方式： horizontal，vertical
       * @type {String}
       */
      layout: 'vertical',
      /**
       * 宽
       * @type {Number}
       */
      width: null,
      /**
       * 高
       * @type {Number}
       */
      height: null,
      /**
       * 当前的PageX
       * @type {Number}
       */
      pageX: null,
      /**
       * 当前的PageY
       * @type {Number}
       */
      pageY: null
    };
  },

  // arrange the zindex and cursors of each element
  _beforeRenderUI() {
    const layout = this.get('layout');
    const backgroundElement = this.get('backgroundElement');
    const minHandleElement = this.get('minHandleElement');
    const maxHandleElement = this.get('maxHandleElement');
    const middleHandleElement = this.addShape('rect', {
      attrs: this.get('middleAttr')
    });
    const trigerCursor = (layout === 'vertical') ? 'ns-resize' : 'ew-resize';

    this.add([ backgroundElement, minHandleElement, maxHandleElement ]);
    this.set('middleHandleElement', middleHandleElement);
    backgroundElement.set('zIndex', 0);
    middleHandleElement.set('zIndex', 1);
    minHandleElement.set('zIndex', 2);
    maxHandleElement.set('zIndex', 2);
    middleHandleElement.attr('cursor', 'move');
    minHandleElement.attr('cursor', trigerCursor);
    maxHandleElement.attr('cursor', trigerCursor);
    this.sort();
  },

  // rendering
  _renderUI() {
    if (this.get('layout') === 'horizontal') {
      this._renderHorizontal();
    } else {
      this._renderVertical();
    }
  },

  _transform(layout) {
    const range = this.get('range');
    const minRatio = range[0] / 100;
    const maxRatio = range[1] / 100;
    const width = this.get('width');
    const height = this.get('height');
    const minHandleElement = this.get('minHandleElement');
    const maxHandleElement = this.get('maxHandleElement');
    const middleHandleElement = this.get('middleHandleElement');

    minHandleElement.resetMatrix();
    maxHandleElement.resetMatrix();

    if (layout === 'horizontal') {
      middleHandleElement.attr({
        x: width * minRatio,
        y: 0,
        width: (maxRatio - minRatio) * width,
        height
      });
      minHandleElement.translate(minRatio * width, height);
      maxHandleElement.translate(maxRatio * width, height);
    } else {
      middleHandleElement.attr({
        x: 0,
        y: height * (1 - maxRatio),
        width,
        height: (maxRatio - minRatio) * height
      });
      minHandleElement.translate(1, (1 - minRatio) * height);
      maxHandleElement.translate(1, (1 - maxRatio) * height);
    }
  },

  _renderHorizontal() {
    this._transform('horizontal');
  },

  _renderVertical() {
    this._transform('vertical');
  },

  _bindUI() {
    this.on('mousedown', Util.wrapBehavior(this, '_onMouseDown'));
  },

  // if the target matches name
  _isElement(target, name) {
    const element = this.get(name);
    if (target === element) {
      return true;
    }
    if (element.isGroup) {
      const elementChildren = element.get('children');
      return elementChildren.indexOf(target) > -1;
    }
    return false;
  },

  // get the result range after adding diff to range
  // insure that the result out of the interval [0, 100]
  _getRange(diff, range) {
    let rst = diff + range;
    rst = rst > 100 ? 100 : rst;
    rst = rst < 0 ? 0 : rst;
    return rst;
  },

  _updateStatus(dim, ev) {
    const totalLength = dim === 'x' ? this.get('width') : this.get('height');
    dim = Util.upperFirst(dim);
    const range = this.get('range');
    const page = this.get('page' + dim);
    const currentTarget = this.get('currentTarget');
    const rangeStash = this.get('rangeStash');
    const layout = this.get('layout');
    const sign = layout === 'vertical' ? -1 : 1;
    const currentPage = ev[ 'page' + dim ];
    // the distance of the mouse dragging
    const diffPage = currentPage - page;
    const diffRange = (diffPage / totalLength) * 100 * sign;
    let diffStashRange;

    // the min and max trigger overlap, range[0] and range[1] change together
    if (range[1] <= range[0]) {
      if (this._isElement(currentTarget, 'minHandleElement') || this._isElement(currentTarget, 'maxHandleElement')) {
        range[0] = this._getRange(diffRange, range[0]);
        range[1] = this._getRange(diffRange, range[0]);
      }
    } else {
      // user drags the min trigger
      if (this._isElement(currentTarget, 'minHandleElement')) {
        range[0] = this._getRange(diffRange, range[0]);
      }
      // user drags the max trigger
      if (this._isElement(currentTarget, 'maxHandleElement')) {
        range[1] = this._getRange(diffRange, range[1]);
      }
    }

    // the user drags the middle bar
    if (this._isElement(currentTarget, 'middleHandleElement')) {
      // the diffrence between min and max trigger while mouse down
      diffStashRange = (rangeStash[1] - rangeStash[0]);
      range[0] = this._getRange(diffRange, range[0]);
      // keep the diffStashRange
      range[1] = range[0] + diffStashRange;
      if (range[1] > 100) {
        range[1] = 100;
        range[0] = range[1] - diffStashRange;
      }
    }
    this.emit('sliderchange', {
      range
    });

    this.set('page' + dim, currentPage);
    this._renderUI();
    this.get('canvas').draw(); // need delete
    return;
  },

  // the listener of mouse down
  _onMouseDown(ev) {
    const currentTarget = ev.currentTarget;
    const originEvent = ev.event;
    const range = this.get('range');
    originEvent.stopPropagation();
    originEvent.preventDefault();
    this.set('pageX', originEvent.pageX);
    this.set('pageY', originEvent.pageY);
    this.set('currentTarget', currentTarget);
    // stash the range
    this.set('rangeStash', [ range[0], range[1] ]);
    this._bindCanvasEvents();
  },

  _bindCanvasEvents() {
    const containerDOM = this.get('canvas').get('containerDOM');
    // this.on('mousemove', Util.wrapBehavior(this, '_onCanvasMouseMove'));
    this.onMouseMoveListener = DomUtil.addEventListener(containerDOM, 'mousemove', Util.wrapBehavior(this, '_onCanvasMouseMove'));
    this.onMouseUpListener = DomUtil.addEventListener(containerDOM, 'mouseup', Util.wrapBehavior(this, '_onCanvasMouseUp'));
    this.onMouseLeaveListener = DomUtil.addEventListener(containerDOM, 'mouseleave', Util.wrapBehavior(this, '_onCanvasMouseUp'));
  },

  // listener of mouse click and move = drag
  _onCanvasMouseMove(ev) {
    if (!this._mouseOutArea(ev)) {
      const layout = this.get('layout');
      if (layout === 'horizontal') {
        this._updateStatus('x', ev);
      } else {
        this._updateStatus('y', ev);
      }
    }
  },

  // listener of mouse up
  _onCanvasMouseUp() {
    this._removeDocumentEvents();
  },

  // remove listeners
  _removeDocumentEvents() {
    this.onMouseMoveListener.remove();
    this.onMouseUpListener.remove();
  },

  // if the mouse is out of the area
  _mouseOutArea(ev) {
    const el = this.get('canvas').get('el');
    const el_bbox = el.getBoundingClientRect();
    const parent = this.get('parent');
    const bbox = parent.getBBox();
    const left = parent.attr('matrix')[6];
    const top = parent.attr('matrix')[7];
    const right = left + bbox.width;
    const bottom = top + bbox.height;
    const mouseX = ev.clientX - el_bbox.x;
    const mouseY = ev.clientY - el_bbox.y;
    if (mouseX < left || mouseX > right || mouseY < top || mouseY > bottom) {
      return true;
    }
    return false;
  }
});

module.exports = Slider;
