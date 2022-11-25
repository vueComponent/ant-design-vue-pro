const G = require('@antv/g/lib');
const Tooltip = require('./base');
const Util = require('../util');
const DomUtil = Util.DomUtil;
const TooltipTheme = require('./theme');
const Crosshair = require('./crosshair');
const PositionMixin = require('./mixin/position');
const MarkerGroupMixin = require('./mixin/marker-group');

const CONTAINER_CLASS = 'g2-tooltip';
const TITLE_CLASS = 'g2-tooltip-title';
const LIST_CLASS = 'g2-tooltip-list';
const MARKER_CLASS = 'g2-tooltip-marker';
const VALUE_CLASS = 'g2-tooltip-value';
const LIST_ITEM_CLASS = 'g2-tooltip-list-item';
const MARKER_SIZE = 5;
const { Marker } = G;


function find(dom, cls) {
  return dom.getElementsByClassName(cls)[0];
}

function mergeStyles(styles, cfg) {
  Object.keys(styles).forEach(function(k) {
    if (cfg[k]) {
      styles[k] = Util.mix(styles[k], cfg[k]);
    }
  });
  return styles;
}

class HtmlTooltip extends Tooltip {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
    /**
       * tooltip 容器模板
       * @type {String}
    */
      containerTpl: ' <div class="' + CONTAINER_CLASS + '"> '
      + '<div class="' + TITLE_CLASS + '"></div>'
      + '<ul class="' + LIST_CLASS + '"></ul>'
      + '</div>',
    /**
     * tooltip 列表项模板
     * @type {String}
     */
      itemTpl: `<li data-index={index}>
      <svg viewBox="0 0 ${MARKER_SIZE} ${MARKER_SIZE}" class="${MARKER_CLASS}"></svg>
      {name}<span class="${VALUE_CLASS}">{value}</span></li>`,
    /**
     * tooltip html内容
     * @type {String}
     */
      htmlContent: null,
      /**
       * tooltip 内容跟随鼠标移动
       * @type {Boolean}
       */
      follow: true,
      /**
       * 是否允许鼠标停留在 tooltip 上，默认不允许
       * @type {Boolean}
       */
      enterable: false
    });
  }

  constructor(cfg) {
    super(cfg);
    Util.assign(this, PositionMixin);
    Util.assign(this, MarkerGroupMixin);
    const style = TooltipTheme;
    this.style = mergeStyles(style, cfg);
    this._init_();
    if (this.get('items')) {
      this.render();
    }
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
  }

  _init_() {
    const self = this;
    const containerTpl = self.get('containerTpl');
    const outterNode = self.get('canvas').get('el').parentNode;
    let container;
    if (!this.get('htmlContent')) {
      if (/^\#/.test(containerTpl)) {
        // 如果传入 dom 节点的 id
        const id = containerTpl.replace('#', '');
        container = document.getElementById(id);
      } else {
        container = DomUtil.createDom(containerTpl);
        DomUtil.modifyCSS(container, self.style[CONTAINER_CLASS]);
        outterNode.appendChild(container);
        outterNode.style.position = 'relative';
      }
      self.set('container', container);
    }
  }

  render() {
    const self = this;
    self.clear();
    if (self.get('htmlContent')) {
      const outterNode = self.get('canvas').get('el').parentNode;
      const container = self._getHtmlContent();
      outterNode.appendChild(container);
      self.set('container', container);
    } else {
      self._renderTpl();
    }
  }

  _renderTpl() {
    const self = this;
    const showTitle = self.get('showTitle');
    const titleContent = self.get('titleContent');
    const container = self.get('container');
    const titleDom = find(container, TITLE_CLASS);
    const listDom = find(container, LIST_CLASS);
    const items = self.get('items');
    if (titleDom && showTitle) {
      DomUtil.modifyCSS(titleDom, self.style[TITLE_CLASS]);
      titleDom.innerHTML = titleContent;
    }
    if (listDom) {
      DomUtil.modifyCSS(listDom, self.style[LIST_CLASS]);
      Util.each(items, (item, index) => {
        listDom.appendChild(self._addItem(item, index));
      });
    }

  }

  clear() {
    const container = this.get('container');
    if (this.get('htmlContent')) {
      container && container.remove();
    } else {
      const titleDom = find(container, TITLE_CLASS);
      const listDom = find(container, LIST_CLASS);
      if (titleDom) {
        titleDom.innerHTML = '';
      }
      if (listDom) {
        listDom.innerHTML = '';
      }
    }
  }

  show() {
    const container = this.get('container');
    if (!container || this.destroyed) { // 防止容器不存在或者被销毁时报错
      return;
    }
    container.style.visibility = 'visible';
    container.style.display = 'block';
    const crosshairGroup = this.get('crosshairGroup');
    crosshairGroup && crosshairGroup.show();
    const markerGroup = this.get('markerGroup');
    markerGroup && markerGroup.show();
    super.show();
    this.get('canvas').draw();
  }

  hide() {
    const container = this.get('container');
    // relative: https://github.com/antvis/g2/issues/1221
    if (!container || this.destroyed) {
      return;
    }
    container.style.visibility = 'hidden';
    container.style.display = 'none';
    const crosshairGroup = this.get('crosshairGroup');
    crosshairGroup && crosshairGroup.hide();
    const markerGroup = this.get('markerGroup');
    markerGroup && markerGroup.hide();
    super.hide();
    this.get('canvas').draw();
  }

  destroy() {
    const self = this;
    const container = self.get('container');
    const containerTpl = self.get('containerTpl');
    if (container && !(/^\#/.test(containerTpl))) {
      container.parentNode.removeChild(container);
    }
    const crosshairGroup = this.get('crosshairGroup');
    crosshairGroup && crosshairGroup.destroy();
    const markerGroup = this.get('markerGroup');
    markerGroup && markerGroup.remove();
    super.destroy();
  }

  _getMarkerSvg(item) {
    const marker = item.marker || {};
    const symbol = marker.activeSymbol || marker.symbol;
    let method;

    if (Util.isFunction(symbol)) {
      method = symbol;
    } else if (Util.isString(symbol)) {
      method = Marker.Symbols[symbol];
    }

    method = Util.isFunction(method) ? method : Marker.Symbols.circle;

    const pathArr = method(MARKER_SIZE / 2, MARKER_SIZE / 2, MARKER_SIZE / 2);
    const path = pathArr.reduce((res, arr) => {
      return `${res}${arr[0]}${arr.slice(1).join(',')}`;
    }, '');

    return `<path d="${path}" fill="${marker.fill || 'none'}" stroke="${marker.stroke || 'none'}" />`;

  }

  _addItem(item, index) {
    const itemTpl = this.get('itemTpl'); // TODO: 有可能是个回调函数
    const itemDiv = Util.substitute(itemTpl, Util.mix({
      index
    }, item));
    const itemDOM = DomUtil.createDom(itemDiv);
    DomUtil.modifyCSS(itemDOM, this.style[LIST_ITEM_CLASS]);
    const markerDom = find(itemDOM, MARKER_CLASS);

    if (markerDom) {
      DomUtil.modifyCSS(markerDom, { ...this.style[MARKER_CLASS], borderRadius: 'unset' });

      const markerPath = this._getMarkerSvg(item);

      markerDom.innerHTML = markerPath;
    }
    const valueDom = find(itemDOM, VALUE_CLASS);
    if (valueDom) {
      DomUtil.modifyCSS(valueDom, this.style[VALUE_CLASS]);
    }
    return itemDOM;
  }

  _getHtmlContent() {
    const htmlContent = this.get('htmlContent');
    const title = this.get('titleContent');
    const items = this.get('items');
    const htmlString = htmlContent(title, items);
    const ele = DomUtil.createDom(htmlString);
    return ele;
  }

  setPosition(x, y, target) {
    const container = this.get('container');
    const outterNode = this.get('canvas').get('el');
    const viewWidth = DomUtil.getWidth(outterNode);
    const viewHeight = DomUtil.getHeight(outterNode);
    let containerWidth = container.clientWidth;
    let containerHeight = container.clientHeight;

    let endx = x;
    let endy = y;

    let position;
    const prePosition = this.get('prePosition') || { x: 0, y: 0 };
    // @2019-01-30 by blue.lb 由于display:none的元素获取clientWidth和clientHeight的值为0，这里强制显隐一下，其实直接在show和hide中去掉display设置最好，猜测为了更好的兼容浏览器
    if (!containerWidth) {
      container.style.display = 'block';
      containerWidth = container.clientWidth;
      containerHeight = container.clientHeight;
      container.style.display = 'none';
    }
    if (this.get('enterable')) {
      y = y - container.clientHeight / 2;
      position = [ x, y ];
      if (prePosition && x - prePosition.x > 0) { // 留 1px 防止鼠标点击事件无法在画布上触发
        x -= (container.clientWidth + 1);
      } else {
        x += 1;
      }
    } else if (this.get('position')) {
      // @2019-01-30 by blue.lb 这里应该是多余代码
      // const containerWidth = container.clientWidth;
      // const containerHeight = container.clientHeight;
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

    this.set('prePosition', position); // 记录上次的位置
    const follow = this.get('follow');

    if (follow) {
      container.style.left = x + 'px';
      container.style.top = y + 'px';
    }
    const crosshairGroup = this.get('crosshairGroup');
    if (crosshairGroup) {
      const items = this.get('items');
      crosshairGroup.setPosition(endx, endy, items);
    }
    super.setPosition(x, y);
  }


}

module.exports = HtmlTooltip;
