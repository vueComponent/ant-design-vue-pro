const Base = require('./base');

class Component extends Base {
  // 配置
  getDefaultCfg() {
    return {
      // 顶层标志位
      _id: null, // 用于动画
      // 容器
      canvas: null,
      container: null, // html，可选
      group: null, // G Group，可选
      // 交互属性
      capture: false,
      // props
      coord: null,
      offset: [ 0, 0 ],
      plotRange: null, // BBox
      position: [ 0, 0 ],
      visible: true,
      zIndex: 1
    };
  }

  // 基础生命周期
  _init() { }
  clear() { }
  destroy() { // 之前未指定销毁
    super.destroy();
  }

  // 绘图
  beforeRender() { }
  render() { } // 初始化、绑事件和绘图
  afterRender() { }
  beforeDraw() { }
  draw() { } // 单纯更新视图
  afterDraw() { }

  // visibility
  show() { }
  hide() { }

  // props operating syntactic sugar
  setOffset() { }
  setPosition() { }
  setVisible() { }
  setZIndex() { }
}

module.exports = Component;
