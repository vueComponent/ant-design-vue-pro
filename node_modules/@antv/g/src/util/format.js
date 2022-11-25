const Util = require('../util/index');

const regexTags = /[MLHVQTCSAZ]([^MLHVQTCSAZ]*)/ig;
const regexDot = /[^\s\,]+/ig;

module.exports = {
  parseRadius(radius) {
    let r1 = 0,
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
      r1,
      r2,
      r3,
      r4
    };
  },
  parsePath(path) {
    path = path || [];
    if (Util.isArray(path)) {
      return path;
    }

    if (Util.isString(path)) {
      path = path.match(regexTags);
      Util.each(path, function(item, index) {
        item = item.match(regexDot);
        if (item[0].length > 1) {
          const tag = item[0].charAt(0);
          item.splice(1, 0, item[0].substr(1));
          item[0] = tag;
        }
        Util.each(item, function(sub, i) {
          if (!isNaN(sub)) {
            item[i] = +sub;
          }
        });
        path[index] = item;
      });
      return path;
    }
  }
};
