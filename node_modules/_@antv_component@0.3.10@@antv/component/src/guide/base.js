const Util = require('../util');
const Helper = require('./util/helper');
const Component = require('../component');

const KEYWORDS = [ 'min', 'max', 'median', 'start', 'end' ];

class Guide extends Component {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      xScales: null,
      yScales: null,
      el: null
    });
  }

  render() {}

  /**
   * clear container
   * @override
   */
  clear() {
    const self = this;
    const el = self.get('el');
    el && el.remove();
    this.set('el', null);
  }

  destroy() {
    this.clear();
    super.destroy();
  }

  /**
   * show or hide
   * @protected
   * @param {Boolean} visible true means show, false means hide
   */
  changeVisible(visible) {
    const self = this;
    self.set('visible', visible);
    const el = self.get('el');

    if (!el) return;
    if (el.set) {
      el.set('visible', visible);
    } else {
      el.style.display = visible ? '' : 'none';
    }
  }

  /**
   * calculate the canvas coordinate value
   * @protected
   * @param  {Coordinate} coord  the instance of Coordinate class
   * @param  {Object | Array | Function} position the value need to convert
   * @return {Object} return the result
   */
  parsePoint(coord, position) {
    const self = this;
    const xScales = self.get('xScales');
    const yScales = self.get('yScales');
    if (Util.isFunction(position)) {
      position = position(xScales, yScales);
    }

    let x;
    let y;

    // 如果数据格式是 ['50%', '50%'] 的格式
    if (Util.isArray(position) && Util.isString(position[0]) && position[0].indexOf('%') !== -1) {
      return this._parsePercentPoint(coord, position);
    }

    if (Util.isArray(position)) { // Array，suuport for mixing of keyword, percent and value
      x = self._getNormalizedValue(position[0], Helper.getFirstScale(xScales));
      y = self._getNormalizedValue(position[1], Helper.getFirstScale(yScales));
    } else {
      for (const field in position) {
        const value = position[field];
        if (xScales[field]) {
          x = self._getNormalizedValue(value, xScales[field]);
        }

        if (yScales[field]) {
          y = self._getNormalizedValue(value, yScales[field], 'y');
        }
      }
    }

    if (!Util.isNil(x) && !Util.isNil(y) && !isNaN(x) && !isNaN(y)) {
      return coord.convert({
        x,
        y
      });
    }
    return null;
  }

  /**
   * Normalized the value
   * @param  {String | Number} val   param
   * @param  {Scale} scale the instance of Scale
   * @return {Number}       return the normalized value
   */
  _getNormalizedValue(val, scale) {
    let result;
    if (Util.indexOf(KEYWORDS, val) !== -1) { // keyword
      let scaleValue;
      if (val === 'start') { // the start of coordinate
        result = 0;
      } else if (val === 'end') {
        result = 1;
      } else if (val === 'median') {
        scaleValue = scale.isCategory ? (scale.values.length - 1) / 2 : (scale.min + scale.max) / 2;
        result = scale.scale(scaleValue);
      } else {
        if (scale.isCategory) {
          scaleValue = (val === 'min') ? 0 : (scale.values.length - 1);
        } else {
          scaleValue = scale[val];
        }
        result = scale.scale(scaleValue);
      }
    } else { // 数值
      result = scale.scale(val);
    }

    return result;
  }

  _parsePercentPoint(coord, position) {
    const xPercent = parseFloat(position[0]) / 100;
    const yPercent = parseFloat(position[1]) / 100;
    const { start, end } = coord;
    const topLeft = {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y)
    };
    const x = coord.width * xPercent + topLeft.x;
    const y = coord.height * yPercent + topLeft.y;
    return {
      x,
      y
    };
  }

}

module.exports = Guide;
