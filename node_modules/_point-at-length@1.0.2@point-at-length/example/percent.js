var point = require('../');
var pts = point(process.argv.slice(2).join(' '));

var len = pts.length();

for (var i = 0; i <= 10; i++) {
    console.log(i / 10, pts.at(i / 10 * len));
}
