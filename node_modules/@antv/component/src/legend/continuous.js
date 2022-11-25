/**
 * @fileOverview The base class of continuous legend
 * @author sima.zhang
 */
const Util = require('../util');
const Legend = require('./base');
const Slider = require('./slider');
const {
  FONT_FAMILY
} = require('../const');

const TRIGGER_WIDTH = 8;
const Event = Util.Event;
const Group = Util.Group;

class Continuous extends Legend {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * 类型
       * @type {String}
       */
      type: 'continuous-legend',
      /**
       * 子项
       * @type {Array}
       */
      items: null,
      /**
       * 布局方式
       * horizontal 水平
       * vertical 垂直
       * @type {String}
       */
      layout: 'vertical',
      /**
       * 宽度
       * @type {Number}
       */
      width: 20,
      /**
       * 高度
       * @type {Number}
       */
      height: 156,
      /**
       * 默认文本图形属性
       * @type {ATTRS}
       */
      textStyle: {
        fill: '#333',
        textAlign: 'center',
        textBaseline: 'middle',
        stroke: '#fff',
        lineWidth: 5,
        fontFamily: FONT_FAMILY
      },
      hoverTextStyle: {
        fill: 'rgba(0,0,0,0.25)'
      },
      /**
       * 连续图例是否可滑动
       * @type {Boolean}
       */
      slidable: true,
      /**
       * 两头滑块的样式
       * @type {object}
       */
      triggerAttr: {
        fill: '#fff',
        // shadowOffsetX: -2,
        // shadowOffsetY: 2,
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.65)',
        radius: 2
      },
      /**
       * slider 的范围
       * @type {array}}
       */
      _range: [ 0, 100 ],
      /**
       * 中间 bar 背景灰色
       * @type {ATTRS}
       */
      middleBackgroundStyle: {
        fill: '#D9D9D9'
      },
      /**
       * 文本与图例间距
       * @type {Number}
       */
      textOffset: 4,
      /**
       * line segment to seperate the unslidable slider blocks
       * @type {object}
       */
      lineStyle: {
        lineWidth: 1,
        stroke: '#fff'
      },
      /**
       * the pointer while activate the legend by mouse hovering or called by outside
       * @type {object}
       */
      pointerStyle: {
        // color: '#ccc',
        fill: 'rgb(230, 230, 230)'
      }
    });
  }

  _calStartPoint() {
    const start = {
      x: 10,
      y: this.get('titleGap') - TRIGGER_WIDTH
    };
    const titleShape = this.get('titleShape');
    if (titleShape) {
      const titleBox = titleShape.getBBox();
      start.y += titleBox.height;
    }
    return start;
  }

  beforeRender() {
    const items = this.get('items');
    if (!Util.isArray(items) || Util.isEmpty(items)) {
      return;
    }
    super.beforeRender();
    this.set('firstItem', items[0]);
    this.set('lastItem', items[items.length - 1]);
  }

  _formatItemValue(value) {
    const formatter = this.get('formatter') || this.get('itemFormatter');
    if (formatter) {
      value = formatter.call(this, value);
    }
    return value;
  }

  render() {
    super.render();
    if (this.get('slidable')) {
      this._renderSlider();
    } else {
      this._renderUnslidable();
    }
  }

  _renderSlider() {
    const minHandleElement = new Group();
    const maxHandleElement = new Group();
    const backgroundElement = new Group();
    const start = this._calStartPoint();
    const group = this.get('group');
    const slider = group.addGroup(Slider, {
      minHandleElement,
      maxHandleElement,
      backgroundElement,
      layout: this.get('layout'),
      range: this.get('_range'),
      width: this.get('width'),
      height: this.get('height')
    });
    slider.translate(start.x, start.y);
    this.set('slider', slider);

    const shape = this._renderSliderShape();
    shape.attr('clip', slider.get('middleHandleElement'));
    this._renderTrigger();
  }

  // the middle bar
  _addMiddleBar(parent, name, attrs) {
    // background of the middle bar
    parent.addShape(name, {
      attrs: Util.mix({}, attrs, this.get('middleBackgroundStyle'))
    });
    // frontground of the middle bar
    return parent.addShape(name, {
      attrs
    });
  }

  _renderTrigger() {
    const min = this.get('firstItem');
    const max = this.get('lastItem');
    const layout = this.get('layout');
    const textStyle = this.get('textStyle');
    const triggerAttr = this.get('triggerAttr');

    const minBlockAttr = Util.mix({}, triggerAttr);
    const maxBlockAttr = Util.mix({}, triggerAttr);

    const minTextAttr = Util.mix({
      text: this._formatItemValue(min.value) + ''
    }, textStyle);
    const maxTextAttr = Util.mix({
      text: this._formatItemValue(max.value) + ''
    }, textStyle);
    if (layout === 'vertical') {
      this._addVerticalTrigger('min', minBlockAttr, minTextAttr);
      this._addVerticalTrigger('max', maxBlockAttr, maxTextAttr);
    } else {
      this._addHorizontalTrigger('min', minBlockAttr, minTextAttr);
      this._addHorizontalTrigger('max', maxBlockAttr, maxTextAttr);
    }
  }

  _addVerticalTrigger(type, blockAttr, textAttr) {
    const slider = this.get('slider');
    const trigger = slider.get(type + 'HandleElement');
    const width = this.get('width');
    const button = trigger.addShape('rect', {
      attrs: Util.mix({
        x: (width / 2 - TRIGGER_WIDTH - 2),
        y: type === 'min' ? 0 : -TRIGGER_WIDTH,
        width: 2 * TRIGGER_WIDTH + 2,
        height: TRIGGER_WIDTH
      }, blockAttr)
    });
    const text = trigger.addShape('text', {
      attrs: Util.mix(textAttr, {
        x: width + this.get('textOffset'),
        y: type === 'max' ? -4 : 4,
        textAlign: 'start',
        lineHeight: 1,
        textBaseline: 'middle'
      })
    });
    const layout = this.get('layout');
    const trigerCursor = layout === 'vertical' ? 'ns-resize' : 'ew-resize';
    button.attr('cursor', trigerCursor);
    text.attr('cursor', trigerCursor);
    this.set(type + 'ButtonElement', button);
    this.set(type + 'TextElement', text);
  }

  _addHorizontalTrigger(type, blockAttr, textAttr) {
    const slider = this.get('slider');
    const trigger = slider.get(type + 'HandleElement');
    const button = trigger.addShape('rect', {
      attrs: Util.mix({
        x: type === 'min' ? -TRIGGER_WIDTH : 0,
        y: -TRIGGER_WIDTH - this.get('height') / 2,
        width: TRIGGER_WIDTH,
        height: 2 * TRIGGER_WIDTH
      }, blockAttr)
    });
    const text = trigger.addShape('text', {
      attrs: Util.mix(textAttr, {
        x: type === 'min' ? -TRIGGER_WIDTH - 4 : TRIGGER_WIDTH + 4,
        y: TRIGGER_WIDTH / 2 + this.get('textOffset') + 10,
        textAlign: type === 'min' ? 'end' : 'start',
        textBaseline: 'middle'
      })
    });
    const layout = this.get('layout');
    const trigerCursor = layout === 'vertical' ? 'ns-resize' : 'ew-resize';
    button.attr('cursor', trigerCursor);
    text.attr('cursor', trigerCursor);
    this.set(type + 'ButtonElement', button);
    this.set(type + 'TextElement', text);
  }

  _bindEvents() {
    if (this.get('slidable')) {
      const slider = this.get('slider');
      slider.on('sliderchange', ev => {
        const range = ev.range;
        const firstItemValue = this.get('firstItem').value;
        const lastItemValue = this.get('lastItem').value;
        const minValue = firstItemValue + (range[0] / 100) * (lastItemValue - firstItemValue);
        const maxValue = firstItemValue + (range[1] / 100) * (lastItemValue - firstItemValue);
        this._updateElement(minValue, maxValue);
        const itemFiltered = new Event('itemfilter', ev, true, true);
        itemFiltered.range = [ minValue, maxValue ];
        this.emit('itemfilter', itemFiltered);
      });
    }
    if (this.get('hoverable')) {
      this.get('group').on('mousemove', Util.wrapBehavior(this, '_onMouseMove'));
      this.get('group').on('mouseleave', Util.wrapBehavior(this, '_onMouseLeave'));
    }
  }

  // update the text of min and max trigger
  _updateElement(min, max) {
    const minTextElement = this.get('minTextElement');
    const maxTextElement = this.get('maxTextElement');
    if (max > 1) { // 对于大于 1 的值，默认显示为整数
      min = parseInt(min, 10);
      max = parseInt(max, 10);
    }
    minTextElement.attr('text', this._formatItemValue(min) + '');
    maxTextElement.attr('text', this._formatItemValue(max) + '');
  }

  _onMouseLeave() {
    const hoverPointer = this.get('group').findById('hoverPointer');
    hoverPointer && hoverPointer.destroy();
    const hoverText = this.get('group').findById('hoverText');
    hoverText && hoverText.destroy();
    this.get('canvas').draw();
  }
  // activate the legend while mouse moving
  _onMouseMove(ev) {
    const height = this.get('height');
    const width = this.get('width');
    const items = this.get('items');
    const el = this.get('canvas').get('el');
    const el_bbox = el.getBoundingClientRect();
    const bbox = this.get('group').getBBox();

    let value;

    if (this.get('layout') === 'vertical') {
      let valuePadding = 5;
      if (this.get('type') === 'color-legend') {
        valuePadding = 30;
      }
      let titleOffset = this.get('titleGap');
      const titleShape = this.get('titleShape');
      if (titleShape) titleOffset += (titleShape.getBBox().maxY - titleShape.getBBox().minY);
      let currentPage = ev.clientY || ev.event.clientY;
      currentPage = currentPage - el_bbox.y - this.get('group').attr('matrix')[7] + bbox.y - valuePadding + titleOffset;
      value = items[0].value + (1 - (currentPage) / height) * (items[items.length - 1].value - items[0].value);
    } else {
      let currentPage = ev.clientX || ev.event.clientX;
      currentPage = currentPage - el_bbox.x - this.get('group').attr('matrix')[6];
      value = items[0].value + ((currentPage) / width) * (items[items.length - 1].value - items[0].value);
    }
    value = value.toFixed(2);
    this.activate(value);
    this.emit('mousehover', { value });
  }

  // activated by mouse moving or being called
  activate(value) {
    if (!value) {
      return;
    }
    let hoverPointer = this.get('group').findById('hoverPointer');
    let hoverText = this.get('group').findById('hoverText');

    const items = this.get('items');
    if (value < items[0].value || value > items[items.length - 1].value) {
      return;
    }
    const height = this.get('height');
    const width = this.get('width');

    const titleShape = this.get('titleShape');
    const titleGap = this.get('titleGap');

    let points = [];
    let page = (value - items[0].value) / (items[items.length - 1].value - items[0].value);
    let textStyle;

    if (this.get('layout') === 'vertical') {

      // revise the offset
      let paddingY = 0,
        paddingX = 0;
      if (this.get('type') === 'color-legend') {
        paddingY = titleGap;
        if (titleShape) paddingY += titleShape.getBBox().height;
      }
      if (this.get('slidable')) {
        if (this.get('type') === 'color-legend') {
          paddingY -= 13;
        } else {
          paddingY = titleGap - 15;
          if (titleShape) paddingY += titleShape.getBBox().height;
        }
        paddingX += 10;
      }

      page = (1 - page) * height;
      points = [
        [ paddingX, page + paddingY ],
        [ paddingX - 10, page + paddingY - 5 ],
        [ paddingX - 10, page + paddingY + 5 ]
      ];
      textStyle = Util.mix({}, {
        x: width + this.get('textOffset') / 2 + paddingX,
        y: page + paddingY,
        text: this._formatItemValue(value) + '' // 以字符串格式展示
      }, this.get('textStyle'), {
        textAlign: 'start'
      });
    } else {
      let paddingY = 0,
        paddingX = 0;
      if (this.get('type') === 'color-legend') {
        paddingY = titleGap;
        if (titleShape) paddingY += titleShape.getBBox().height;
      }
      if (this.get('slidable')) {
        if (this.get('type') === 'color-legend') {
          // hoverPointer三角形的高
          paddingY -= 7;
        } else {
          paddingY = titleGap;
          if (!titleShape) paddingY -= 7;
        }
        paddingX += 10;
      }

      page *= width;
      points = [
        [ page + paddingX, paddingY ],
        [ page + paddingX - 5, paddingY - 10 ],
        [ page + paddingX + 5, paddingY - 10 ]
      ];
      textStyle = Util.mix({}, {
        x: page - 5,
        y: height + this.get('textOffset') + paddingY,
        text: this._formatItemValue(value) + '' // 以字符串格式展示
      }, this.get('textStyle'));
    }
    const hoverTextStyle = Util.mix(textStyle, this.get('hoverTextStyle'));
    if (!hoverText) { // mouse enter the legend, add hoverText
      hoverText = this.get('group').addShape('text', { attrs: hoverTextStyle });
      hoverText.set('id', 'hoverText');
    } else { // mouse move, update hoverText
      hoverText.attr(hoverTextStyle);
    }
    if (!hoverPointer) { // mouse enter the legend, add hoverPointer
      hoverPointer = this.get('group').addShape('Polygon', {
        attrs: Util.mix({
          points
        }, this.get('pointerStyle'))
      });
      hoverPointer.set('id', 'hoverPointer');
    } else { // mouse move, update hoverPointer
      hoverPointer.attr(Util.mix({
        points
      }, this.get('pointerStyle')));
    }
    this.get('canvas').draw();
  }

  deactivate() {
    const hoverPointer = this.get('group').findById('hoverPointer');
    hoverPointer && hoverPointer.destroy();
    const hoverText = this.get('group').findById('hoverText');
    hoverText && hoverText.destroy();
    this.get('canvas').draw();
  }
}

module.exports = Continuous;
