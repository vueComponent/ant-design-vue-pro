var isArray = require('../type/is-array');
var isString = require('../type/is-string');
var each = require('../each');

var regexTags = /[MLHVQTCSAZ]([^MLHVQTCSAZ]*)/ig;
var regexDot = /[^\s\,]+/ig;

module.exports = function parsePath(path) {
  path = path || [];
  if (isArray(path)) {
    return path;
  }

  if (isString(path)) {
    path = path.match(regexTags);
    each(path, function (item, index) {
      item = item.match(regexDot);
      if (item[0].length > 1) {
        var tag = item[0].charAt(0);
        item.splice(1, 0, item[0].substr(1));
        item[0] = tag;
      }
      each(item, function (sub, i) {
        if (!isNaN(sub)) {
          item[i] = +sub;
        }
      });
      path[index] = item;
    });
    return path;
  }
};