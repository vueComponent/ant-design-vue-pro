import {select, selectAll} from "d3-selection";
import {transition} from "d3-transition";

import {venn, lossFunction, normalizeSolution, scaleSolution} from "./layout";
import {intersectionArea, distance, getCenter} from "./circleintersection";
import {nelderMead} from "../node_modules/fmin/index.js";

/*global console:true*/

export function VennDiagram() {
    var width = 600,
        height = 350,
        padding = 15,
        duration = 1000,
        orientation = Math.PI / 2,
        normalize = true,
        wrap = true,
        styled = true,
        fontSize = null,
        orientationOrder = null,

        // mimic the behaviour of d3.scale.category10 from the previous
        // version of d3
        colourMap = {},

        // so this is the same as d3.schemeCategory10, which is only defined in d3 4.0
        // since we can support older versions of d3 as long as we don't force this,
        // I'm hackily redefining below. TODO: remove this and change to d3.schemeCategory10
        colourScheme = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
        colourIndex = 0,
        colours = function(key) {
            if (key in colourMap) {
                return colourMap[key];
            }
            var ret = colourMap[key] = colourScheme[colourIndex];
            colourIndex += 1;
            if (colourIndex >= colourScheme.length) {
                colourIndex = 0;
            }
            return ret;
        },
        layoutFunction = venn,
        loss = lossFunction;


    function chart(selection) {
        var data = selection.datum();

        // handle 0-sized sets by removing from input
        var toremove = {};
        data.forEach(function(datum) {
            if ((datum.size == 0) && datum.sets.length == 1) {
                toremove[datum.sets[0]] = 1;
            }
        });
        data = data.filter(function(datum) {
            return !datum.sets.some(function(set) { return set in toremove; });
        });

        var circles = {};
        var textCentres = {};

        if (data.length > 0) {
            var solution = layoutFunction(data, {lossFunction: loss});

            if (normalize) {
                solution = normalizeSolution(solution,
                                            orientation,
                                            orientationOrder);
            }

            circles = scaleSolution(solution, width, height, padding);
            textCentres = computeTextCentres(circles, data);
        }

        // Figure out the current label for each set. These can change
        // and D3 won't necessarily update (fixes https://github.com/benfred/venn.js/issues/103)
        var labels = {};
        data.forEach(function(datum) {
            if (datum.label) {
                labels[datum.sets] = datum.label;
            }
        });

        function label(d) {
            if (d.sets in labels) {
                return labels[d.sets];
            }
            if (d.sets.length == 1) {
                return '' + d.sets[0];
            }
        }

        // create svg if not already existing
        selection.selectAll("svg").data([circles]).enter().append("svg");

        var svg = selection.select("svg")
            .attr("width", width)
            .attr("height", height);

        // to properly transition intersection areas, we need the
        // previous circles locations. load from elements
        var previous = {}, hasPrevious = false;
        svg.selectAll(".venn-area path").each(function (d) {
            var path = select(this).attr("d");
            if ((d.sets.length == 1) && path) {
                hasPrevious = true;
                previous[d.sets[0]] = circleFromPath(path);
            }
        });

        // interpolate intersection area paths between previous and
        // current paths
        var pathTween = function(d) {
            return function(t) {
                var c = d.sets.map(function(set) {
                    var start = previous[set], end = circles[set];
                    if (!start) {
                        start = {x : width/2, y : height/2, radius : 1};
                    }
                    if (!end) {
                        end = {x : width/2, y : height/2, radius : 1};
                    }
                    return {'x' : start.x * (1 - t) + end.x * t,
                            'y' : start.y * (1 - t) + end.y * t,
                            'radius' : start.radius * (1 - t) + end.radius * t};
                });
                return intersectionAreaPath(c);
            };
        };

        // update data, joining on the set ids
        var nodes = svg.selectAll(".venn-area")
            .data(data, function(d) { return d.sets; });

        // create new nodes
        var enter = nodes.enter()
            .append('g')
            .attr("class", function(d) {
                return "venn-area venn-" +
                    (d.sets.length == 1 ? "circle" : "intersection");
            })
            .attr("data-venn-sets", function(d) {
                return d.sets.join("_");
            });

        var enterPath = enter.append("path"),
            enterText = enter.append("text")
            .attr("class", "label")
            .text(function (d) { return label(d); } )
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("x", width/2)
            .attr("y", height/2);


        // apply minimal style if wanted
        if (styled) {
            enterPath.style("fill-opacity", "0")
                .filter(function (d) { return d.sets.length == 1; } )
                .style("fill", function(d) { return colours(d.sets); })
                .style("fill-opacity", ".25");

            enterText
                .style("fill", function(d) { return d.sets.length == 1 ? colours(d.sets) : "#444"; });
        }

        // update existing, using pathTween if necessary
        var update = selection;
        if (hasPrevious) {
            update = selection.transition("venn").duration(duration);
            update.selectAll("path")
                .attrTween("d", pathTween);
        } else {
            update.selectAll("path")
                .attr("d", function(d) {
                    return intersectionAreaPath(d.sets.map(function (set) { return circles[set]; }));
                });
        }

        var updateText = update.selectAll("text")
            .filter(function (d) { return d.sets in textCentres; })
            .text(function (d) { return label(d); } )
            .attr("x", function(d) { return Math.floor(textCentres[d.sets].x);})
            .attr("y", function(d) { return Math.floor(textCentres[d.sets].y);});

        if (wrap) {
            if (hasPrevious) {
                // d3 4.0 uses 'on' for events on transitions,
                // but d3 3.0 used 'each' instead. switch appropiately
                if ('on' in updateText) {
                    updateText.on("end", wrapText(circles, label));
                } else {
                    updateText.each("end", wrapText(circles, label));
                }
            } else {
                updateText.each(wrapText(circles, label));
            }
        }

        // remove old
        var exit = nodes.exit().transition('venn').duration(duration).remove();
        exit.selectAll("path")
            .attrTween("d", pathTween);

        var exitText = exit.selectAll("text")
            .attr("x", width/2)
            .attr("y", height/2);

        // if we've been passed a fontSize explicitly, use it to
        // transition
        if (fontSize !== null) {
            enterText.style("font-size", "0px");
            updateText.style("font-size", fontSize);
            exitText.style("font-size", "0px");
        }


        return {'circles': circles,
                'textCentres': textCentres,
                'nodes': nodes,
                'enter': enter,
                'update': update,
                'exit': exit};
    }

    chart.wrap = function(_) {
        if (!arguments.length) return wrap;
        wrap = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.padding = function(_) {
        if (!arguments.length) return padding;
        padding = _;
        return chart;
    };

    chart.colours = function(_) {
        if (!arguments.length) return colours;
        colours = _;
        return chart;
    };

    chart.fontSize = function(_) {
        if (!arguments.length) return fontSize;
        fontSize = _;
        return chart;
    };

    chart.duration = function(_) {
        if (!arguments.length) return duration;
        duration = _;
        return chart;
    };

    chart.layoutFunction = function(_) {
        if (!arguments.length) return layoutFunction;
        layoutFunction = _;
        return chart;
    };

    chart.normalize = function(_) {
        if (!arguments.length) return normalize;
        normalize = _;
        return chart;
    };

    chart.styled = function(_) {
        if (!arguments.length) return styled;
        styled = _;
        return chart;
    };

    chart.orientation = function(_) {
        if (!arguments.length) return orientation;
        orientation = _;
        return chart;
    };

    chart.orientationOrder = function(_) {
        if (!arguments.length) return orientationOrder;
        orientationOrder = _;
        return chart;
    };

    chart.lossFunction = function(_) {
      if (!arguments.length) return loss;
      loss = _;
      return chart;
    };

    return chart;
}
// sometimes text doesn't fit inside the circle, if thats the case lets wrap
// the text here such that it fits
// todo: looks like this might be merged into d3 (
// https://github.com/mbostock/d3/issues/1642),
// also worth checking out is
// http://engineering.findthebest.com/wrapping-axis-labels-in-d3-js/
// this seems to be one of those things that should be easy but isn't
export function wrapText(circles, labeller) {
    return function() {
        var text = select(this),
            data = text.datum(),
            width = circles[data.sets[0]].radius || 50,
            label = labeller(data) || '';

            var words = label.split(/\s+/).reverse(),
            maxLines = 3,
            minChars = (label.length + words.length) / maxLines,
            word = words.pop(),
            line = [word],
            joined,
            lineNumber = 0,
            lineHeight = 1.1, // ems
            tspan = text.text(null).append("tspan").text(word);

        while (true) {
            word = words.pop();
            if (!word) break;
            line.push(word);
            joined = line.join(" ");
            tspan.text(joined);
            if (joined.length > minChars && tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").text(word);
                lineNumber++;
            }
        }

        var initial = 0.35 - lineNumber * lineHeight / 2,
            x = text.attr("x"),
            y = text.attr("y");

        text.selectAll("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", function(d, i) {
                 return (initial + i * lineHeight) + "em";
            });
    };
}

function circleMargin(current, interior, exterior) {
    var margin = interior[0].radius - distance(interior[0], current), i, m;
    for (i = 1; i < interior.length; ++i) {
        m = interior[i].radius - distance(interior[i], current);
        if (m <= margin) {
            margin = m;
        }
    }

    for (i = 0; i < exterior.length; ++i) {
        m = distance(exterior[i], current) - exterior[i].radius;
        if (m <= margin) {
            margin = m;
        }
    }
    return margin;
}

// compute the center of some circles by maximizing the margin of
// the center point relative to the circles (interior) after subtracting
// nearby circles (exterior)
export function computeTextCentre(interior, exterior) {
    // get an initial estimate by sampling around the interior circles
    // and taking the point with the biggest margin
    var points = [], i;
    for (i = 0; i < interior.length; ++i) {
        var c = interior[i];
        points.push({x: c.x, y: c.y});
        points.push({x: c.x + c.radius/2, y: c.y});
        points.push({x: c.x - c.radius/2, y: c.y});
        points.push({x: c.x, y: c.y + c.radius/2});
        points.push({x: c.x, y: c.y - c.radius/2});
    }
    var initial = points[0], margin = circleMargin(points[0], interior, exterior);
    for (i = 1; i < points.length; ++i) {
        var m = circleMargin(points[i], interior, exterior);
        if (m >= margin) {
            initial = points[i];
            margin = m;
        }
    }

    // maximize the margin numerically
    var solution = nelderMead(
                function(p) { return -1 * circleMargin({x: p[0], y: p[1]}, interior, exterior); },
                [initial.x, initial.y],
                {maxIterations:500, minErrorDelta:1e-10}).x;
    var ret = {x: solution[0], y: solution[1]};

    // check solution, fallback as needed (happens if fully overlapped
    // etc)
    var valid = true;
    for (i = 0; i < interior.length; ++i) {
        if (distance(ret, interior[i]) > interior[i].radius) {
            valid = false;
            break;
        }
    }

    for (i = 0; i < exterior.length; ++i) {
        if (distance(ret, exterior[i]) < exterior[i].radius) {
            valid = false;
            break;
        }
    }

    if (!valid) {
        if (interior.length == 1) {
            ret = {x: interior[0].x, y: interior[0].y};
        } else {
            var areaStats = {};
            intersectionArea(interior, areaStats);

            if (areaStats.arcs.length === 0) {
                ret = {'x': 0, 'y': -1000, disjoint:true};

            } else if (areaStats.arcs.length == 1) {
                ret = {'x': areaStats.arcs[0].circle.x,
                       'y': areaStats.arcs[0].circle.y};

            } else if (exterior.length) {
                // try again without other circles
                ret = computeTextCentre(interior, []);

            } else {
                // take average of all the points in the intersection
                // polygon. this should basically never happen
                // and has some issues:
                // https://github.com/benfred/venn.js/issues/48#issuecomment-146069777
                ret = getCenter(areaStats.arcs.map(function (a) { return a.p1; }));
            }
        }
    }

    return ret;
}

// given a dictionary of {setid : circle}, returns
// a dictionary of setid to list of circles that completely overlap it
function getOverlappingCircles(circles) {
    var ret = {}, circleids = [];
    for (var circleid in circles) {
        circleids.push(circleid);
        ret[circleid] = [];
    }
    for (var i  = 0; i < circleids.length; i++) {
        var a = circles[circleids[i]];
        for (var j = i + 1; j < circleids.length; ++j) {
            var b = circles[circleids[j]],
                d = distance(a, b);

            if (d + b.radius <= a.radius + 1e-10) {
                ret[circleids[j]].push(circleids[i]);

            } else if (d + a.radius <= b.radius + 1e-10) {
                ret[circleids[i]].push(circleids[j]);
            }
        }
    }
    return ret;
}

export function computeTextCentres(circles, areas) {
    var ret = {}, overlapped = getOverlappingCircles(circles);
    for (var i = 0; i < areas.length; ++i) {
        var area = areas[i].sets, areaids = {}, exclude = {};
        for (var j = 0; j < area.length; ++j) {
            areaids[area[j]] = true;
            var overlaps = overlapped[area[j]];
            // keep track of any circles that overlap this area,
            // and don't consider for purposes of computing the text
            // centre
            for (var k = 0; k < overlaps.length; ++k) {
                exclude[overlaps[k]] = true;
            }
        }

        var interior = [], exterior = [];
        for (var setid in circles) {
            if (setid in areaids) {
                interior.push(circles[setid]);
            } else if (!(setid in exclude)) {
                exterior.push(circles[setid]);
            }
        }
        var centre = computeTextCentre(interior, exterior);
        ret[area] = centre;
        if (centre.disjoint && (areas[i].size > 0)) {
            console.log("WARNING: area " + area + " not represented on screen");
        }
    }
    return  ret;
}

// sorts all areas in the venn diagram, so that
// a particular area is on top (relativeTo) - and
// all other areas are so that the smallest areas are on top
export function sortAreas(div, relativeTo) {

    // figure out sets that are completly overlapped by relativeTo
    var overlaps = getOverlappingCircles(div.selectAll("svg").datum());
    var exclude = {};
    for (var i = 0; i < relativeTo.sets.length; ++i) {
        var check = relativeTo.sets[i];
        for (var setid in overlaps) {
            var overlap = overlaps[setid];
            for (var j = 0; j < overlap.length; ++j) {
                if (overlap[j] == check) {
                    exclude[setid] = true;
                    break;
                }
            }
        }
    }

    // checks that all sets are in exclude;
    function shouldExclude(sets) {
        for (var i = 0; i < sets.length; ++i) {
            if (!(sets[i] in exclude)) {
                return false;
            }
        }
        return true;
    }

    // need to sort div's so that Z order is correct
    div.selectAll("g").sort(function (a, b) {
        // highest order set intersections first
        if (a.sets.length != b.sets.length) {
            return a.sets.length - b.sets.length;
        }

        if (a == relativeTo) {
            return shouldExclude(b.sets) ? -1 : 1;
        }
        if (b == relativeTo) {
            return shouldExclude(a.sets) ? 1 : -1;
        }

        // finally by size
        return b.size - a.size;
    });
}

export function circlePath(x, y, r) {
    var ret = [];
    ret.push("\nM", x, y);
    ret.push("\nm", -r, 0);
    ret.push("\na", r, r, 0, 1, 0, r *2, 0);
    ret.push("\na", r, r, 0, 1, 0,-r *2, 0);
    return ret.join(" ");
}

// inverse of the circlePath function, returns a circle object from an svg path
export function circleFromPath(path) {
    var tokens = path.split(' ');
    return {'x' : parseFloat(tokens[1]),
            'y' : parseFloat(tokens[2]),
            'radius' : -parseFloat(tokens[4])
            };
}

/** returns a svg path of the intersection area of a bunch of circles */
export function intersectionAreaPath(circles) {
    var stats = {};
    intersectionArea(circles, stats);
    var arcs = stats.arcs;

    if (arcs.length === 0) {
        return "M 0 0";

    } else if (arcs.length == 1) {
        var circle = arcs[0].circle;
        return circlePath(circle.x, circle.y, circle.radius);

    } else {
        // draw path around arcs
        var ret = ["\nM", arcs[0].p2.x, arcs[0].p2.y];
        for (var i = 0; i < arcs.length; ++i) {
            var arc = arcs[i], r = arc.circle.radius, wide = arc.width > r;
            ret.push("\nA", r, r, 0, wide ? 1 : 0, 1,
                     arc.p1.x, arc.p1.y);
        }
        return ret.join(" ");
    }
}
