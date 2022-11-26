var point = require('../');
var pts = point(process.argv.slice(3).join(' '));
var t = Number(process.argv[2]);
console.log(pts.at(t));
