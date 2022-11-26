const groupToMap = require('./group-to-map');

const group = function(data, condition) {
  if (!condition) {
    return [ data ];
  }
  const groups = groupToMap(data, condition);
  const array = [];
  for (const i in groups) {
    array.push(groups[i]);
  }
  return array;
};

module.exports = group;
