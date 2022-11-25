const CommonUtil = require('./common');
const Util = {};


CommonUtil.merge(Util, CommonUtil, {
  isColorProp(k) {
    // 是否是颜色属性
    return [ 'fill', 'stroke', 'fillStyle', 'strokeStyle' ].includes(k);
  },
  isGradientColor(v) {
    // 是否是渐变色
    return /^[r,R,L,l]{1}[\s]*\(/.test(v);
  },
  mixin(c, mixins) {
    const Param = c.CFG ? 'CFG' : 'ATTRS';
    if (c && mixins) {
      c._mixins = mixins;
      c[Param] = c[Param] || {};
      const temp = {};
      Util.each(mixins, function(mixin) {
        Util.augment(c, mixin);
        const attrs = mixin[Param];
        if (attrs) {
          Util.merge(temp, attrs);
        }
      });
      c[Param] = Util.merge(temp, c[Param]);
    }
  }
});

module.exports = Util;
