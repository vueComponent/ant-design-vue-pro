const Util = require('../util');
const Legend = require('./base');
const {
  FONT_FAMILY
} = require('../const');

// const DomUtil = Util.DomUtil;
const Event = Util.Event;
const Group = Util.Group;
// const Global = require('../../global');

// const CONTAINER_CLASS = 'g2-legend';

function findItem(items, refer) {
  let rst = null;
  const value = refer instanceof Group || refer.name === 'legendGroup' ? refer.get('value') : refer;
  Util.each(items, item => {
    if (item.value === value) {
      rst = item;
      return false;
    }
  });
  return rst;
}

function findShapeByName(group, name) {
  return group.findBy(node => {
    return node.name === name;
  });
}

class Category extends Legend {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * type标识
       * @type {String}
       */
      type: 'category-legend',
      /**
       * 子项集合
       * @type {Array}
       */
      items: null,
      /**
       * TODO：rename
       * 图例项水平方向的间距
       * @type {Number}
       */
      itemGap: 5,
      /**
       * TODO：rename
       * 图例项垂直方向的间距
       * @type {Number}
       */
      itemMarginBottom: 8,
      /**
       * 图例项图组
       * @type {Group}
       */
      itemsGroup: null,
      /**
       * 布局方式： horizontal，vertical
       * @type {String}
       */
      layout: 'horizontal',
      /**
       * 是否允许全部取消，默认 false，即必须保留一个被选中
       * @type {Boolean}
       */
      allowAllCanceled: false,
      /**
       * 边框内边距
       * @type {Array}
       */
      backPadding: [ 0, 0, 0, 0 ],
      /**
       * 图例项取消选中的颜色
       * @type {String}
       */
      unCheckColor: '#ccc',
      /**
       * 图例背景层属性设置
       * @type {Obejct}
       */
      background: {
        fill: '#fff',
        fillOpacity: 0
      },
      /**
       * 图例项的宽度，当图例有很多图例项，并且用户想要这些图例项在同一平面内垂直对齐，此时这个属性可帮用户实现此效果
       * @type {Number}
       */
      itemWidth: null,
      /**
       * 图例文字样式
       * @type {ATTRS}
       */
      textStyle: {
        fill: '#333',
        fontSize: 12,
        textAlign: 'start',
        textBaseline: 'middle',
        fontFamily: FONT_FAMILY
      },
      /**
       * marker 和文字的距离
       * @type {Number}
       */
      _wordSpaceing: 8,
      /**
       * 图例项是否可点击，默认为 true
       * @type {Boolean}
       */
      clickable: true,
      /**
       * TODO: rename
       * 图例项的选择模式，多选和单选 multiple、single
       * @type {String}
       */
      selectedMode: 'multiple',
      /**
       * 图例项的顺序是否要逆序，默认为 false
       * @type {Boolean}
       */
      reversed: false,
      /**
       * 是否自动换行
       * @type {Boolean}
       */
      autoWrap: true,
      /**
       * 是否以增加 border 的方式高亮 hover 的 item。若为 false ，则降低其他 item 的透明度。
       * @type {Boolean}
       */
      highlight: false,
      /**
       * 非highlight方式下，鼠标hover到legend样式
       * @type {Number}
       */
      activeOpacity: 0.7,
      /**
       * 非highlight方式下，非鼠标hover到的legend样式
       * @type {Number}
       */
      inactiveOpacity: 1
    });
  }

  // rendering
  render() {
    super.render();
    this._renderItems();
    this.get('autoWrap') && this._adjustItems(); // 默认自动换行
  }

  // user iteraction
  _bindEvents() {
    if (this.get('hoverable')) {
      this.get('group').on('mousemove', Util.wrapBehavior(this, '_onMousemove'));
      this.get('group').on('mouseleave', Util.wrapBehavior(this, '_onMouseleave'));
    }
    if (this.get('clickable')) {
      this.get('group').on('click', Util.wrapBehavior(this, '_onClick'));
    }
  }

  // return the target's parent legend object
  _getLegendItem(target) {
    const item = target.get('parent');
    if (item && (item.name === 'legendGroup')) {
      return item;
    }
    return null;
  }

  // activate an item by reduce the opacity of other items.
  // it is reserved for bi-direction interaction between charts / graph and legend
  activate(value) {
    const self = this;
    const itemsGroup = self.get('itemsGroup');
    const children = itemsGroup.get('children');
    let markerItem = void 0;
    children.forEach(child => {
      markerItem = findShapeByName(child, 'legend-marker');
      if (!markerItem) return;
      const checked = child.get('checked');
      if (this.get('highlight')) {
        // change stroke color
        if (child.get('value') === value && checked) {
          markerItem.attr('stroke', '#333');
        } else {
          markerItem.attr('stroke', null);
        }
      } else {
        // change opacity
        if (child.get('value') === value) {
          markerItem.attr('fillOpacity', self.get('activeOpacity'));
        }
      }
    });
    this.get('canvas').draw();
    return;
  }

  // restore the opacity of items
  // it is reserved for bi-direction interaction between charts / graph and legend
  deactivate() {
    const self = this;
    const itemsGroup = self.get('itemsGroup');
    const children = itemsGroup.get('children');
    let markerItem = void 0;
    const unCheckColor = this.get('unCheckColor');
    children.forEach(child => {
      markerItem = findShapeByName(child, 'legend-marker');
      if (!markerItem) return;
      if (this.get('highlight')) {
        let oriStroke = markerItem.get('oriStroke');
        const checked = child.get('checked');
        if (oriStroke && !checked) oriStroke = unCheckColor; else oriStroke = '';
        markerItem.attr('stroke', oriStroke);
      } else {
        markerItem.attr('fillOpacity', self.get('inactiveOpacity'));
      }
    });
    this.get('canvas').draw();
    return;
  }

  // mouse move listener of an item
  // when mouse over an item, reduce the opacity of the other items.
  _onMousemove(ev) {
    const item = this._getLegendItem(ev.currentTarget);
    if (item && item.get('checked')) {
      const items = this.get('items');
      const itemhover = new Event('itemhover', ev, true, true);
      itemhover.item = findItem(items, item);
      itemhover.checked = item.get('checked');
      itemhover.currentTarget = ev.currentTarget;

      // change the opacity of other items
      this.deactivate();
      this.activate(item.get('value'));
      this.emit('itemhover', itemhover);
    } else {
      this.deactivate();
      this.emit('itemunhover', ev);
    }
    this.get('canvas').draw();
    return;
  }

  // mouse leave listener of an item
  _onMouseleave(ev) {
    this.deactivate();
    this.get('canvas').draw();
    this.emit('itemunhover', ev);
    return;
  }

  // the click listener of an item
  _onClick(ev) {
    const clickedItem = this._getLegendItem(ev.currentTarget);
    const items = this.get('items');
    if (clickedItem && !clickedItem.get('destroyed')) {
      const checked = clickedItem.get('checked');
      const mode = this.get('selectedMode');
      const item = findItem(items, clickedItem);
      const itemclick = new Event('itemclick', ev, true, true);
      itemclick.item = item;
      itemclick.currentTarget = clickedItem;
      itemclick.appendInfo = ev.currentTarget.get('appendInfo');
      itemclick.checked = mode === 'single' ? true : !checked;
      if (!this.get('allowAllCanceled') && checked && this.getCheckedCount() === 1) {
        this.emit('clicklastitem', itemclick);
        return;
      }
      const unCheckColor = this.get('unCheckColor');
      const checkColor = this.get('textStyle').fill;
      let markerItem = void 0;
      let textItem = void 0;
      let legendItem = void 0;
      if (mode === 'single') {
        const itemsGroup = this.get('itemsGroup');
        const children = itemsGroup.get('children');
        Util.each(children, child => {
          markerItem = findShapeByName(child, 'legend-marker');
          textItem = findShapeByName(child, 'legend-text');
          legendItem = findShapeByName(child, 'legend-item');
          if (child !== clickedItem) {
            if (markerItem.attr('fill')) {
              markerItem.attr('fill', unCheckColor);
            }
            if (markerItem.attr('stroke')) {
              markerItem.attr('stroke', unCheckColor);
            }
            textItem.attr('fill', unCheckColor);
            markerItem.setSilent('checked', false);
            textItem.setSilent('checked', false);
            legendItem.setSilent('checked', false);
            child.setSilent('checked', false);
          } else {
            if (markerItem.attr('fill')) {
              item && item.marker && markerItem.attr('fill', item.marker.fill);
            }
            if (markerItem.attr('stroke')) {
              item && item.marker && markerItem.attr('stroke', item.marker.stroke);
            }
            textItem.attr('fill', checkColor);
            markerItem.setSilent('checked', true);
            textItem.setSilent('checked', true);
            legendItem.setSilent('checked', true);
            child.setSilent('checked', true);
          }
        });
      } else {
        markerItem = findShapeByName(clickedItem, 'legend-marker');
        textItem = findShapeByName(clickedItem, 'legend-text');
        legendItem = findShapeByName(clickedItem, 'legend-item');

        if (markerItem.attr('fill')) {
          item && item.marker && markerItem.attr('fill', checked ? unCheckColor : item.marker.fill);
        }
        if (markerItem.attr('stroke')) {
          item && item.marker && markerItem.attr('stroke', checked ? unCheckColor : item.marker.stroke);
        }
        textItem.attr('fill', checked ? unCheckColor : checkColor);
        clickedItem.setSilent('checked', !checked);
        markerItem.setSilent('checked', !checked);
        textItem.setSilent('checked', !checked);
        legendItem.setSilent('checked', !checked);
      }
      this.emit('itemclick', itemclick);
    }
    this.get('canvas').draw();
    return;
  }

  // render the items
  _renderItems() {
    const items = this.get('items');
    if (this.get('reversed')) {
      items.reverse();
    }
    Util.each(items, (item, index) => {
      this._addItem(item, index);
    });
    if (this.get('highlight')) {
      const itemsGroup = this.get('itemsGroup');
      const children = itemsGroup.get('children');
      let markerItem = void 0;
      children.forEach(child => {
        markerItem = findShapeByName(child, 'legend-marker');
        const oriStroke = markerItem.get('oriStroke');
        if (!oriStroke) {
          if (markerItem.attr('stroke')) markerItem.set('oriStroke', markerItem.attr('stroke')); else markerItem.set('oriStroke', '');
        }
      });
    }
  }

  // format the item value
  _formatItemValue(value) {
    const formatter = this.get('formatter') || this.get('itemFormatter');
    if (formatter) {
      value = formatter.call(this, value);
    }
    return value;
  }

  // find x of next item
  _getNextX() {
    const layout = this.get('layout');
    const itemGap = this.get('itemGap');
    const itemsGroup = this.get('itemsGroup');
    const itemWidth = this.get('itemWidth');
    const children = itemsGroup.get('children');
    let nextX = 0;

    if (layout === 'horizontal') {
      // 水平布局
      Util.each(children, v => {
        nextX += (itemWidth ? itemWidth : v.getBBox().width) + itemGap;
      });
    }
    return nextX;
  }

  // find y of next item
  _getNextY() {
    const itemMarginBottom = this.get('itemMarginBottom');
    const titleGap = this.get('titleShape') ? this.get('titleGap') : 0;
    const layout = this.get('layout');
    const itemsGroup = this.get('itemsGroup');
    const titleShape = this.get('titleShape');
    const children = itemsGroup.get('children');
    let nextY = titleGap;
    if (titleShape) {
      nextY += titleShape.getBBox().height;
    }
    if (layout === 'vertical') {
      // 竖直布局
      Util.each(children, v => {
        nextY += v.getBBox().height + itemMarginBottom;
      });
    }
    return nextY;
  }

  // add an item to the canvas
  _addItem(item) {
    const itemsGroup = this.get('itemsGroup');
    const x = this._getNextX();
    const y = this._getNextY();
    const unCheckColor = this.get('unCheckColor');
    const itemGroup = itemsGroup.addGroup({
      x,
      y,
      value: item.value,
      checked: item.checked
    });

    // @2018-10-20 by blue.lb 需要设置viewId，否则在emit的时候，parent获取不到viewId
    itemGroup.set('viewId', this.get('viewId'));
    const textStyle = this.get('textStyle');
    const wordSpace = this.get('_wordSpaceing');
    let startX = 0;

    if (item.marker) {
      // 如果有marker添加marker
      const markerAttrs = Util.mix({}, item.marker, {
        x: item.marker.radius + x,
        y
      });

      if (!item.checked) {
        if (markerAttrs.fill) {
          markerAttrs.fill = unCheckColor;
        }
        if (markerAttrs.stroke) {
          markerAttrs.stroke = unCheckColor;
        }
      }

      const markerShape = itemGroup.addShape('marker', {
        type: 'marker',
        attrs: markerAttrs
      });
      markerShape.attr('cursor', 'pointer');
      markerShape.name = 'legend-marker';
      startX += markerShape.getBBox().width + wordSpace;
    }
    const textAttrs = Util.mix({}, {
      fill: '#333',
      fontSize: 12,
      textAlign: 'start',
      textBaseline: 'middle',
      fontFamily: FONT_FAMILY
    }, textStyle, {
      x: startX + x,
      y,
      text: this._formatItemValue(item.value)
    });
    if (!item.checked) {
      Util.mix(textAttrs, {
        fill: unCheckColor
      });
    }
    const textShape = itemGroup.addShape('text', {
      attrs: textAttrs
    });
    textShape.attr('cursor', 'pointer');
    textShape.name = 'legend-text';
    this.get('appendInfo') && textShape.setSilent('appendInfo', this.get('appendInfo'));

    // 添加一个包围矩形，用于事件支持
    const bbox = itemGroup.getBBox();
    const itemWidth = this.get('itemWidth');
    const wrapperShape = itemGroup.addShape('rect', {
      attrs: {
        x,
        y: y - bbox.height / 2,
        fill: '#fff',
        fillOpacity: 0,
        width: itemWidth || bbox.width,
        height: bbox.height
      }
    });
    wrapperShape.attr('cursor', 'pointer');
    wrapperShape.setSilent('origin', item); // 保存图例项相关的数据，便于事件操作
    wrapperShape.name = 'legend-item';
    this.get('appendInfo') && wrapperShape.setSilent('appendInfo', this.get('appendInfo'));
    itemGroup.name = 'legendGroup';
    return itemGroup;
  }

  // auto break the line for horizontal layout
  _adjustHorizontal() {
    const itemsGroup = this.get('itemsGroup');
    const children = itemsGroup.get('children');
    const maxLength = this.get('maxLength');
    const itemGap = this.get('itemGap');
    const itemMarginBottom = this.get('itemMarginBottom');
    const titleGap = this.get('titleShape') ? this.get('titleGap') : 0;
    let row = 0;
    let rowLength = 0;
    let width = void 0;
    let height = void 0;
    let box = void 0;
    const itemWidth = this.get('itemWidth');
    if (itemsGroup.getBBox().width > maxLength) {
      Util.each(children, child => {
        box = child.getBBox();
        width = itemWidth || box.width;
        height = box.height + itemMarginBottom;

        if (maxLength - rowLength < width) {
          row++;
          rowLength = 0;
        }
        child.move(rowLength, row * height + titleGap);
        rowLength += width + itemGap;
      });
    }
    return;
  }

  // auto break the column for vertical layout
  _adjustVertical() {
    const itemsGroup = this.get('itemsGroup');
    const titleShape = this.get('titleShape');
    const children = itemsGroup.get('children');
    const maxLength = this.get('maxLength'); // 垂直布局，则 maxLength 代表容器的高度
    const itemGap = this.get('itemGap');
    const itemMarginBottom = this.get('itemMarginBottom');
    const titleGap = this.get('titleGap');
    const titleHeight = titleShape ? titleShape.getBBox().height + titleGap : 0;
    const itemWidth = this.get('itemWidth');
    let colLength = titleHeight;
    let width = void 0;
    let height = void 0;
    let box = void 0;
    let maxItemWidth = 0;
    let totalLength = 0;

    if (itemsGroup.getBBox().height > maxLength) {
      Util.each(children, v => {
        box = v.getBBox();
        width = box.width;
        height = box.height;

        if (itemWidth) {
          maxItemWidth = itemWidth + itemGap;
        } else if (width > maxItemWidth) {
          maxItemWidth = width + itemGap;
        }

        if (maxLength - colLength < height) {
          colLength = titleHeight;
          totalLength += maxItemWidth;
          v.move(totalLength, titleHeight);
        } else {
          v.move(totalLength, colLength);
        }

        colLength += height + itemMarginBottom;
      });
    }
    return;
  }

  // automatically break the line / column while the width / height exceeds maxLength
  _adjustItems() {
    const layout = this.get('layout');
    if (layout === 'horizontal') {
      this._adjustHorizontal();
    } else {
      this._adjustVertical();
    }
  }

  getWidth() {
    return super.getWidth();
  }

  getHeight() {
    return super.getHeight();
  }

  move(x, y) {
    super.move(x, y);
  }
}

module.exports = Category;
