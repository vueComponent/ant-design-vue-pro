var CommonUtil = require('./common');

var Util = {};
CommonUtil.merge(Util, CommonUtil, {
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