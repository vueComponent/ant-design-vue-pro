var CommonUtil = require('./common');

var Util = {};
CommonUtil.merge(Util, CommonUtil, {
  isColorProp: function isColorProp(k) {
    // 是否是颜色属性
    return ['fill', 'stroke', 'fillStyle', 'strokeStyle'].includes(k);
  },
  isGradientColor: function isGradientColor(v) {
    // 是否是渐变色
    return /^[r,R,L,l]{1}[\s]*\(/.test(v);
  },
  mixin: function mixin(c, mixins) {
    var Param = c.CFG ? 'CFG' : 'ATTRS';

    if (c && mixins) {
      c._mixins = mixins;
      c[Param] = c[Param] || {};
      var temp = {};
      Util.each(mixins, function (mixin) {
        Util.augment(c, mixin);
        var attrs = mixin[Param];

        if (attrs) {
          Util.merge(temp, attrs);
        }
      });
      c[Param] = Util.merge(temp, c[Param]);
    }
  }
});
module.exports = Util;