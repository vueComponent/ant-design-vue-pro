var groupToMap = require('./group-to-map');

var group = function group(data, condition) {
  if (!condition) {
    return [data];
  }
  var groups = groupToMap(data, condition);
  var array = [];
  for (var i in groups) {
    array.push(groups[i]);
  }
  return array;
};

module.exports = group;