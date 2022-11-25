# point-at-length

compute a point from an svg path string

This is like `path.getPointAtLength(t)` for an svg `<path>` element, but works
in node + browsers.

If you're in the browser, it's best to use the native svg implementation since
that will be faster and more accurate.

[![build status](https://secure.travis-ci.org/substack/point-at-length.png)](http://travis-ci.org/substack/point-at-length)

# example

``` js
var point = require('point-at-length');
var pts = point(process.argv.slice(2).join(' '));

var len = pts.length();

for (var i = 0; i <= 10; i++) {
    console.log(i / 10, pts.at(i / 10 * len));
}
```

and then given an svg path:

```                                                                       |
$ node percent.js m 340.0802,61.38651 c -40.2898,8.22791 \
  -62.56591,65.81112 -49.74004,128.6158 12.82587,62.80467 \
  55.90207,107.07364 96.19186,98.84572 40.2898,-8.22791 \
  62.55966,-65.84175 49.73379,-128.64642 C 423.43994,97.39694 \
  380.36999,53.15859 340.0802,61.38651 z m 12.91104,8.55846 c \
  22.51488,-4.59795 48.14062,27.6983 57.21553,72.13556 9.0749,44.43726 \
  -1.83609,84.19498 -24.35097,88.79294 -22.51489,4.59795 \
  -48.11001,-27.70455 -57.18492,-72.14182 -9.0749,-44.43726 \
  1.80548,-84.18872 24.32036,-88.78668 z
0 [ 340.0802, 61.38651 ]
0.1 [ 286.4845903594534, 135.39847858871894 ]
0.2 [ 302.1571721534183, 238.7146891719936 ]
0.3 [ 384.5741907293933, 289.20324985412464 ]
0.4 [ 440.01448853962546, 216.81871101620578 ]
0.5 [ 424.995580315864, 113.42989532988953 ]
0.6 [ 344.0127910427327, 60.748668250007114 ]
0.7 [ 409.3069687960253, 137.94315136324377 ]
0.8 [ 387.80154792789017, 230.38180833710817 ]
0.9 [ 329.13606555255416, 160.92824115677908 ]
1 [ 352.99124, 69.94497 ]
```

# methods

``` js
var point = require('point-at-length')
```

## var pts = point(svgpath)

Create a new `pt` instance given `svgpath`,
an [svg path string](http://www.w3.org/TR/SVG11/paths.html#PathData),
or an array that matches the format returned by
[parse-svg-path](https://www.npmjs.com/package/parse-svg-path).

## pts.length()

Compute the total length of the path.

This method is based on the output of the `getTotalLength()` method of
[svg path elements](https://developer.mozilla.org/en-US/docs/Web/API/SVGPathElement).

## var xy = pts.at(len)

Compute the `[x,y]` point `xy` from a distance `len` into the geometry.

# install

With [npm](https://npmjs.org) do:

```
npm install point-at-length
```

# license

MIT
