const Component = require('../base');
const Util = require('../util');

class Tooltip extends Component {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * tooltip container
       * @type {Dom / String}
       */
      /**
       * 右下角坐标
       * @type {Number}
       */
      x: 0,
      /**
       * y 右下角坐标
       * @type {Number}
       */
      y: 0,
      /**
       * tooltip 记录项
       * @type {Array}
       */
      items: null,
      /**
       * tooltip 标题
       * @type {Array}
       */
      titleContent: null,
      /**
       * 是否展示 title
       * @type {Boolean}
       */
      showTitle: true,
      /**
       * 视图范围
       * @type {Object}
       */
      plotRange: null,
      /**
       * x轴上，移动到位置的偏移量
       * @type {Number}
       */
      offset: 10, // TODO:支持xy两个方向上的offset
      /**
       * 时间戳
       * @type {Number}
       */
      timeStamp: 0,
      /**
       * 将 tooltip 展示在指定区域内
       * @type {Boolean}
       */
      inPlot: true,
      /**
       * tooltip 辅助线配置
       * @type {Object}
       */
      crosshairs: null
    });
  }

  isContentChange(title, items) {
    const titleContent = this.get('titleContent');
    const lastItems = this.get('items');
    let isChanged = !(title === titleContent && lastItems.length === items.length);
    if (!isChanged) {
      Util.each(items, (item, index) => {
        const preItem = lastItems[index];
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            if (!Util.isObject(item[key]) && item[key] !== preItem[key]) {
              isChanged = true;
              break;
            }
          }
        }
        if (isChanged) {
          return false;
        }
      });
    }

    return isChanged;
  }

  setContent(title, items) {
    const timeStamp = (new Date()).valueOf();
    this.set('items', items);
    this.set('titleContent', title);
    this.set('timeStamp', timeStamp);
    this.render();
    return this;
  }

  setPosition(x, y) {
    this.set('x', x);
    this.set('y', y);
  }

  render() {

  }

  clear() {

  }

  show() {
    this.set('visible', true);
  }

  hide() {
    this.set('visible', false);
  }
}

module.exports = Tooltip;
