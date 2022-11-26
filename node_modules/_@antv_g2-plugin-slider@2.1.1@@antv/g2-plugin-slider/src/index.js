/**
 * @fileOverview G2's plugin for datazoom.
 * @author sima.zhang
 */
const Range = require('./component/range');

const G2 = window && window.G2;
const { Chart, Util, G, Global } = G2;
const { Canvas } = G;
const { DomUtil } = Util;

const isNumber = val => typeof val === 'number';

class Slider {
  _initProps() {
    this.height = 26;
    this.width = 'auto'; // 默认自适应
    this.padding = Global.plotCfg.padding;
    this.container = null;
    this.xAxis = null;
    this.yAxis = null;
    // 选中区域的样式
    this.fillerStyle = {
      fill: '#BDCCED',
      fillOpacity: 0.3
    };
    // 滑动条背景样式
    this.backgroundStyle = {
      stroke: '#CCD6EC',
      fill: '#CCD6EC',
      fillOpacity: 0.3,
      lineWidth: 1
    };
    this.range = [ 0, 100 ];
    this.layout = 'horizontal';
    // 文本颜色
    this.textStyle = {
      fill: '#545454'
    };
    // 滑块的样式
    this.handleStyle = {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/QXtfhORGlDuRvLXFzpsQ.png',
      width: 5
    };
    // 背景图表的配置，如果为 false 则表示不渲染
    this.backgroundChart = {
      type: [ 'area' ], // 图表的类型，可以是字符串也可是是数组
      color: '#CCD6EC'
    };
  }

  constructor(cfg) {
    this._initProps();
    Util.deepMix(this, cfg);
    const container = this.container;
    if (!container) {
      throw new Error('Please specify the container for the Slider!');
    }
    if (Util.isString(container)) {
      this.domContainer = document.getElementById(container);
    } else {
      this.domContainer = container;
    }

    this.handleStyle = Util.mix({
      width: this.height,
      height: this.height
    }, this.handleStyle);
    if (this.width === 'auto') { // 宽度自适应
      window.addEventListener('resize', Util.wrapBehavior(this, '_initForceFitEvent'));
    }
  }

  _initForceFitEvent() {
    const timer = setTimeout(Util.wrapBehavior(this, 'forceFit'), 200);
    clearTimeout(this.resizeTimer);
    this.resizeTimer = timer;
  }

  forceFit() {
    if (!this || this.destroyed) {
      return;
    }
    const width = DomUtil.getWidth(this.domContainer);
    const height = this.height;
    if (width !== this.domWidth) {
      const canvas = this.canvas;
      canvas.changeSize(width, height); // 改变画布尺寸
      this.bgChart && this.bgChart.changeWidth(width);
      canvas.clear();
      this._initWidth();
      this._initSlider(); // 初始化滑动条
      this._bindEvent();
      canvas.draw();
    }
  }

  _initWidth() {
    let width;
    if (this.width === 'auto') {
      width = DomUtil.getWidth(this.domContainer);
    } else {
      width = this.width;
    }
    this.domWidth = width;
    const padding = Util.toAllPadding(this.padding);

    if (this.layout === 'horizontal') {
      this.plotWidth = width - padding[1] - padding[3];
      this.plotPadding = padding[3];
      this.plotHeight = this.height;
    } else if (this.layout === 'vertical') {
      this.plotWidth = this.width;
      this.plotHeight = this.height - padding[0] - padding[2];
      this.plotPadding = padding[0];
    }
  }

  render() {
    this._initWidth();
    this._initCanvas(); // 初始化 canvas
    this._initBackground(); // 初始化背景图表
    this._initSlider(); // 初始化滑动条
    this._bindEvent();
    this.canvas.draw();
  }

  changeData(data) {
    this.data = data;
    this.repaint();
  }

  destroy() {
    clearTimeout(this.resizeTimer);
    const rangeElement = this.rangeElement;
    rangeElement.off('sliderchange');
    this.bgChart && this.bgChart.destroy();
    this.canvas.destroy();
    const container = this.domContainer;
    while (container.hasChildNodes()) {
      container.removeChild(container.firstChild);
    }
    window.removeEventListener('resize', Util.getWrapBehavior(this, '_initForceFitEvent'));
    this.destroyed = true;
  }

  clear() {
    this.canvas.clear();
    this.bgChart && this.bgChart.destroy();
    this.bgChart = null;
    this.scale = null;
    this.canvas.draw();
  }

  repaint() {
    this.clear();
    this.render();
  }

  _initCanvas() {
    const width = this.domWidth;
    const height = this.height;
    const canvas = new Canvas({
      width,
      height,
      containerDOM: this.domContainer,
      capture: false
    });
    const node = canvas.get('el');
    node.style.position = 'absolute';
    node.style.top = 0;
    node.style.left = 0;
    node.style.zIndex = 3;
    this.canvas = canvas;
  }

  _initBackground() {
    const data = this.data;
    const xAxis = this.xAxis;
    const yAxis = this.yAxis;
    const scales = Util.deepMix({
      [`${xAxis}`]: {
        range: [ 0, 1 ]
      }
    }, this.scales); // 用户列定义
    if (!data) { // 没有数据，则不创建
      throw new Error('Please specify the data!');
    }
    if (!xAxis) {
      throw new Error('Please specify the xAxis!');
    }
    if (!yAxis) {
      throw new Error('Please specify the yAxis!');
    }

    const backgroundChart = this.backgroundChart;
    let type = backgroundChart.type;
    const color = backgroundChart.color;
    if (!Util.isArray(type)) {
      type = [ type ];
    }

    const padding = Util.toAllPadding(this.padding);
    const bgChart = new Chart({
      container: this.container,
      width: this.domWidth,
      height: this.height,
      padding: [ 0, padding[1], 0, padding[3] ],
      animate: false
    });
    bgChart.source(data);
    bgChart.scale(scales);
    bgChart.axis(false);
    bgChart.tooltip(false);
    bgChart.legend(false);
    Util.each(type, eachType => {
      bgChart[eachType]()
        .position(xAxis + '*' + yAxis)
        .color(color)
        .opacity(1);
    });
    bgChart.render();
    this.bgChart = bgChart;
    this.scale = this.layout === 'horizontal' ? bgChart.getXScale() : bgChart.getYScales()[0];
    if (this.layout === 'vertical') {
      bgChart.destroy();
    }
  }

  _initRange() {
    const startRadio = this.startRadio;
    const endRadio = this.endRadio;
    const start = this.start;
    const end = this.end;
    const scale = this.scale;
    let min = 0;
    let max = 1;

    // startRadio 优先级高于 start
    if (isNumber(startRadio)) {
      min = startRadio;
    } else if (start) {
      min = scale.scale(scale.translate(start));
    }

    // endRadio 优先级高于 end
    if (isNumber(endRadio)) {
      max = endRadio;
    } else if (end) {
      max = scale.scale(scale.translate(end));
    }

    const { minSpan, maxSpan } = this;
    let totalSpan = 0;
    if (scale.type === 'time' || scale.type === 'timeCat') { // 时间类型已排序
      const values = scale.values;
      const firstValue = values[0];
      const lastValue = values[values.length - 1];
      totalSpan = lastValue - firstValue;
    } else if (scale.isLinear) {
      totalSpan = scale.max - scale.min;
    }

    if (totalSpan && minSpan) {
      this.minRange = (minSpan / totalSpan) * 100;
    }

    if (totalSpan && maxSpan) {
      this.maxRange = (maxSpan / totalSpan) * 100;
    }

    const range = [ min * 100, max * 100 ];
    this.range = range;
    return range;
  }

  _getHandleValue(type) {
    let value;
    const range = this.range;
    const min = range[0] / 100;
    const max = range[1] / 100;
    const scale = this.scale;
    if (type === 'min') {
      value = this.start ? this.start : scale.invert(min);
    } else {
      value = this.end ? this.end : scale.invert(max);
    }
    return value;
  }

  _initSlider() {
    const canvas = this.canvas;
    const range = this._initRange();
    const scale = this.scale;
    const rangeElement = canvas.addGroup(Range, {
      middleAttr: this.fillerStyle,
      range,
      minRange: this.minRange,
      maxRange: this.maxRange,
      layout: this.layout,
      width: this.plotWidth,
      height: this.plotHeight,
      backgroundStyle: this.backgroundStyle,
      textStyle: this.textStyle,
      handleStyle: this.handleStyle,
      minText: scale.getText(this._getHandleValue('min')),
      maxText: scale.getText(this._getHandleValue('max'))
    });
    if (this.layout === 'horizontal') {
      rangeElement.translate(this.plotPadding, 0);
    } else if (this.layout === 'vertical') {
      rangeElement.translate(0, this.plotPadding);
    }
    this.rangeElement = rangeElement;
  }

  _bindEvent() {
    const self = this;
    const rangeElement = self.rangeElement;
    rangeElement.on('sliderchange', function(ev) {
      const range = ev.range;
      const minRatio = range[0] / 100;
      const maxRatio = range[1] / 100;
      self._updateElement(minRatio, maxRatio);
    });
  }

  _updateElement(minRatio, maxRatio) {
    const scale = this.scale;
    const rangeElement = this.rangeElement;
    const minTextElement = rangeElement.get('minTextElement');
    const maxTextElement = rangeElement.get('maxTextElement');
    const min = scale.invert(minRatio);
    const max = scale.invert(maxRatio);
    const minText = scale.getText(min);
    const maxText = scale.getText(max);
    minTextElement.attr('text', minText);
    maxTextElement.attr('text', maxText);

    this.start = min;
    this.end = max;

    if (this.onChange) {
      this.onChange({
        startText: minText,
        endText: maxText,
        startValue: min,
        endValue: max,
        startRadio: minRatio,
        endRadio: maxRatio
      });
    }
  }
}

module.exports = Slider;
