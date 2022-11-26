# contour_plot

A D3 plugin to draw contour plots of 2D functions.

Uses the marching squares algorithm from d3.geom.contour to generate contour lines.

This project is a work in progress, and not ready for public consumption. Notably this doesn't
generate 

## Installing

If you use NPM, `npm install contour_plot`. Otherwise, download the [latest
release](https://github.com/benfred/contour_plot/releases/latest).

## Example

Draw the [Goldstein Price](https://en.wikipedia.org/wiki/File:Goldstein_Price_function.pdf) function:

```javascript
function goldsteinPrice(x, y) {
    return (1. + Math.pow(x + y + 1, 2) *
    (19 - 14*x + 3*x*x - 14 * y + 6 * x * x + 3 * y * y))
    * (30 + Math.pow(2*x-3*y, 2)*(18 - 32*x + 12 * x * x + 48*y - 36 * x * y + 27 * y* y));
}

var plot = contour_plot.ContourPlot()
    .f(goldsteinPrice)
    .drawAxis(true)
    .xDomain([-2, 2])
    .yDomain([1, -2])
    .colourRange(["white", "green"]);

var elements = plot(d3.select("#contour_graph"));
```

Should produce something like:

![Example](https://github.com/benfred/contour_plot/raw/master/image.png)

