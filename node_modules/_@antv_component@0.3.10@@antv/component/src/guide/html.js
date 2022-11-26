const Util = require('../util');
const DomUtil = Util.DomUtil;
const Guide = require('./base');

class Html extends Guide {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      name: 'html',
      zIndex: 7,
      position: null,
      /**
       * Horizontal alignment, can be 'left'、'middle'、'right'
       * @type {String}
       */
      alignX: 'middle',
      /**
       * vertical alignment, can be 'top'、'middle'、'bottom'
       * @type {String}
       */
      alignY: 'middle',
      /**
       * Horizontal offset
       * @type {Number}
       */
      offsetX: null,
      /**
       * Vertical offset
       * @type {Number}
       */
      offsetY: null,
      /**
      * html content
      *@type {String | Function}
      */
      html: null
    });
  }

  /**
   * render Html Guide
   * @override
   * @param {Coordinate} coord the instance of Coordinate class
   * @param {Container} container the container which contain the guide component
   */
  render(coord, container) {
    const self = this;
    const position = self.parsePoint(coord, self.get('position'));
    if (!position) {
      return;
    }
    const parentNode = container.get('canvas').get('el').parentNode;
    const wrapperNode = DomUtil.createDom('<div class="g-guide"></div>');
    parentNode.appendChild(wrapperNode);

    let html = self.get('htmlContent') || self.get('html');
    if (Util.isFunction(html)) {
      const xScales = self.get('xScales');
      const yScales = self.get('yScales');
      html = html(xScales, yScales);
    }
    const htmlNode = DomUtil.createDom(html);
    wrapperNode.appendChild(htmlNode);

    DomUtil.modifyCSS(wrapperNode, {
      position: 'absolute' // to fix dom in the document stream to get the true width
    });

    self._setDomPosition(wrapperNode, htmlNode, position);
    self.set('el', wrapperNode);

  }

  _setDomPosition(parentDom, childDom, point) {
    const self = this;
    const alignX = self.get('alignX');
    const alignY = self.get('alignY');
    const domWidth = DomUtil.getOuterWidth(childDom);
    const domHeight = DomUtil.getOuterHeight(childDom);

    const position = {
      x: point.x,
      y: point.y
    };

    if (alignX === 'middle' && alignY === 'top') {
      position.x -= Math.round(domWidth / 2);
    } else if (alignX === 'middle' && alignY === 'bottom') {
      position.x -= Math.round(domWidth / 2);
      position.y -= Math.round(domHeight);
    } else if (alignX === 'left' && alignY === 'bottom') {
      position.y -= Math.round(domHeight);
    } else if (alignX === 'left' && alignY === 'middle') {
      position.y -= Math.round(domHeight / 2);
    } else if (alignX === 'left' && alignY === 'top') {
      position.x = point.x;
      position.y = point.y;
    } else if (alignX === 'right' && alignY === 'bottom') {
      position.x -= Math.round(domWidth);
      position.y -= Math.round(domHeight);
    } else if (alignX === 'right' && alignY === 'middle') {
      position.x -= Math.round(domWidth);
      position.y -= Math.round(domHeight / 2);
    } else if (alignX === 'right' && alignY === 'top') {
      position.x -= Math.round(domWidth);
    } else { // 默认位于中心点
      position.x -= Math.round(domWidth / 2);
      position.y -= Math.round(domHeight / 2);
    }

    const offsetX = self.get('offsetX');
    if (offsetX) {
      position.x += offsetX;
    }
    const offsetY = self.get('offsetY');
    if (offsetY) {
      position.y += offsetY;
    }

    DomUtil.modifyCSS(parentDom, {
      top: Math.round(position.y) + 'px',
      left: Math.round(position.x) + 'px',
      visibility: 'visible',
      zIndex: self.get('zIndex')
    });
  }

  /**
   * clear html guide
   * @override
   */
  clear() {
    const self = this;
    const el = self.get('el');
    el && el.parentNode && el.parentNode.removeChild(el);
  }
}

module.exports = Html;
