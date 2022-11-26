
var p2s = /,?([a-z]),?/gi;

module.exports = function parsePathArray(path) {
  return path.join(',').replace(p2s, '$1');
};