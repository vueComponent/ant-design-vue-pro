var Util = require('../util/index');

var regexTags = /[MLHVQTCSAZ]([^MLHVQTCSAZ]*)/ig;
var regexDot = /[^\s\,]+/ig;
var numColorCache = {};
module.exports = {
  parseRadius: function parseRadius(radius) {
    var r1 = 0,
        r2 = 0,
        r3 = 0,
        r4 = 0;

    if (Util.isArray(radius)) {
      if (radius.length === 1) {
        r1 = r2 = r3 = r4 = radius[0];
      } else if (radius.length === 2) {
        r1 = r3 = radius[0];
        r2 = r4 = radius[1];
      } else if (radius.length === 3) {
        r1 = radius[0];
        r2 = r4 = radius[1];
        r3 = radius[2];
      } else {
        r1 = radius[0];
        r2 = radius[1];
        r3 = radius[2];
        r4 = radius[3];
      }
    } else {
      r1 = r2 = r3 = r4 = radius;
    }

    return {
      r1: r1,
      r2: r2,
      r3: r3,
      r4: r4
    };
  },
  parsePath: function parsePath(path) {
    path = path || [];

    if (Util.isArray(path)) {
      return path;
    }

    if (Util.isString(path)) {
      path = path.match(regexTags);
      Util.each(path, function (item, index) {
        item = item.match(regexDot);

        if (item[0].length > 1) {
          var tag = item[0].charAt(0);
          item.splice(1, 0, item[0].substr(1));
          item[0] = tag;
        }

        Util.each(item, function (sub, i) {
          if (!isNaN(sub)) {
            item[i] = +sub;
          }
        });
        path[index] = item;
      });
      return path;
    }
  },
  numberToColor: function numberToColor(num) {
    // 增加缓存
    var color = numColorCache[num];

    if (!color) {
      var str = num.toString(16);

      for (var i = str.length; i < 6; i++) {
        str = '0' + str;
      }

      color = '#' + str;
      numColorCache[num] = color;
    }

    return color;
  }
};