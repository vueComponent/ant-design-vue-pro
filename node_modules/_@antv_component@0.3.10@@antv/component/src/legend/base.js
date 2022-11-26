
const Util = require('../util');
const Component = require('../component');
const {
  FONT_FAMILY
} = require('../const');

class Legend extends Component {
  getDefaultCfg() {
    return {
      /**
       * Group 容器
       * @type {Object}
       */
      container: null,
      /**
       * 图例标题配置
       * @type {Object}
       */
      title: null,
      /**
       * 图例项文本格式化
       * @type {Function}
       */
      formatter: null,
      /**
       * 鼠标 hover 到图例上的默认交互是否开启
       * @type {Boolean}
       */
      hoverable: true,
      /**
       * TODO：rename
       * 图例标题距离图例项的距离
       * @type {Number}
       */
      titleGap: 15,
      /**
       * legend 相对于 container 的位置
       * @type {Array}
       */
      position: [ 0, 0 ],
      /**
       * legend 在 position 位置上的偏移量
       * @type {Array}
       */
      offset: [ 0, 0 ],
      /**
       * legend 在 position 位置上沿 x 轴的偏移量。若同时设置了 offset 和 offsetX， 以 offsetX 为准
       * @type {Number}
       */
      offsetX: null,
      /**
       * legend 在 position 位置上沿 y 轴的偏移量。若同时设置了 offset 和 offsetY， 以 offsetY 为准
       * @type {Number}
       */
      offsetY: null
    };
  }
  constructor(cfg) {
    super(cfg);
    this._init();
    this.beforeRender();
    this.render();
    this._adjustPositionOffset();
    this._bindEvents();
  }

  _init() {
    let group = this.get('group');
    const container = this.get('container');
    this.set('canvas', container.get('canvas'));
    const position = this.get('position');
    if (!group) group = container.addGroup({ x: 0 - position[0], y: 0 - position[1] });
    this.set('group', group);
  }

  _adjustPositionOffset() {
    const position = this.get('position');
    let offset = this.get('offset');
    const offsetX = this.get('offsetX');
    const offsetY = this.get('offsetY');
    if (!Util.isArray(offset)) {
      const layout = this.get('layout');
      offset = layout === 'vertical' ? [ offset, 0 ] : [ 0, offset ];
    }
    if (offsetX) offset[0] = offsetX;
    if (offsetY) offset[1] = offsetY;
    const bbox = this.get('group').getBBox();
    this.move(-bbox.minX + position[0] + offset[0], -bbox.minY + position[1] + offset[1]);
  }

  beforeRender() {
    const group = this.get('group');
    const itemsGroup = group.addGroup();
    this.set('itemsGroup', itemsGroup);
  }

  render() {
    this._renderTitle();
  }

  // render the title of the legend
  _renderTitle() {
    const title = this.get('title');
    let titleGap = this.get('titleGap');
    titleGap = titleGap || 0;
    if (title && title.text) {
      const group = this.get('group');
      const titleShape = group.addShape('text', {
        attrs: Util.mix({
          x: 0,
          y: 0 - titleGap,
          fill: '#333',
          textBaseline: 'middle',
          fontFamily: FONT_FAMILY
        }, title)
      });
      titleShape.name = 'legend-title';
      this.get('appendInfo') && titleShape.setSilent('appendInfo', this.get('appendInfo'));
      this.set('titleShape', titleShape);
    }
  }

  // return the count of checked items
  getCheckedCount() {
    const itemsGroup = this.get('itemsGroup');
    const items = itemsGroup.get('children');
    const checkedArr = Util.filter(items, item => {
      return item.get('checked');
    });
    return checkedArr.length;
  }

  // set items for the legend
  setItems(items) {
    this.set('items', items);
    this.clear();
    this.render();
  }

  // add an item into the legend
  addItem(item) {
    const items = this.get('items');
    items.push(item);
    this.clear();
    this.render();
  }

  // clear all the items of the legend
  clear() {
    const itemsGroup = this.get('itemsGroup');
    itemsGroup.clear();
    const group = this.get('group');
    group.clear();
    this.beforeRender();
  }

  // destroy the legend
  destroy() {
    const group = this.get('group');
    group && group.destroy();
    this._attrs = {};
    this.removeAllListeners();
    super.destroy(); // 要最后调用 super.destroy 否则 get 属性会无效
  }

  // return the width of the legend
  getWidth() {
    const bbox = this.get('group').getBBox();
    return bbox.width;
  }

  // return the height of the legend
  getHeight() {
    const bbox = this.get('group').getBBox();
    return bbox.height;
  }

  move(x, y) {
    this.get('group').move(x, y);
  }

  draw() {
    this.get('canvas').draw();
  }
}

module.exports = Legend;
