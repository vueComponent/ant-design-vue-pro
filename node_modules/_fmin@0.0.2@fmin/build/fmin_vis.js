(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.fmin_vis = global.fmin_vis || {})));
}(this, function (exports) { 'use strict';

  function LineGraph() {
      var xDomain = [-4.9, 6],
          yDomain = [0, 5],
          f = function(x) { return  Math.log(1 + Math.pow(Math.abs(x), 2+Math.sin(x))); };

      function chart(div) {
          var width = div.nodes()[0].offsetWidth,
              height = width * 0.5,
              xScale = d3.scaleLinear()
                  .domain(xDomain)
                  .range([0, width]),

              yScale = d3.scaleLinear()
                  .domain(yDomain)
                  .range([height-8, 8]);

          // create svg if not already existing
          div.selectAll("svg").data([0]).enter().append("svg");

          var svg = div.select("svg")
              .attr("width", width)
              .attr("height", height);

          var colours = d3.schemeCategory10;
          function line(f) {
              return d3.line()
                  .x(function (d) { return xScale(d); })
                  .y(function (d) { return yScale(f(d)); });
          }
          var samples = 2000;
          var data = d3.range(xDomain[0], xDomain[1], xDomain[1]/samples);

          var paths = svg.selectAll("path")
              .data([f])
              .enter()
              .append("path")
              .attr("stroke", function(d ,i) { return colours[0];})
              .attr("stroke-width", 2)
              .style("stroke-opacity", 0.8)
              .attr("fill", "None")
              .attr("d", function(f) {
                  return line(f)(data);
              });

          d3.select("body").selectAll(".tooltip").data([0]).enter().append("div")
              .attr("class", "tooltip")
              .style("font-size", "12px")
              .style("position", "absolute")
              .style("text-align", "center")
              .style("width", "128px")
              .style("height", "32px")
              .style("background", "#333")
              .style("color", "#ddd")
              .style("padding", "0px")
              .style("border", "0px")
              .style("border-radius", "8px")
              .style("opacity", "0");

          var tooltip = d3.selectAll(".tooltip");

          var linetip = svg.append("line")
              .attr("stroke-width", 1)
              .attr("stroke-opacity", 0)
              .attr("stroke", "#CCC");

          var circletip = svg.append("circle")
              .attr("stroke-opacity", 0)
              .attr("fill-opacity", 0)
              .attr("r", 3)
              .attr("stroke", "#AAA")
              .attr("fill", "#AAA");

          function showtooltip() {
              tooltip.style("opacity", 0.9);
              linetip.style("stroke-opacity", 1);
              circletip.style("fill-opacity", 1);
              tooltip.style("z-index", "");
          }

          function hidetooltip() {
              tooltip.style("z-index", -1);
              tooltip.style("opacity", 0);
              linetip.style("stroke-opacity", 0);
              circletip.style("fill-opacity", 0);
          }

          svg.attr("width", width)
             .attr("height", height)
             .on("mouseover", showtooltip)
             .on("mouseout", hidetooltip)
             .on("mousemove", function() {
                  var point = d3.mouse(this),
                      x = xScale.invert(point[0]),
                      fx = f(x),
                      y = yScale(fx);

                  if (y < 0 || y > height) {
                      hidetooltip();

                  }  else {
                      showtooltip();
                      tooltip.style("left", (d3.event.pageX) + "px")
                             .style("top", (d3.event.pageY - 44) + "px");
                      tooltip.html("x = " + x.toFixed(2) + "<br>f(x) = " + fx.toFixed(2) );

                      linetip.attr("x1", point[0])
                          .attr("x2", point[0])
                          .attr("y1", point[1])
                          .attr("y2", yScale(fx));
                      circletip.attr("cx", point[0])
                          .attr("cy", yScale(fx));
                  }
              });
          return {'svg' : svg, 'xScale' : xScale, 'yScale' : yScale};
      }

      chart.xDomain = function(_) {
          if (!arguments.length) return xDomain;
          xDomain = _;
          return chart;
      };

      chart.yDomain = function(_) {
          if (!arguments.length) return yDomain;
          yDomain = _;
          return chart;
      };

      chart.f = function(_) {
          if (!arguments.length) return f;
          f = _;
          return chart;
      };

      return chart;
  }

  function Slider(div, domain, callback, params) {
      params = params || {};
      var margin = params.margin || {right: 13, left: 10},
          height = params.height || 35,
          format = params.format || function(d) { return d + "*"; },
          width = params.width || div.nodes()[0].offsetWidth;

      div.selectAll("svg").data([0]).enter().append("svg");
      var svg = div.select("svg")
          .attr("width", width)
          .attr("height", height);

      var x = (params.scale || d3.scaleLinear())
          .domain(domain)
          .range([0, width - margin.left - margin.right])
          .clamp(true);

      var slider = svg.append("g")
          .attr("class", "slider")
          .attr("transform", "translate(" + margin.left + "," + 10 + ")");

      slider.append("line")
          .attr("class", "track")
          .attr("x1", x.range()[0])
          .attr("x2", x.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
          .attr("class", "track-inset")

        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
          .attr("class", "track-overlay");

        // ugh: stroke-width on safari of track-overlay seems messed. drag on whole svg
        // instead
        svg
          .call(d3.drag()
              .on("start.interrupt", function() { slider.interrupt(); })
              .on("start drag", function() {
                  var value = x.invert(d3.event.x);
                  handle.attr("cx", x(value));
                  callback(value);
              }));

      slider.insert("g", ".track-overlay")
          .attr("class", "ticks")
          .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(params.ticks || 5))
        .enter().append("text")
          .attr("x", x)
          .attr("text-anchor", "middle")
          .text(format);

      var handle = slider.insert("circle", ".track-overlay")
          .attr("class", "handle")
          .attr("r", 9)
          .attr("cx", x(params.initial || x.invert(0)));

      function move(value, duration) {
         handle.transition().duration(duration).attr("cx", x(value));
      }

      function change(value) {
          handle.attr("cx", x(value));
          callback(value);
      }

      return {'change': change, 'move': move};
  }

  // from http://stackoverflow.com/questions/12277776/how-to-add-drop-shadow-to-d3-js-pie-or-donut-chart
  function createDropShadowFilter(svg) {
    var defs = svg.selectAll("defs").data([0]).enter().append("defs");

    var filter = defs.append("filter")
        .attr("id", "dropshadow");

    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 0.5)
        .attr("result", "blur");

    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 1)
        .attr("dy", 1)
        .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur");

    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
  }

  function NelderMead1d(div) {
      this.div = div;
      this.graph = LineGraph();
      this.plot = null;
      this.states =[];
      this.stateIndex = 0;
      this.initial = 0;
      this.cycle = 0;
      this.params  = {'chi' : 1, 'psi' : -1, 'sigma' : 1, 'rho' : 1};

      var obj = this, graph = this.obj, params = this.params;

      div.select(".function_floor").on("click", function() {
          obj.graph.xDomain([25, 75])
              .yDomain([0, 25])
              .f(function(x) { return Math.floor(Math.abs(x-50)); });
          obj.redraw();
          obj.initialize([30]);
          div.select(".function_label").html(d3.select(this).html());
      });

      div.select(".function_smooth").on("click", function() {
          obj.graph.xDomain([-4.9, 6])
              .yDomain([0, 5])
              .f(function(x) { return  Math.log(1 + Math.pow(Math.abs(x), 2+Math.sin(x))); });
          obj.redraw();
          obj.initialize([-4.5]);
          div.select(".function_label").html(d3.select(this).html());
      });

      div.select(".function_noisy").on("click", function() {
          obj.graph.xDomain([-5, 5])
              .yDomain([0, 4])
              .f(function(x) { return (2 + Math.sin(50*x)/50) * Math.atan(x) * Math.atan(x);});
          obj.redraw();
          obj.initialize([-4.5]);
          div.select(".function_label").html(d3.select(this).html());
      });

      this.redraw();
      this.initialize([-4.5]);
      this.expansion = Slider(div.select("#expansion"), [1, 5],
              function(x) {
                  div.select("#expansionvalue").text(" = " + x.toFixed(1) + "x");
                  params.chi = x;
                  obj.initialize(obj.initial);
              },
              {'format': function(d) { return d.toFixed(1) + "x"; }, 'initial' : 1.0});

      this.contraction = Slider(div.select("#contraction"), [0.2, 1],
              function(x) {
                  div.select("#contractionvalue").text(" = " + x.toFixed(2) + "x");
                  obj.params.sigma = x;
                  obj.params.psi = -1 * x;
                  obj.initialize(obj.initial);
              },
              {'format': function(d) { return (d).toFixed(1) + "x"; }, 'initial' : 1.0});
  }

  NelderMead1d.prototype.redraw = function() {
      this.div.select("svg").data([]).exit().remove();
      this.plot = this.graph(this.div.select("#vis"));
      createDropShadowFilter(this.plot.svg);
      var obj = this;
      this.plot.svg.on("click" , function() {
          var pos = d3.mouse(this);
          obj.initialize([ obj.plot.xScale.invert(pos[0])]);
      });
  };

  NelderMead1d.prototype.initialize = function(initial) {
      // stop any previous iteration
      this.stop();

      this.initial = initial.slice();
      this.stateIndex = 0;

      var states = this.states = [], graph = this.graph;
      this.params.history = states;

      fmin.nelderMead(x => this.graph.f()(x[0]), initial, this.params);

      var lines = this.plot.svg.selectAll(".simplex_line")
          .data(this.states[0].simplex)
          .enter()
          .append("line")
          .attr("class", "simplex_line")
          .attr("stroke-opacity", 0.7)
          .attr("stroke", "red")
          .attr("stroke-width", 2);

      var circles = this.plot.svg.selectAll(".simplex_circle")
          .data(this.states[0].simplex)
          .enter()
          .append("circle")
          .attr("class", "simplex_circle")
          .style("fill", "red")
          .style("fill-opacity", 0.9)
          .attr("r", 5)
          .attr("cx", d => this.plot.xScale(d[0]))
          .attr("cy", d => this.plot.yScale(d.fx))
          .attr("filter", "url(#dropshadow)");

      this.increment(this.cycle, 1500);
  };

  NelderMead1d.prototype.stop = function() {
      this.cycle += 1;
  };

  NelderMead1d.prototype.start = function() {
      this.initialize(this.initial);
  };

  NelderMead1d.prototype.increment = function(currentCycle, duration) {
      if (this.cycle != currentCycle) {
          return;
      }
      this.div.select(".iterations").text("Iteration " + (this.stateIndex + 1) + "/" +
                      this.states.length + ", Loss=" + this.states[this.stateIndex].fx.toFixed(5));

      duration = duration || 500;
      var state = this.states[this.stateIndex].simplex;
      var lines = this.plot.svg.selectAll(".simplex_line")
         .data(state)
         .transition()
         .duration(this.stateIndex ? duration : 0)
         .attr("x1", d => this.plot.xScale(d[0]))
         .attr("y1", d => this.plot.yScale(d.fx))
         .attr("x2", (d, i) => this.plot.xScale(state[i ? i - 1 : state.length - 1][0]))
         .attr("y2", (d, i) => this.plot.yScale(state[i ? i - 1 : state.length - 1].fx));

      var circles = this.plot.svg.selectAll(".simplex_circle")
          .data(state)
          .transition()
          .duration(this.stateIndex ? duration : 0)
          .attr("cx", d => this.plot.xScale(d[0]))
          .attr("cy", d => this.plot.yScale(d.fx));

      this.stateIndex += 1;
      if (this.stateIndex >= this.states.length) {
          this.stateIndex = 0;
          duration = 5000;
      }
      this.plot.svg.transition()
          .duration(duration)
          .on("end", () => this.increment(currentCycle));
  };

  var banana = {
      'initial': [-1, -1],
      'f' : function(X) {
          var x = X[0], y = X[1];
          return (1 - x) * (1 - x) + 100 * (y - x * x) * (y - x * x);
      },

      'fprime' : function(X, fxprime) {
          fxprime = fxprime || [0, 0];
          var x = X[0], y = X[1];
          fxprime[0] = 400 * x * x * x - 400 * y * x + 2 * x - 2;
          fxprime[1] = 200 * y - 200 * x * x;
          return fxprime;
      },

      'xDomain': [-2, 2],
      'yDomain': [2, -2]
  };

  var matyas = {
      'initial': [-9.08, -7.83],

      'f' : function(X) {
          var x = X[0], y = X[1];
          return 0.26 * (x * x + y * y)  - 0.48 * x * y;

      },

      'fprime' : function(X, fxprime) {
          fxprime = fxprime || [0, 0];
          var x = X[0], y = X[1];
          fxprime[0] = 0.52 * x - 0.48 * y;
          fxprime[1] = 0.52 * y - 0.48 * x;
          return fxprime;
      },

      'xDomain': [-10, 10],
      'yDomain': [10, -10]
  };

  var himmelblau = {
      'initial': [-0.15, 0.67],
      'f': function(X) {
          var x = X[0], y = X[1];
          return (x * x + y - 11) * ( x * x + y - 11) + (x + y * y - 7) * (x + y * y - 7);
      },
      'fprime': function(X, fxprime) {
          fxprime = fxprime || [0, 0];
          var x = X[0], y = X[1];
          fxprime[0] = 4 * (x * x + y - 11) * x + 2 * (x + y * y - 7);
          fxprime[1] = 2 * (x * x + y - 11)  + 4 * (x + y * y - 7) * y;
          return fxprime;
      },
      'xDomain': [-6.1, 6],
      'yDomain': [6, -6],
      'minima' : [{x : 3.584428, y : -1.848126},
               {x : -2.805118, y : 3.131312},
               {x : -3.779310, y : -3.283186},
               {x : 3, y : 2}],
      'colourDomain' : [2, 13]
  };

  var flower = {
      'initial': [-3.5, 3.5],

      'f': function(X) {
          var x = X[0], y = X[1];
          return Math.sin(y) * x  + Math.sin(x) * y  +  x * x +  y *y;
      },

      'fprime': function(X, fxprime) {
          fxprime = fxprime || [0, 0];
          var x = X[0], y = X[1];
          fxprime[0] = Math.sin(y) + Math.cos(x) * y + 2 * x;
          fxprime[1] = Math.sin(x) + Math.cos(y) * x + 2 * y;
          return fxprime;
      },

      'xDomain': [-6, 6],
      'yDomain': [6, -6]
  };

  /** finds the zeros of a function, given two starting points (which must
   * have opposite signs */
  function bisect(f, a, b, parameters) {
      parameters = parameters || {};
      var maxIterations = parameters.maxIterations || 100,
          tolerance = parameters.tolerance || 1e-10,
          fA = f(a),
          fB = f(b),
          delta = b - a;

      if (fA * fB > 0) {
          throw "Initial bisect points must have opposite signs";
      }

      if (fA === 0) return a;
      if (fB === 0) return b;

      for (var i = 0; i < maxIterations; ++i) {
          delta /= 2;
          var mid = a + delta,
              fMid = f(mid);

          if (fMid * fA >= 0) {
              a = mid;
          }

          if ((Math.abs(delta) < tolerance) || (fMid === 0)) {
              return mid;
          }
      }
      return a + delta;
  }

  // This file is modified from the d3.geom.contour
  // plugin found here https://github.com/d3/d3-plugins/tree/master/geom/contour

  /*
  Copyright (c) 2012-2015, Michael Bostock
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  * The name Michael Bostock may not be used to endorse or promote products
    derived from this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
  BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
  OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */

  function d3_contour(grid, start) {
    var s = start || d3_geom_contourStart(grid), // starting point
        c = [],    // contour polygon
        x = s[0],  // current x position
        y = s[1],  // current y position
        dx = 0,    // next x direction
        dy = 0,    // next y direction
        pdx = NaN, // previous x direction
        pdy = NaN, // previous y direction
        i = 0;

    do {
      // determine marching squares index
      i = 0;
      if (grid(x-1, y-1)) i += 1;
      if (grid(x,   y-1)) i += 2;
      if (grid(x-1, y  )) i += 4;
      if (grid(x,   y  )) i += 8;

      // determine next direction
      if (i === 6) {
        dx = pdy === -1 ? -1 : 1;
        dy = 0;
      } else if (i === 9) {
        dx = 0;
        dy = pdx === 1 ? -1 : 1;
      } else {
        dx = d3_geom_contourDx[i];
        dy = d3_geom_contourDy[i];
      }

      // update contour polygon
      if (dx != pdx && dy != pdy) {
        c.push([x, y]);
        pdx = dx;
        pdy = dy;
      } else {
        c.push([x, y]);
      }

      x += dx;
      y += dy;
    } while (s[0] != x || s[1] != y);

    return c;
  }

  // lookup tables for marching directions
  var d3_geom_contourDx = [1, 0, 1, 1,-1, 0,-1, 1,0, 0,0,0,-1, 0,-1,NaN];
  var d3_geom_contourDy = [0,-1, 0, 0, 0,-1, 0, 0,1,-1,1,1, 0,-1, 0,NaN];
  function d3_geom_contourStart(grid) {
    var x = 0,
        y = 0;

    // search for a starting point; begin at origin
    // and proceed along outward-expanding diagonals
    while (true) {
      if (grid(x,y)) {
        return [x,y];
      }
      if (x === 0) {
        x = y + 1;
        y = 0;
      } else {
        x = x - 1;
        y = y + 1;
      }
    }
  }

  function isoline(f, value, xScale, yScale) {
      var xRange = xScale.range(), yRange = yScale.range();
      return function(x, y) {
          if ((x < xRange[0]) || (x > xRange[1]) ||
              (y < yRange[0]) || (y > yRange[1])) return false;
          return f(xScale.invert(x), yScale.invert(y)) < value;
      };
  }

  function smoothPoints(f, points, level, xScale, yScale) {
      var xRange = xScale.range(), yRange = yScale.range();
      var ySmooth = function(y) {
          return f(xScale.invert(x), yScale.invert(y)) - level;
      };
      var xSmooth = function(x) {
          return f(xScale.invert(x), yScale.invert(y)) - level;
      };
      for (var k = 0; k < points.length; ++k) {
          var point = points[k],
              x = point[0], y = point[1];

          if ((x <= xRange[0]) || (x >= xRange[1]) ||
              (y <= yRange[0]) || (y >= yRange[1])) continue;

          var currentSmooth = ySmooth(y);

          var p = {'maxIterations' : 9};
          for (var delta = 0.5; delta <= 3; delta += 0.5) {
              if (ySmooth(y - delta) * currentSmooth < 0) {
                  y = bisect(ySmooth, y, y - delta, p);
              } else if (xSmooth(x - delta) * currentSmooth < 0) {
                  x = bisect(xSmooth, x, x - delta, p);
              } else if (ySmooth(y + delta) * currentSmooth < 0) {
                  y = bisect(ySmooth, y, y + delta, p);
              } else if (xSmooth(x + delta) * currentSmooth < 0) {
                  x = bisect(xSmooth, x, x + delta, p);
              } else {
                  continue;
              }
              break;
          }

          point[0] = x;
          point[1] = y;
      }
  }

  function getLogLevels(f, xScale, yScale, count) {
      var xRange = xScale.range(), yRange = yScale.range();

      // figure out min/max values by sampling pointson a grid
      var maxValue, minValue, value;
      maxValue = minValue = f(xScale.invert(xRange[0]), yScale.invert(yRange[0]));
      for (var y = yRange[0]; y < yRange[1]+1; ++y) {
          for (var x = xRange[0]; x < xRange[1]+1; ++x) {
              value = f(xScale.invert(x),yScale.invert(y));
              minValue = Math.min(value, minValue);
              maxValue = Math.max(value, maxValue);
          }
      }

      // lets get contour lines on a log scale, keeping
      // values on an integer scale (if possible)
      var levels = [];
      var logRange = Math.log(maxValue - Math.floor(minValue));
      var base = Math.ceil(Math.exp(logRange / (count))),
                 upper = Math.pow(base, Math.ceil(logRange / Math.log(base)));

      for (var i = 0; i < count; ++i) {
          var current = Math.floor(minValue) + upper;
          if (current < minValue) {
              break;
          }
          levels.push(current);
          upper /= base;
      }

      return levels;
  }

  function getStartingPoint(lineFunc, x, y) {
      x = Math.floor(x);
      y = Math.floor(y);
      var j = 0;
      while (true) {
          j += 1;
          if (!lineFunc(x+j, y)) {
              return [x+j, y];
          }
          if (!lineFunc(x, y+j)) {
              return [x, y+j];
          }
      }
  }

  function getContours(f, xScale, yScale, count, minima) {
      // figure out even distribution in log space of values
      var levels = getLogLevels(f, xScale, yScale, count);

      // use marching squares algo from d3.geom.contour to build up a series of paths
      var ret = [];
      for (var i = 0; i < levels.length; ++i) {
          var level = levels[i];
          var lineFunc = isoline(f, level, xScale, yScale);

          var points= [];
          if (minima) {
              var initialPoints = [];
              for (var m = 0; m < minima.length; ++m) {
                  var initial = getStartingPoint(lineFunc, xScale(minima[m].x), yScale(minima[m].y));
                  var current = d3_contour(lineFunc, initial);

                    // don't add points if already seen
                    var duplicate = false;
                    for (var j = 0 ; j < current.length; ++j) {
                       var point = current[j];
                       for (var k = 0; k < initialPoints.length; ++k) {
                          var other = initialPoints[k];
                          if ((point[0] == other[0]) &&
                              (point[1] == other[1])) {
                              duplicate = true;
                              break;
                          }
                       }
                       if (duplicate) break;
                    }
                    if (duplicate) continue;

                    initialPoints.push(initial);

                    smoothPoints(f, current, level, xScale, yScale);
                    if (points.length) points.push(null);
                    points = points.concat(current);
              }
          } else {
              points = d3_contour(lineFunc);
              smoothPoints(f, points, level, xScale, yScale);

          }

          ret.push(points);
      }

      // return the contours
      return {'paths': ret, 'levels': levels};
  }

  function ContourPlot() {
      var drawAxis = false,
          f = function (x, y) { return (1 - x) * (1 - x) + 100 * (y - x * x) * ( y - x * x); },
          yDomain = [3, -3],
          xDomain = [-2, 2],
          minima = null,
          contourCount = 14,
          colourScale = d3.scaleLinear().domain([0, contourCount]).range(["white", d3.schemeCategory10[0]]);

      // todo: resolution independent (sample say 200x200)
      // todo: handle function with multiple local minima

      function chart(selection) {
          var width = selection.nodes()[0].offsetWidth,
              height = width * 0.65,
              padding = (drawAxis) ? 24 : 0,
              yScale = d3.scaleLinear()
                              .range([padding, height - padding])
                              .domain(yDomain),

              xScale = d3.scaleLinear()
                          .range([padding, width - padding])
                          .domain(xDomain);

          // create tooltip  if doesn't exist
          d3.select("body").selectAll(".contour_tooltip").data([0]).enter()
              .append("div")
              .attr("class", "contour_tooltip")
              .style("font-size", "12px")
              .style("position", "absolute")
              .style("text-align", "center")
              .style("width", "128px")
              .style("height", "32px")
              .style("background", "#333")
              .style("color", "#ddd")
              .style("padding", "0px")
              .style("border", "0px")
              .style("border-radius", "8px")
              .style("opacity", "0");

          var tooltip = d3.selectAll(".contour_tooltip");

          // create the svg element if it doesn't already exist
          selection.selectAll("svg").data([0]).enter().append("svg");
          var svg = selection.selectAll("svg").data([0]);

          svg.attr("width", width)
             .attr("height", height)
             .on("mouseover", function() {
                  tooltip.transition().duration(400).style("opacity", 0.9);
                  tooltip.style("z-index", "");
              })
             .on("mousemove", function() {
                  var point = d3.mouse(this),
                      x = xScale.invert(point[0]),
                      y = yScale.invert(point[1]),
                      fx = f(x, y);

                  tooltip.style("left", (d3.event.pageX) + "px")
                         .style("top", (d3.event.pageY - 44) + "px");

                  tooltip.html("x = " + x.toFixed(2) + " y = " + y.toFixed(2) + "<br>f(x,y) = " + fx.toFixed(2) );
              })

             .on("mouseout", function() {
                  tooltip.transition().duration(400).style("opacity", 0);
                  tooltip.style("z-index", -1);
             });

          var contours = getContours(f, xScale, yScale, contourCount, minima);
          var paths = contours.paths,
              levels = contours.levels;

          var line = d3.line()
              .x(function(d) { return d[0]; })
              .y(function(d) { return d[1]; })
              .curve(d3.curveLinearClosed)
              .defined(function(d) { return d; });

          var pathGroup = svg.append("g");

          pathGroup.selectAll("path").data(paths).enter()
              .append("path")
              .attr("d", line)
              .style("fill", function(d, i) { return colourScale(i); })
              .style("stroke-width", 1.5)
              .style("stroke", "white")
              .on("mouseover", function() {
                  d3.select(this).style("stroke-width", "4");
              })
              .on("mouseout", function() {
                  d3.select(this).style("stroke-width", "1.5");
             });

          // draw axii
          if (drawAxis) {
              var xAxis = d3.axisBottom().scale(xScale),
                  yAxis = d3.axisLeft().scale(yScale);

              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(0," + (height - 1.0 *  padding) + ")")
                  .call(xAxis);

              svg.append("g")
                  .attr("class", "axis")
                  .attr("transform", "translate(" + (padding) + ",0)")
                  .call(yAxis);
          }

          return {'xScale' : xScale, 'yScale' : yScale, 'svg' : svg};
      }
      chart.drawAxis = function(_) {
          if (!arguments.length) return drawAxis;
          drawAxis = _;
          return chart;
      };

      chart.xDomain = function(_) {
          if (!arguments.length) return xDomain;
          xDomain = _;
          return chart;
      };

      chart.yDomain = function(_) {
          if (!arguments.length) return yDomain;
          yDomain = _;
          return chart;
      };

      chart.colourScale = function(_) {
          if (!arguments.length) return colourScale;
          colourScale = _;
          return chart;
      };

      chart.contourCount = function(_) {
          if (!arguments.length) return contourCount;
          contourCount = _;
          return chart;
      };

      chart.minima = function(_) {
          if (!arguments.length) return minima;
          minima = _;
          return chart;
      };

      chart.f = function(_) {
          if (!arguments.length) return f;
          f = _;
          return chart;
      };

      return chart;
  }

  function AnimatedContour(div) {
      this.current = this.current || himmelblau;
      this.initial = this.current.initial.slice() || [1, 1];
      this.plot = null;
      this.div = div;
      this.colour = this.colour || d3.schemeCategory10[0];
      this.states =[];
      this.stateIndex = 0;
      this.cycle = 0;

      var contour = this;
      div.select(".function_flower").on("click", function() {
          contour.current = flower;
          contour.redraw();
          contour.initialize(contour.current.initial.slice());
          div.select(".function_label").html(d3.select(this).html());
      });

      div.select(".function_himmelblau").on("click", function() {
          contour.current = himmelblau;
          contour.redraw();
          contour.initialize(contour.current.initial.slice());
          div.select(".function_label").html(d3.select(this).html());
      });

      div.select(".function_banana").on("click", function() {
          contour.current = banana;
          contour.redraw();
          contour.initialize(contour.current.initial.slice());
          div.select(".function_label").html(d3.select(this).html());
          div.select(".function_label").html(d3.select(this).html());
      });

      div.select(".function_matyas").on("click", function() {
          contour.current = matyas;
          contour.redraw();
          contour.initialize(contour.current.initial.slice());
          div.select(".function_label").html(d3.select(this).html());
      });

      this.redraw();
      this.initialize(this.initial);
      this.drawControls();
  }

  AnimatedContour.prototype.redraw = function() {
      var colourDomain = this.current.colourDomain || [1, 13],
          colourScale = d3.scaleLinear().domain(colourDomain).range(["white", this.colour]);

      var plot = ContourPlot()
          .f((x,y) => this.current.f([x, y]))
          .xDomain(this.current.xDomain)
          .yDomain(this.current.yDomain)
          .minima(this.current.minima)
          .colourScale(colourScale);

      // remove old graph if there
      this.div.select("svg").data([]).exit().remove();
      this.plot = plot(this.div.select("#vis"));
      createDropShadowFilter(this.plot.svg);
      var svg = this.plot.svg, xScale = this.plot.xScale, yScale = this.plot.yScale, contour = this;
      svg.on("click" , function() {
          var pos = d3.mouse(this);
          contour.initialize([ xScale.invert(pos[0]),  yScale.invert(pos[1])]);
      });
  };

  AnimatedContour.prototype.increment = function(currentCycle, duration) {
      // hack: prevent incrementing if we've reset
      if (currentCycle != this.cycle) {
          return true;
      }

      this.displayState();
      this.div.select(".iterations").text("Iteration " + (this.stateIndex + 1) + "/" +
                      this.states.length + ", Loss=" + this.states[this.stateIndex].fx.toFixed(5));

      duration = duration || this.duration;

      this.stateIndex += 1;
      if (this.stateIndex >= this.states.length) {
          this.stateIndex = 0;
          duration = 5000;
      }

      this.plot.svg.transition()
          .duration(duration)
          .on("end", () => this.increment(currentCycle));
  };

  AnimatedContour.prototype.stop = function() {
      this.cycle += 1;
  };

  AnimatedContour.prototype.start = function() {
      this.initialize(this.initial);
  };

  function NelderMeadContour(div) {
      this.colour = d3.schemeCategory10[0];
      this.current = flower;
      this.duration = 500;
      this.params = {'chi' : 2, 'psi' : -0.5, 'sigma' : 0.5, 'rho' : 1};
      AnimatedContour.call(this, div);
  }

  NelderMeadContour.prototype = Object.create(AnimatedContour.prototype);

  NelderMeadContour.prototype.drawControls = function() {
      var obj = this, params = this.params, div = this.div;
      Slider(div.select("#expansion"), [1, 5],
              function(x) {
                  params.chi = x;
                  obj.initialize(obj.initial);
                  div.select("#expansionvalue").text(" = " + x.toFixed(1) + "x");
              },
              {'format': function(d) { return d.toFixed(1) + "x"; }, 'initial' : 2.0});

      Slider(div.select("#contraction"), [0.2, 1],
              function(x) {
                  params.sigma = x;
                  params.psi = -1 * x;
                  obj.initialize(obj.initial);
                  div.select("#contractionvalue").text(" = " + x.toFixed(2) + "x");
              },
              {'format': function(d) { return (d).toFixed(1) + "x"; },
               'initial': 0.5});
  };

  NelderMeadContour.prototype.initialize = function(initial) {
      this.stop();
      this.initial = initial.slice();
      var states = this.states = [];
      this.stateIndex = 0;
      this.params.history = states;
      fmin.nelderMead(this.current.f, initial, this.params);

      var lines = this.plot.svg.selectAll(".simplex_line").data(this.states[0].simplex);
      lines.enter()
          .append("line")
          .attr("class", "simplex_line")
          .attr("stroke-opacity", 0.7)
          .attr("stroke", "red")
          .attr("stroke-width", 2);

      var circles = this.plot.svg.selectAll("circle").data(this.states[0].simplex);

      circles.enter()
             .append("circle")
             .style("fill", "red")
             .style("fill-opacity", 0.9)
             .attr("r", 5)
             .attr("cx", d => this.plot.xScale(d[0]))
             .attr("cy", d => this.plot.yScale(d[1]))
             .attr("filter", "url(#dropshadow)");
      this.increment(this.cycle, this.duration);
  };

  NelderMeadContour.prototype.displayState = function() {
      var duration = duration || this.duration;
      var state = this.states[this.stateIndex].simplex;

      var lines = this.plot.svg.selectAll(".simplex_line")
         .data(state)
         .transition()
         .duration(this.stateIndex ? duration :0)
         .attr("x1", d => this.plot.xScale(d[0]))
         .attr("y1", d => this.plot.yScale(d[1]))
         .attr("x2", (d, i) => this.plot.xScale(state[i ? i - 1 : 2][0]))
         .attr("y2", (d, i) => this.plot.yScale(state[i ? i - 1 : 2][1]));

      var circles = this.plot.svg.selectAll("circle")
          .data(state)
          .transition()
          .duration(this.stateIndex ? duration :0)
          .attr("cx", d => this.plot.xScale(d[0]))
          .attr("cy", d => this.plot.yScale(d[1]));
  };

  function GradientContour(div) {
      this.stepSize = 0.01;
      this.colour = this.colour || d3.schemeCategory10[1];
      this.duration = this.duration || 500;
      this.enableLineSearch = false;

      AnimatedContour.call(this, div);

      var obj = this;
      div.select("#linesearchcheck").on("change", function() {
          obj.enableLineSearch =document.getElementById("linesearchcheck").checked;
          obj.initialize(obj.initial);
      });
  }

  GradientContour.prototype = Object.create(AnimatedContour.prototype);

  GradientContour.prototype.drawControls = function() {
      var obj = this;
      this.learnRate = Slider(this.div.select("#learningrate"), [0.0001, 1],
                              // TODO: why can't I just go 'this.setStepSize' here instead?
                              // feel like I fundamentally am missing something with JS
                              function(x) { return obj.setStepSize(x); },
                              {'format': function(d) { return d.toString(); },
                                'initial': this.stepSize,
                                'scale': d3.scaleLog(),
                                'ticks': 4});
  };

  GradientContour.prototype.setStepSize = function(x) {
      this.stepSize = x;
      this.initialize(this.initial);
      this.div.select("#learningratevalue").text(" = " + x.toFixed(4));
  };

  GradientContour.prototype.calculateStates = function(initial) {
      this.stateIndex = 0;
      this.states = [];
      var f = (x, fxprime) => { this.current.fprime(x, fxprime); return this.current.f(x); };

      var params = {"history": this.states, 'maxIterations' : 5000, 'learnRate' : this.stepSize};

      if (this.enableLineSearch) {
          fmin.gradientDescentLineSearch(f, initial, params);
      } else {
          fmin.gradientDescent(f, initial, params);
      }
  };

  GradientContour.prototype.initialize = function(initial) {
      this.stop();
      this.initial = initial.slice();
      this.calculateStates(initial);

      var svg = this.plot.svg, xScale = this.plot.xScale, yScale = this.plot.yScale;
      svg.selectAll(".current").data([]).exit().remove();
      var group = svg.selectAll(".current").data([this.states[0]])
          .enter()
          .append("g")
          .attr("class", "current");

      group.append("g")
          .attr("class", "under");

      group.append("g")
          .attr("class", "gradient");

      group.append("circle")
             .attr("class", "ball")
             .style("fill", "red")
             .style("fill-opacity", 0.9)
             .attr("filter", "url(#dropshadow)")
             .attr("r", 5)
             .attr("cx", function(d) { return xScale(d.x[0]); })
             .attr("cy", function(d) { return yScale(d.x[1]); });

      this.increment(this.cycle, this.duration);
  };

  GradientContour.prototype.displayState = function(){
      var state = this.states[this.stateIndex];
      var group = this.plot.svg.selectAll(".current")
                      .data([state])
          .transition()
          .duration(this.stateIndex ? this.duration :0);

      group.select(".ball")
         .attr("cx", d => this.plot.xScale(d.x[0]))
         .attr("cy", d => this.plot.yScale(d.x[1]));

      if (this.stateIndex) {
          var d = this.states[this.stateIndex-1];

          if (this.enableLineSearch) {
              this.learnRate.move(d.learnRate, this.duration);
              this.div.select("#learningratevalue").text(" = " + d.learnRate.toFixed(4));
          }

          var line = this.plot.svg.selectAll(".current .gradient").append("line")
              .attr("stroke-opacity", 0.9)
              .attr("stroke", "red")
              .attr("stroke-width", 3)
              .attr("x1", this.plot.xScale(d.x[0]))
              .attr("y1", this.plot.yScale(d.x[1]))
              .attr("x2", this.plot.xScale(d.x[0]))
              .attr("y2", this.plot.yScale(d.x[1]));

          line.transition().duration(this.duration)
             .attr("x2", this.plot.xScale(state.x[0]))
             .attr("y2", this.plot.yScale(state.x[1]));
      } else {
          this.plot.svg.selectAll(".current line").data([]).exit().remove();
      }
  };

  function ConjugateGradientContour(div) {
      this.colour = d3.schemeCategory10[2];
      this.current = banana;
      this.duration = 1000;
      GradientContour.call(this, div);
  }

  ConjugateGradientContour.prototype = Object.create(GradientContour.prototype);

  ConjugateGradientContour.prototype.drawControls = function() {
      // TODO
  };

  ConjugateGradientContour.prototype.redraw = function() {
      // add an arrow marker for the gradients
      GradientContour.prototype.redraw.call(this);
      this.plot.svg.append("marker")
          .attr("id", "arrow")
          .attr("fill", "yellow")
          .attr("fill-opacity", "1")
          .attr("viewBox", "0 0 10 10")
          .attr("refX", 0)
          .attr("refY", 5)
          .attr("markerUnits", "strokeWidth")
          .attr("markerWidth", 5)
          .attr("markerHeight", 5)
          .attr("orient", "auto")
          .append("path")
              .attr("d", "M 0 0 L 10 5 L 0 10 z");
  };

  ConjugateGradientContour.prototype.calculateStates = function(initial) {
      this.stateIndex = 0;
      this.states = [];
      var f = (x, fxprime) => { this.current.fprime(x, fxprime); return this.current.f(x); };
      fmin.conjugateGradient(f, initial, {"history": this.states});
  };

  ConjugateGradientContour.prototype.displayState = function(){
      GradientContour.prototype.displayState.call(this);
      if (this.stateIndex) {
          var d = this.states[this.stateIndex-1];
          this.plot.svg.selectAll(".current .gradient").append("line")
              .attr("stroke-opacity", 0.9)
              .attr("stroke", "yellow")
              .attr("stroke-width", 2)
              .attr("marker-end", "url(#arrow)")
              .attr("x1", this.plot.xScale(d.x[0]))
              .attr("y1", this.plot.yScale(d.x[1]))
              .attr("x2", this.plot.xScale(d.x[0] - d.alpha * d.fxprime[0]))
              .attr("y2", this.plot.yScale(d.x[1] - d.alpha * d.fxprime[1]));
      }
  };

  function LineSearchContour(div) {
      this.duration = 1000;
      this.colour = d3.schemeCategory10[1];
      this.current = matyas;
      this.params = {'c1': 1e-4,'c2': 0.5};
      GradientContour.call(this, div, true);
  }

  LineSearchContour.prototype = Object.create(GradientContour.prototype);

  LineSearchContour.prototype.drawControls = function() {
      var obj = this;
      Slider(this.div.select("#c1"), [1e-5, 1],
              function(x) {
                  obj.params.c1 = x;
                  obj.div.select("#c1value").text(" = " + x.toFixed(4));
                  obj.initialize(obj.initial);
              },
              {'format': function(d) { return d.toString(); },
                'initial': obj.params.c1,
                'scale': d3.scaleLog(),
                'ticks': 5});

      Slider(this.div.select("#c2"), [1e-5, 1],
              function(x) {
                  obj.params.c2 = x;
                  obj.div.select("#c2value").text(" = " + x.toFixed(4));
                  obj.initialize(obj.initial);
              },
              {'format': function(d) { return d.toString(); },
               'initial': obj.params.c2,
                'scale': d3.scaleLog(),
                'ticks': 5});

  };

  LineSearchContour.prototype.calculateStates = function(initial) {
      this.stateIndex = 0;
      this.states = [];
      var f = (x, fxprime) => { this.current.fprime(x, fxprime); return this.current.f(x); };
      this.params.history = this.states;
      this.params.maxIterations = 5000;
      fmin.gradientDescentLineSearch(f, initial, this.params);
  };

  LineSearchContour.prototype.displayState = function(){
      if (this.stateIndex) {
          var d = this.states[this.stateIndex-1];
          var g = this.plot.svg.select(".current .under")
              .append("g");

          g.selectAll("circle")
              .data(d.functionCalls)
              .enter()
              .append("circle")
              .attr("stroke-opacity", 0.8)
              .attr("stroke", "black")
              .attr("stroke-width", 1)
              .attr("fill-opacity", 0)
              .attr("cx", p => this.plot.xScale(p[0]))
              .attr("cy", p => this.plot.yScale(p[1]))
              .attr("r", 3);
      } else {
          this.plot.svg.selectAll(".current .under g").data([]).exit().remove();
      }
      GradientContour.prototype.displayState.call(this);
  };

  function mdsGradient(x, distances, fxprime) {
      var loss = 0, i;
      fxprime = fxprime || fmin.zeros(x.length);
      for (i = 0; i < fxprime.length; ++i) {
          fxprime[i] = 0;
      }

      for (i = 0; i < distances.length; ++i) {
          var xi = x[2 * i], yi = x[2 * i + 1];
          for (var j = i + 1; j < distances.length; ++j) {
              var xj = x[2 * j], yj = x[2 * j + 1],
                  dij = distances[i][j];

              var squaredDistance = (xj - xi) * (xj - xi) + (yj - yi) * (yj - yi),
                  distance = Math.sqrt(squaredDistance),
                  delta = squaredDistance - dij * dij;

              loss += 2 * delta * delta;

              fxprime[2*i]     += 4 * delta * (xi - xj);
              fxprime[2*i + 1] += 4 * delta * (yi - yj);

              fxprime[2*j]     += 4 * delta * (xj - xi);
              fxprime[2*j + 1] += 4 * delta * (yj - yi);
          }
      }
      return loss;
  }

  function mds(distances, params) {
      // fully normalize solution (so that initial guess is somewhat reasonable looking
      var norm = fmin.norm2(distances.map(fmin.norm2))/(distances.length);

      // TODO: why is this needed for CG? norm = 1; understaqnd for GD
      distances = distances.map(function (row) {
          return row.map(function (value) { return value / norm; });
      });

      params = params || {};
      params.history = [];

      // minimize maintaining history (so we can animate the solution)
      var solver = params.solver || fmin.conjugateGradient,
          solution = solver(function(x, fxprime) { return mdsGradient(x, distances, fxprime); },
                            params.initial || fmin.zeros(distances.length*2).map(Math.random),
                            params);

      // convert the history back to a matrix of unnormalized (x,y) points
      return params.history.map(function(state) {
          var ret = fmin.zerosM(distances.length, 2);
          for (var i = 0; i < distances.length; ++i) {
              ret[i][0] = norm * state.x[2* i];
              ret[i][1] = norm * state.x[2 * i + 1];
          }
          return ret;
      });
  }

  function normalizeSolution(solution) {
      var finalPositions = solution[solution.length-1];
      // rotate everything in place such that city 0 (vancouver) is
      // directly north of city 1 (Portland)
      var rotation = Math.atan2(finalPositions[0][0] - finalPositions[1][0],
                                finalPositions[0][1] - finalPositions[1][1]);

      solution.map(function(positions) {
          var c = Math.cos(rotation),
          s = Math.sin(rotation), x, y;
          for (var i = 0; i < positions.length; ++i) {
              x = positions[i][0];
              y = positions[i][1];
              positions[i][0] = c * x - s * y;
              positions[i][1] = s * x + c * y;
          }
          return positions;
      });

      // mirror solution around X if vancouver isn't east of city 2
      if (finalPositions[0][0] > finalPositions[2][0]) {
          solution.map(function(positions) {
              for (var i = 0; i < positions.length; ++i) {
                  positions[i][0] *= -1;
              }
          });
      }
  }

  function getDomain(positions, index) {
      var values = positions.map(function(pos) { return pos[index]; });
      return [Math.min.apply(null, values), Math.max.apply(null, values)];
  }

  function animatedScatterPlot(element, history, labels, duration) {
      // global setup
      var w = element.nodes()[0].offsetWidth,
          h = w * 0.7,
          padding = 20 + w / 20,
          pointRadius = (w > 400 ? 5: 3),
          stopped = false;


      // create the svg element if it doesn't already exist
      element.selectAll("svg").data([0]).enter().append("svg");
      var svg = element.selectAll("svg").data([0])
              .attr("width", w)
              .attr("height", h);

      var under = svg.append("g"),
          over = svg.append("g");

      var colours = d3.schemeCategory20;

      // setup per trial
      var positions = history[history.length-1],
          xDomain = getDomain(positions, 0),
          yDomain = getDomain(positions, 1).reverse();

      var xScale = d3.scaleLinear().
              domain(xDomain)
              .range([padding, w - padding]),

          yScale = d3.scaleLinear().
              domain(yDomain)
              .range([padding, h-padding]);

      function updateState(state) {
          if (stopped) {
              return;
          }
          element.select(".iterations").text("Iteration " + (state + 1) +  "/" + history.length);
          var positions = history[state];

          var nodes = over.selectAll("g")
              .data(positions);

          var enter = nodes.enter()
              .append("g");

          enter.append("circle")
              .attr("r", pointRadius)
              .attr("fill", function(d, i) { return colours[i % colours.length]; })
              .attr("cx", function(d) { return xScale(d[0]); })
              .attr("cy", function(d) { return yScale(d[1]); });

          enter.append("text")
              .style("text-anchor", "middle")
              .style("font-size", w < 400 ? "10px" : "12px" )
              .attr("x", function(d, i) { return xScale(d[0]); })
              .attr("y", function(d, i) { return yScale(d[1]) - 2 - pointRadius; })
              .text(function(d, i) { return labels[i]; });

          var update = nodes.transition().duration(duration).ease(d3.easeLinear);

          if (state) {
              var previous = history[state-1];
              under.selectAll(".line" + state)
                  .data(positions)
                  .enter()
                  .append("line")
                  .attr("stroke", function(d, i) { return colours[i % colours.length]; })
                  .attr("stroke-width", (w > 400 ? 5: 1))
                  .attr("stroke-opacity", ".25")
                  .attr("x1", function(d, i) { return xScale(previous[i][0]); })
                  .attr("y1", function(d, i) { return yScale(previous[i][1]); })
                  .attr("x2", function(d, i) { return xScale(previous[i][0]); })
                  .attr("y2", function(d, i) { return yScale(previous[i][1]); })
                  .transition()
                  .duration(duration)
                  .ease(d3.easeLinear)
                  .attr("x2", function(d) { return xScale(d[0]); })
                  .attr("y2", function(d) { return yScale(d[1]); });
          }

         update.select("circle")
              .attr("cx", function(d) { return xScale(d[0]); })
              .attr("cy", function(d) { return yScale(d[1]); });

          update.select("text")
              .attr("x", function(d, i) { return xScale(d[0]); })
              .attr("y", function(d, i) { return yScale(d[1]) - 2 - pointRadius; });

          if (state < history.length - 1) {
              svg.transition().duration(duration).on("end", function() { updateState(state+1);});
          }
      }
      updateState(0);


      return {'setDuration' : function(d) { duration = d; },
              'stop' : function() { stopped = true; }};
  }

  function createCitiesAnimation(div) {
      var params = {},
          distances = can_us.distances,
          labels = can_us.labels,
          duration = 500,
          count = 20,
          previous = null;

      params.learnRate = 0.002;
      params.maxIterations = 10000;

      function recalculateSolution() {
          if (previous) {
              previous.stop();
          }

          var truncated = distances.slice(0, count).map(function(x) { return x.slice(0, count); });

          var solution = mds(truncated, params);
          normalizeSolution(solution);
          div.select("svg").selectAll("g").data([]).exit().remove();
          previous = animatedScatterPlot(div, solution, labels.slice(0, count), duration);
      }

      function setAlgorithm(name, solver, showSlider) {
          div.select(".learningrateslider").style("display", showSlider? "block" : "none");
          params.solver = solver;
          div.select(".algorithm_label").text(name);
          recalculateSolution();

          return true;
      }

      function setSpeed(speed) {
          duration = speed;
          previous.setDuration(duration);
          div.select(".speed_label").text(speed + "ms / Iteration");
      }

      function setCount(c) {
          count = c;
          div.select(".count_label").text(c + " Cities");
          recalculateSolution();
      }

      function setLearnRate(c) {
          params.learnRate = c;
          div.select("#learningratevalue").text(c.toFixed(5));
          recalculateSolution();
      }

      div.select(".randomize").on("click", recalculateSolution);
      div.select(".algo_cg").on("click", function() { setAlgorithm('Conjugate Gradient', fmin.conjugateGradient); });
      div.select(".algo_gd").on("click", function() {
          setAlgorithm('Gradient Descent', fmin.gradientDescent, true);});
      div.select(".algo_gdls").on("click", function() { setAlgorithm('Gradient Descent w/ Linesearch', fmin.gradientDescentLineSearch); });
      div.select(".algo_neldermead").on("click", function() {
          setSpeed(25);
          if (count > 15) {
              setCount(15);
          }

          setAlgorithm('Nelder Mead', fmin.nelderMead);
      });

      div.select(".speed_500").on("click", function() { setSpeed(500); });
      div.select(".speed_100").on("click", function() { setSpeed(100); });
      div.select(".speed_50").on("click", function() { setSpeed(50); });
      div.select(".speed_25").on("click", function() { setSpeed(25); });

      div.select(".count5").on("click", function() { setCount(5); });
      div.select(".count10").on("click", function() { setCount(10); });
      div.select(".count15").on("click", function() { setCount(15); });
      div.select(".count20").on("click", function() { setCount(20); });
      div.select(".count25").on("click", function() { setCount(25); });


      Slider(div.select("#learningrate"), [0.00001, 0.01],
             function(x) { return setLearnRate(x); },
             {'format': function(d) { return d.toString(); },
                'initial': params.learnRate,
                'scale': d3.scaleLog(),
                'ticks': 3});

      setAlgorithm('Conjugate Gradient', fmin.conjugateGradient);
  }

  exports.NelderMead1d = NelderMead1d;
  exports.NelderMeadContour = NelderMeadContour;
  exports.GradientContour = GradientContour;
  exports.ConjugateGradientContour = ConjugateGradientContour;
  exports.LineSearchContour = LineSearchContour;
  exports.banana = banana;
  exports.flower = flower;
  exports.himmelblau = himmelblau;
  exports.matyas = matyas;
  exports.createCitiesAnimation = createCitiesAnimation;

}));