const Util = require('../util');
const DomUtil = Util.DomUtil;
const Component = require('../component');
const positionAdjust = require('./utils/position-adjust');
const spirialAdjust = require('./utils/spiral-adjust');
const bboxAdjust = require('./utils/bbox-adjust');

const LAYOUTS = {
  scatter: positionAdjust,
  map: spirialAdjust,
  treemap: bboxAdjust
};

class Label extends Component {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      name: 'label',
      /**
       * label类型
       * @type {(String)}
       */
      type: 'default',
      /**
       * 默认文本样式
       * @type {Array}
       */
      textStyle: null,
      /**
       * 文本显示格式化回调函数
       * @type {Function}
       */
      formatter: null,
      /**
       * 显示的文本集合
       * @type {Array}
       */
      items: null,
      /**
       * 是否使用html渲染label
       * @type {String}
       */
      useHtml: false,
      /**
       * html 渲染时用的容器的模板，必须存在 class = "g-labels"
       * @type {String}
       */
      containerTpl: '<div class="g-labels" style="position:absolute;top:0;left:0;"></div>',
      /**
       * html 渲染时单个 label 的模板，必须存在 class = "g-label"
       * @type {String}
       */
      itemTpl: '<div class="g-label" style="position:absolute;">{text}</div>',
      /**
       * label牵引线定义
       * @type {String || Object}
       */
      labelLine: false,
      /**
       * label牵引线容器
       * @type Object
       */
      lineGroup: null,
      /**
       * 需添加label的shape
       * @type Object
       */
      shapes: null,
      /**
       * 默认为true。为false时指定直接用items渲染文本，不进行config
       * @type Object
       */
      config: true,
      /**
       * 是否进行拾取
       * @type Object
       */
      capture: true
    });
  }

  /*
   * 清空label容器
   */
  clear() {
    const group = this.get('group');
    const container = this.get('container');
    if (group && !group.get('destroyed')) {
      group.clear();
    }
    if (container) {
      container.innerHTML = '';
    }
    super.clear();
  }

  /**
   * 销毁group
   */
  destroy() {
    const group = this.get('group');
    const container = this.get('container');
    if (!group.destroy) {
      group.destroy();
    }
    if (container) {
      container.parentNode && container.parentNode.removeChild(container);
    }
    super.destroy(); // 要最后调用 super.destroy 否则 get 属性会无效
  }

  /**
   * label绘制全过程
   */
  render() {
    this.clear();
    this._init();
    this.beforeDraw();
    this.draw();
    this.afterDraw();
  }

  _dryDraw() {
    const self = this;
    const items = self.get('items');
    const children = self.getLabels();
    const count = children.length;
    Util.each(items, (item, index) => {
      if (index < count) {
        const label = children[index];
        self.changeLabel(label, item);
      } else {
        const labelShape = self._addLabel(item, index);
        if (labelShape) {
          labelShape._id = item._id;
          labelShape.set('coord', item.coord);
        }
      }
    });
    for (let i = count - 1; i >= items.length; i--) {
      children[i].remove();
    }
    self._adjustLabels();
    if (self.get('labelLine') || (!self.get('config'))) {
      self.drawLines();
    }
  }

  /**
   * 更新label
   * 1. 将items与group中的children对比，更新/新增/删除labels
   * 2. labels布局优化
   * 3. 画label连接线
   * 4. 绘制到画布
   */
  draw() {
    this._dryDraw();
    this.get('canvas').draw();
  }

  /*
   * 更新label
   * oldLabel shape或label dom
   * newLabel label data
   * index items中的下标
   */
  changeLabel(oldLabel, newLabel) {
    if (!oldLabel) {
      return;
    }
    if (oldLabel.tagName) {
      const node = this._createDom(newLabel);
      oldLabel.innerHTML = node.innerHTML;
      this._setCustomPosition(newLabel, oldLabel);
    } else {
      oldLabel._id = newLabel._id;
      oldLabel.attr('text', newLabel.text);
      if (oldLabel.attr('x') !== newLabel.x || oldLabel.attr('y') !== newLabel.y) {
        oldLabel.resetMatrix();
        if (newLabel.textStyle.rotate) {
          oldLabel.rotateAtStart(newLabel.textStyle.rotate);
          delete newLabel.textStyle.rotate;
        }
        oldLabel.attr(newLabel);
      }
    }
  }

  /**
   * 显示label
   */
  show() {
    const group = this.get('group');
    const container = this.get('container');
    if (group) {
      group.show();
    }
    if (container) {
      container.style.opacity = 1;
    }
  }
  /**
   * 隐藏label
   */
  hide() {
    const group = this.get('group');
    const container = this.get('container');
    if (group) {
      group.hide();
    }
    if (container) {
      container.style.opacity = 0;
    }
  }

  /**
   * 画label连接线
   */
  drawLines() {
    const self = this;
    const lineStyle = self.get('labelLine');
    if (typeof lineStyle === 'boolean') {
      self.set('labelLine', {});
    }
    let lineGroup = self.get('lineGroup');
    if (!lineGroup || lineGroup.get('destroyed')) {
      lineGroup = self.get('group').addGroup({
        elCls: 'x-line-group'
      });
      self.set('lineGroup', lineGroup);
    } else {
      lineGroup.clear();
    }
    Util.each(self.get('items'), label => {
      self.lineToLabel(label, lineGroup);
    });
  }
  lineToLabel(label, lineGroup) {
    const self = this;
    if (!self.get('config') && !label.labelLine) {
      return;
    }
    const lineStyle = label.labelLine || self.get('labelLine');
    const capture = typeof label.capture === 'undefined' ? self.get('capture') : label.capture;
    let path = lineStyle.path;
    if (path && Util.isFunction(lineStyle.path)) {
      path = lineStyle.path(label);
    }
    if (!path) {
      const start = label.start || {
        x: label.x - label._offset.x,
        y: label.y - label._offset.y
      };
      path = [
        [ 'M', start.x, start.y ],
        [ 'L', label.x, label.y ]
      ];
    }
    let stroke = label.color;
    if (!stroke) {
      if (label.textStyle && label.textStyle.fill) {
        stroke = label.textStyle.fill;
      } else {
        stroke = '#000';
      }
    }
    const lineShape = lineGroup.addShape('path', {
      attrs: Util.mix({
        path,
        fill: null,
        stroke
      }, lineStyle),
      capture
    });
    // label 对应线的动画关闭
    lineShape.name = self.get('name');
    // generate labelLine id according to label id
    lineShape._id = label._id && label._id.replace('glabel', 'glabelline');
    lineShape.set('coord', self.get('coord'));
  }

  // 根据type对label布局
  _adjustLabels() {
    const self = this;
    const type = self.get('type');
    const labels = self.getLabels();
    const shapes = self.get('shapes');
    const layout = LAYOUTS[type];
    if (type === 'default' || !layout) {
      return;
    }
    layout(labels, shapes);
  }

  /**
   * 获取当前所有label实例
   * @return {Array} 当前label实例
   */
  getLabels() {
    const container = this.get('container');
    if (container) {
      return Util.toArray(container.childNodes);
    }
    return this.get('group').get('children');
  }

  // 先计算label的所有配置项，然后生成label实例
  _addLabel(item, index) {
    let cfg = item;
    if (this.get('config')) {
      cfg = this._getLabelCfg(item, index);
    }
    return this._createText(cfg);
  }
  _getLabelCfg(item, index) {
    let textStyle = this.get('textStyle') || {};
    const formatter = this.get('formatter');
    const htmlTemplate = this.get('htmlTemplate');

    if (!Util.isObject(item)) {
      const tmp = item;
      item = {};
      item.text = tmp;
    }

    if (Util.isFunction(textStyle)) {
      textStyle = textStyle(item.text, item, index);
    }

    if (formatter) {
      item.text = formatter(item.text, item, index);
    }
    if (htmlTemplate) {
      item.useHtml = true;
      if (Util.isFunction(htmlTemplate)) {
        item.text = htmlTemplate(item.text, item, index);
      }
    }

    if (Util.isNil(item.text)) {
      item.text = '';
    }

    item.text = item.text + ''; // ? 为什么转换为字符串
    const cfg = Util.mix({}, item, { textStyle }, {
      x: item.x || 0,
      y: item.y || 0
    });
    return cfg;
  }
  /**
   * label初始化，主要针对html容器
   */
  _init() {
    if (!this.get('group')) {
      const group = this.get('canvas').addGroup({ id: 'label-group' });
      this.set('group', group);
    }
  }
  initHtmlContainer() {
    let container = this.get('container');
    if (!container) {
      const containerTpl = this.get('containerTpl');
      const wrapper = this.get('canvas').get('el').parentNode;
      container = DomUtil.createDom(containerTpl);
      wrapper.style.position = 'relative';
      wrapper.appendChild(container);
      this.set('container', container);
    } else if (Util.isString(container)) {
      container = document.getElementById(container);
      if (container) {
        this.set('container', container);
      }
    }
    return container;
  }
  // 分html dom和G shape两种情况生成label实例
  _createText(config) {
    // @2018-11-29 by blue.lb 这里由于使用delete导致之后的配置无法获取到point和rotate，出现问题，深拷贝一次比较好
    let cfg = Util.deepMix({}, config);
    let container = this.get('container');
    const capture = typeof cfg.capture === 'undefined' ? this.get('capture') : cfg.capture;
    let labelShape;
    if (cfg.useHtml || cfg.htmlTemplate) {
      if (!container) {
        container = this.initHtmlContainer();
      }
      const node = this._createDom(cfg);
      container.appendChild(node);
      this._setCustomPosition(cfg, node);
    } else {
      const name = this.get('name');
      const origin = cfg.point;
      const group = this.get('group');
      delete cfg.point; // 临时解决，否则影响动画
      let rotate = cfg.rotate;
      // textStyle中的rotate虽然可以正常画出，但是在做动画的时候可能会导致动画异常。移出，在定义好shape后通过transform实现效果。
      if (cfg.textStyle) {
        if (cfg.textStyle.rotate) {
          rotate = cfg.textStyle.rotate;
          delete cfg.textStyle.rotate;
        }
        cfg = Util.mix({
          x: cfg.x,
          y: cfg.y,
          textAlign: cfg.textAlign,
          text: cfg.text
        }, cfg.textStyle);
      }
      labelShape = group.addShape('text', {
        attrs: cfg,
        capture
      });
      if (rotate) {
        // rotate是用角度定义的，转换为弧度
        if (Math.abs(rotate) > Math.PI * 2) {
          rotate = rotate / 180 * Math.PI;

        }
        labelShape.transform([
          [ 't', -cfg.x, -cfg.y ],
          [ 'r', rotate ],
          [ 't', cfg.x, cfg.y ]
        ]);
      }
      labelShape.setSilent('origin', origin || cfg);
      labelShape.name = name; // 用于事件标注
      this.get('appendInfo') && labelShape.setSilent('appendInfo', this.get('appendInfo'));
      return labelShape;
    }
  }
  _createDom(cfg) {
    const itemTpl = this.get('itemTpl');
    const str = Util.substitute(itemTpl, { text: cfg.text });
    return DomUtil.createDom(str);
  }
  // 根据文本对齐方式确定dom位置
  _setCustomPosition(cfg, htmlDom) {
    const textAlign = cfg.textAlign || 'left';
    let top = cfg.y;
    let left = cfg.x;
    const width = DomUtil.getOuterWidth(htmlDom);
    const height = DomUtil.getOuterHeight(htmlDom);

    top = top - height / 2;
    if (textAlign === 'center') {
      left = left - width / 2;
    } else if (textAlign === 'right') {
      left = left - width;
    }

    htmlDom.style.top = parseInt(top, 10) + 'px';
    htmlDom.style.left = parseInt(left, 10) + 'px';
  }
}

module.exports = Label;
