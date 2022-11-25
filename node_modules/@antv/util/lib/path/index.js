
var pathIntersection = require('./path-intersection');
var path2absolute = require('./path2absolute');
var path2curve = require('./path2curve');
var catmullRom2Bezier = require('./catmull-rom2bezier');

module.exports = {
  catmullRom2Bezier: catmullRom2Bezier,
  catmullRomToBezier: catmullRom2Bezier,
  fillPath: require('./fill-path'),
  fillPathByDiff: require('./fill-path-by-diff'),
  formatPath: require('./format-path'),
  intersection: pathIntersection,
  pathIntersection: pathIntersection,
  parsePathArray: require('./parse-path-array'),
  parsePathString: require('./parse-path-string'),
  pathToAbsolute: path2absolute,
  path2absolute: path2absolute,
  pathTocurve: path2curve,
  path2curve: path2curve,
  rectPath: require('./rect-path')
};