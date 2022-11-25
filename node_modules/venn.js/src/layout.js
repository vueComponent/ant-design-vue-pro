import {nelderMead, bisect, conjugateGradient, zeros, zerosM, norm2,
        scale} from '../node_modules/fmin/index.js';
import {intersectionArea, circleOverlap, circleCircleIntersection, distance} from './circleintersection';

/** given a list of set objects, and their corresponding overlaps.
updates the (x, y, radius) attribute on each set such that their positions
roughly correspond to the desired overlaps */
export function venn(areas, parameters) {
    parameters = parameters || {};
    parameters.maxIterations = parameters.maxIterations || 500;
    var initialLayout = parameters.initialLayout || bestInitialLayout;
    var loss = parameters.lossFunction || lossFunction;

    // add in missing pairwise areas as having 0 size
    areas = addMissingAreas(areas);

    // initial layout is done greedily
    var circles = initialLayout(areas, parameters);

    // transform x/y coordinates to a vector to optimize
    var initial = [], setids = [], setid;
    for (setid in circles) {
        if (circles.hasOwnProperty(setid)) {
            initial.push(circles[setid].x);
            initial.push(circles[setid].y);
            setids.push(setid);
        }
    }

    // optimize initial layout from our loss function
    var totalFunctionCalls = 0;
    var solution = nelderMead(
        function(values) {
            totalFunctionCalls += 1;
            var current = {};
            for (var i = 0; i < setids.length; ++i) {
                var setid = setids[i];
                current[setid] = {x: values[2 * i],
                                  y: values[2 * i + 1],
                                  radius : circles[setid].radius,
                                 // size : circles[setid].size
                                 };
            }
            return loss(current, areas);
        },
        initial,
        parameters);

    // transform solution vector back to x/y points
    var positions = solution.x;
    for (var i = 0; i < setids.length; ++i) {
        setid = setids[i];
        circles[setid].x = positions[2 * i];
        circles[setid].y = positions[2 * i + 1];
    }

    return circles;
}

var SMALL = 1e-10;

/** Returns the distance necessary for two circles of radius r1 + r2 to
have the overlap area 'overlap' */
export function distanceFromIntersectArea(r1, r2, overlap) {
    // handle complete overlapped circles
    if (Math.min(r1, r2) * Math.min(r1,r2) * Math.PI <= overlap + SMALL) {
        return Math.abs(r1 - r2);
    }

    return bisect(function(distance) {
        return circleOverlap(r1, r2, distance) - overlap;
    }, 0, r1 + r2);
}

/** Missing pair-wise intersection area data can cause problems:
 treating as an unknown means that sets will be laid out overlapping,
 which isn't what people expect. To reflect that we want disjoint sets
 here, set the overlap to 0 for all missing pairwise set intersections */
function addMissingAreas(areas) {
    areas = areas.slice();

    // two circle intersections that aren't defined
    var ids = [], pairs = {}, i, j, a, b;
    for (i = 0; i < areas.length; ++i) {
        var area = areas[i];
        if (area.sets.length == 1) {
            ids.push(area.sets[0]);
        } else if (area.sets.length == 2) {
            a = area.sets[0];
            b = area.sets[1];
            pairs[[a, b]] = true;
            pairs[[b, a]] = true;
        }
    }
    ids.sort(function(a, b) { return a > b; });

    for (i = 0; i < ids.length; ++i) {
        a = ids[i];
        for (j = i + 1; j < ids.length; ++j) {
            b = ids[j];
            if (!([a, b] in pairs)) {
                areas.push({'sets': [a, b],
                            'size': 0});
            }
        }
    }
    return areas;
}

/// Returns two matrices, one of the euclidean distances between the sets
/// and the other indicating if there are subset or disjoint set relationships
export function getDistanceMatrices(areas, sets, setids) {
    // initialize an empty distance matrix between all the points
    var distances = zerosM(sets.length, sets.length),
        constraints = zerosM(sets.length, sets.length);

    // compute required distances between all the sets such that
    // the areas match
    areas.filter(function(x) { return x.sets.length == 2; })
        .map(function(current) {
        var left = setids[current.sets[0]],
            right = setids[current.sets[1]],
            r1 = Math.sqrt(sets[left].size / Math.PI),
            r2 = Math.sqrt(sets[right].size / Math.PI),
            distance = distanceFromIntersectArea(r1, r2, current.size);

        distances[left][right] = distances[right][left] = distance;

        // also update constraints to indicate if its a subset or disjoint
        // relationship
        var c = 0;
        if (current.size + 1e-10 >= Math.min(sets[left].size,
                                             sets[right].size)) {
            c = 1;
        } else if (current.size <= 1e-10) {
            c = -1;
        }
        constraints[left][right] = constraints[right][left] = c;
    });

    return {distances: distances, constraints: constraints};
}

/// computes the gradient and loss simulatenously for our constrained MDS optimizer
function constrainedMDSGradient(x, fxprime, distances, constraints) {
    var loss = 0, i;
    for (i = 0; i < fxprime.length; ++i) {
        fxprime[i] = 0;
    }

    for (i = 0; i < distances.length; ++i) {
        var xi = x[2 * i], yi = x[2 * i + 1];
        for (var j = i + 1; j < distances.length; ++j) {
            var xj = x[2 * j], yj = x[2 * j + 1],
                dij = distances[i][j],
                constraint = constraints[i][j];

            var squaredDistance = (xj - xi) * (xj - xi) + (yj - yi) * (yj - yi),
                distance = Math.sqrt(squaredDistance),
                delta = squaredDistance - dij * dij;

            if (((constraint > 0) && (distance <= dij)) ||
                ((constraint < 0) && (distance >= dij))) {
                continue;
            }

            loss += 2 * delta * delta;

            fxprime[2*i]     += 4 * delta * (xi - xj);
            fxprime[2*i + 1] += 4 * delta * (yi - yj);

            fxprime[2*j]     += 4 * delta * (xj - xi);
            fxprime[2*j + 1] += 4 * delta * (yj - yi);
        }
    }
    return loss;
}

/// takes the best working variant of either constrained MDS or greedy
export function bestInitialLayout(areas, params) {
    var initial = greedyLayout(areas, params);
    var loss = params.lossFunction || lossFunction;

    // greedylayout is sufficient for all 2/3 circle cases. try out
    // constrained MDS for higher order problems, take its output
    // if it outperforms. (greedy is aesthetically better on 2/3 circles
    // since it axis aligns)
    if (areas.length >= 8) {
        var constrained  = constrainedMDSLayout(areas, params),
            constrainedLoss = loss(constrained, areas),
            greedyLoss = loss(initial, areas);

        if (constrainedLoss + 1e-8 < greedyLoss) {
            initial = constrained;
        }
    }
    return initial;
}

/// use the constrained MDS variant to generate an initial layout
export function constrainedMDSLayout(areas, params) {
    params = params || {};
    var restarts = params.restarts || 10;

    // bidirectionally map sets to a rowid  (so we can create a matrix)
    var sets = [], setids = {}, i;
    for (i = 0; i < areas.length; ++i ) {
        var area = areas[i];
        if (area.sets.length == 1) {
            setids[area.sets[0]] = sets.length;
            sets.push(area);
        }
    }

    var matrices = getDistanceMatrices(areas, sets, setids),
        distances = matrices.distances,
        constraints = matrices.constraints;

    // keep distances bounded, things get messed up otherwise.
    // TODO: proper preconditioner?
    var norm = norm2(distances.map(norm2))/(distances.length);
    distances = distances.map(function (row) {
        return row.map(function (value) { return value / norm; });});

    var obj = function(x, fxprime) {
        return constrainedMDSGradient(x, fxprime, distances, constraints);
    };

    var best, current;
    for (i = 0; i < restarts; ++i) {
        var initial = zeros(distances.length*2).map(Math.random);

        current = conjugateGradient(obj, initial, params);
        if (!best || (current.fx < best.fx)) {
            best = current;
        }
    }
    var positions = best.x;

    // translate rows back to (x,y,radius) coordinates
    var circles = {};
    for (i = 0; i < sets.length; ++i) {
        var set = sets[i];
        circles[set.sets[0]] = {
            x: positions[2*i] * norm,
            y: positions[2*i + 1] * norm,
            radius:  Math.sqrt(set.size / Math.PI)
        };
    }

    if (params.history) {
        for (i = 0; i < params.history.length; ++i) {
            scale(params.history[i].x, norm);
        }
    }
    return circles;
}

/** Lays out a Venn diagram greedily, going from most overlapped sets to
least overlapped, attempting to position each new set such that the
overlapping areas to already positioned sets are basically right */
export function greedyLayout(areas, params) {
    var loss = params && params.lossFunction ? params.lossFunction : lossFunction;
    // define a circle for each set
    var circles = {}, setOverlaps = {}, set;
    for (var i = 0; i < areas.length; ++i) {
        var area = areas[i];
        if (area.sets.length == 1) {
            set = area.sets[0];
            circles[set] = {x: 1e10, y: 1e10,
                            rowid: circles.length,
                            size: area.size,
                            radius: Math.sqrt(area.size / Math.PI)};
            setOverlaps[set] = [];
        }
    }
    areas = areas.filter(function(a) { return a.sets.length == 2; });

    // map each set to a list of all the other sets that overlap it
    for (i = 0; i < areas.length; ++i) {
        var current = areas[i];
        var weight = current.hasOwnProperty('weight') ? current.weight : 1.0;
        var left = current.sets[0], right = current.sets[1];

        // completely overlapped circles shouldn't be positioned early here
        if (current.size + SMALL >= Math.min(circles[left].size,
                                             circles[right].size)) {
            weight = 0;
        }

        setOverlaps[left].push ({set:right, size:current.size, weight:weight});
        setOverlaps[right].push({set:left,  size:current.size, weight:weight});
    }

    // get list of most overlapped sets
    var mostOverlapped = [];
    for (set in setOverlaps) {
        if (setOverlaps.hasOwnProperty(set)) {
            var size = 0;
            for (i = 0; i < setOverlaps[set].length; ++i) {
                size += setOverlaps[set][i].size * setOverlaps[set][i].weight;
            }

            mostOverlapped.push({set: set, size:size});
        }
    }

    // sort by size desc
    function sortOrder(a,b) {
        return b.size - a.size;
    }
    mostOverlapped.sort(sortOrder);

    // keep track of what sets have been laid out
    var positioned = {};
    function isPositioned(element) {
        return element.set in positioned;
    }

    // adds a point to the output
    function positionSet(point, index) {
        circles[index].x = point.x;
        circles[index].y = point.y;
        positioned[index] = true;
    }

    // add most overlapped set at (0,0)
    positionSet({x: 0, y: 0}, mostOverlapped[0].set);

    // get distances between all points. TODO, necessary?
    // answer: probably not
    // var distances = venn.getDistanceMatrices(circles, areas).distances;
    for (i = 1; i < mostOverlapped.length; ++i) {
        var setIndex = mostOverlapped[i].set,
            overlap = setOverlaps[setIndex].filter(isPositioned);
        set = circles[setIndex];
        overlap.sort(sortOrder);

        if (overlap.length === 0) {
            // this shouldn't happen anymore with addMissingAreas
            throw "ERROR: missing pairwise overlap information";
        }

        var points = [];
        for (var j = 0; j < overlap.length; ++j) {
            // get appropriate distance from most overlapped already added set
            var p1 = circles[overlap[j].set],
                d1 = distanceFromIntersectArea(set.radius, p1.radius,
                                               overlap[j].size);

            // sample positions at 90 degrees for maximum aesthetics
            points.push({x : p1.x + d1, y : p1.y});
            points.push({x : p1.x - d1, y : p1.y});
            points.push({y : p1.y + d1, x : p1.x});
            points.push({y : p1.y - d1, x : p1.x});

            // if we have at least 2 overlaps, then figure out where the
            // set should be positioned analytically and try those too
            for (var k = j + 1; k < overlap.length; ++k) {
                var p2 = circles[overlap[k].set],
                    d2 = distanceFromIntersectArea(set.radius, p2.radius,
                                                   overlap[k].size);

                var extraPoints = circleCircleIntersection(
                    { x: p1.x, y: p1.y, radius: d1},
                    { x: p2.x, y: p2.y, radius: d2});

                for (var l = 0; l < extraPoints.length; ++l) {
                    points.push(extraPoints[l]);
                }
            }
        }

        // we have some candidate positions for the set, examine loss
        // at each position to figure out where to put it at
        var bestLoss = 1e50, bestPoint = points[0];
        for (j = 0; j < points.length; ++j) {
            circles[setIndex].x = points[j].x;
            circles[setIndex].y = points[j].y;
            var localLoss = loss(circles, areas);
            if (localLoss < bestLoss) {
                bestLoss = localLoss;
                bestPoint = points[j];
            }
        }

        positionSet(bestPoint, setIndex);
    }

    return circles;
}

/** Given a bunch of sets, and the desired overlaps between these sets - computes
the distance from the actual overlaps to the desired overlaps. Note that
this method ignores overlaps of more than 2 circles */
export function lossFunction(sets, overlaps) {
    var output = 0;

    function getCircles(indices) {
        return indices.map(function(i) { return sets[i]; });
    }

    for (var i = 0; i < overlaps.length; ++i) {
        var area = overlaps[i], overlap;
        if (area.sets.length == 1) {
            continue;
        } else if (area.sets.length == 2) {
            var left = sets[area.sets[0]],
                right = sets[area.sets[1]];
            overlap = circleOverlap(left.radius, right.radius,
                                    distance(left, right));
        } else {
            overlap = intersectionArea(getCircles(area.sets));
        }

        var weight = area.hasOwnProperty('weight') ? area.weight : 1.0;
        output += weight * (overlap - area.size) * (overlap - area.size);
    }

    return output;
}

// orientates a bunch of circles to point in orientation
function orientateCircles(circles, orientation, orientationOrder) {
    if (orientationOrder === null) {
        circles.sort(function (a, b) { return b.radius - a.radius; });
    } else {
        circles.sort(orientationOrder);
    }

    var i;
    // shift circles so largest circle is at (0, 0)
    if (circles.length > 0) {
        var largestX = circles[0].x,
            largestY = circles[0].y;

        for (i = 0; i < circles.length; ++i) {
            circles[i].x -= largestX;
            circles[i].y -= largestY;
        }
    }

    if (circles.length == 2) {
        // if the second circle is a subset of the first, arrange so that
        // it is off to one side. hack for https://github.com/benfred/venn.js/issues/120
        var dist = distance(circles[0], circles[1]);
        if (dist < Math.abs(circles[1].radius - circles[0].radius)) {
            circles[1].x = circles[0].x + circles[0].radius - circles[1].radius - 1e-10;
            circles[1].y = circles[0].y;
        }
    }

    // rotate circles so that second largest is at an angle of 'orientation'
    // from largest
    if (circles.length > 1) {
        var rotation = Math.atan2(circles[1].x, circles[1].y) - orientation,
            c = Math.cos(rotation),
            s = Math.sin(rotation), x, y;

        for (i = 0; i < circles.length; ++i) {
            x = circles[i].x;
            y = circles[i].y;
            circles[i].x = c * x - s * y;
            circles[i].y = s * x + c * y;
        }
    }

    // mirror solution if third solution is above plane specified by
    // first two circles
    if (circles.length > 2) {
        var angle = Math.atan2(circles[2].x, circles[2].y) - orientation;
        while (angle < 0) { angle += 2* Math.PI; }
        while (angle > 2*Math.PI) { angle -= 2* Math.PI; }
        if (angle > Math.PI) {
            var slope = circles[1].y / (1e-10 + circles[1].x);
            for (i = 0; i < circles.length; ++i) {
                var d = (circles[i].x + slope * circles[i].y) / (1 + slope*slope);
                circles[i].x = 2 * d - circles[i].x;
                circles[i].y = 2 * d * slope - circles[i].y;
            }
        }
    }
}

export function disjointCluster(circles) {
    // union-find clustering to get disjoint sets
    circles.map(function(circle) { circle.parent = circle; });

    // path compression step in union find
    function find(circle) {
        if (circle.parent !== circle) {
            circle.parent = find(circle.parent);
        }
        return circle.parent;
    }

    function union(x, y) {
        var xRoot = find(x), yRoot = find(y);
        xRoot.parent = yRoot;
    }

    // get the union of all overlapping sets
    for (var i = 0; i < circles.length; ++i) {
        for (var j = i + 1; j < circles.length; ++j) {
            var maxDistance = circles[i].radius + circles[j].radius;
            if (distance(circles[i], circles[j]) + 1e-10 < maxDistance) {
                union(circles[j], circles[i]);
            }
        }
    }

    // find all the disjoint clusters and group them together
    var disjointClusters = {}, setid;
    for (i = 0; i < circles.length; ++i) {
        setid = find(circles[i]).parent.setid;
        if (!(setid in disjointClusters)) {
            disjointClusters[setid] = [];
        }
        disjointClusters[setid].push(circles[i]);
    }

    // cleanup bookkeeping
    circles.map(function(circle) { delete circle.parent; });

    // return in more usable form
    var ret = [];
    for (setid in disjointClusters) {
        if (disjointClusters.hasOwnProperty(setid)) {
            ret.push(disjointClusters[setid]);
        }
    }
    return ret;
}

function getBoundingBox(circles) {
    var minMax = function(d) {
        var hi = Math.max.apply(null, circles.map(
                                function(c) { return c[d] + c.radius; } )),
            lo = Math.min.apply(null, circles.map(
                                function(c) { return c[d] - c.radius;} ));
        return {max:hi, min:lo};
    };

    return {xRange: minMax('x'), yRange: minMax('y')};
}

export function normalizeSolution(solution, orientation, orientationOrder) {
    if (orientation === null){
        orientation = Math.PI/2;
    }

    // work with a list instead of a dictionary, and take a copy so we
    // don't mutate input
    var circles = [], i, setid;
    for (setid in solution) {
        if (solution.hasOwnProperty(setid)) {
            var previous = solution[setid];
            circles.push({x: previous.x,
                          y: previous.y,
                          radius: previous.radius,
                          setid: setid});
        }
    }

    // get all the disjoint clusters
    var clusters = disjointCluster(circles);

    // orientate all disjoint sets, get sizes
    for (i = 0; i < clusters.length; ++i) {
        orientateCircles(clusters[i], orientation, orientationOrder);
        var bounds = getBoundingBox(clusters[i]);
        clusters[i].size = (bounds.xRange.max - bounds.xRange.min) * (bounds.yRange.max - bounds.yRange.min);
        clusters[i].bounds = bounds;
    }
    clusters.sort(function(a, b) { return b.size - a.size; });

    // orientate the largest at 0,0, and get the bounds
    circles = clusters[0];
    var returnBounds = circles.bounds;

    var spacing = (returnBounds.xRange.max - returnBounds.xRange.min)/50;

    function addCluster(cluster, right, bottom) {
        if (!cluster) return;

        var bounds = cluster.bounds, xOffset, yOffset, centreing;

        if (right) {
            xOffset = returnBounds.xRange.max  - bounds.xRange.min + spacing;
        } else {
            xOffset = returnBounds.xRange.max  - bounds.xRange.max;
            centreing = (bounds.xRange.max - bounds.xRange.min) / 2 -
                        (returnBounds.xRange.max - returnBounds.xRange.min) / 2;
            if (centreing < 0) xOffset += centreing;
        }

        if (bottom) {
            yOffset = returnBounds.yRange.max  - bounds.yRange.min + spacing;
        } else {
            yOffset = returnBounds.yRange.max  - bounds.yRange.max;
            centreing = (bounds.yRange.max - bounds.yRange.min) / 2 -
                        (returnBounds.yRange.max - returnBounds.yRange.min) / 2;
            if (centreing < 0) yOffset += centreing;
        }

        for (var j = 0; j < cluster.length; ++j) {
            cluster[j].x += xOffset;
            cluster[j].y += yOffset;
            circles.push(cluster[j]);
        }
    }

    var index = 1;
    while (index < clusters.length) {
        addCluster(clusters[index], true, false);
        addCluster(clusters[index+1], false, true);
        addCluster(clusters[index+2], true, true);
        index += 3;

        // have one cluster (in top left). lay out next three relative
        // to it in a grid
        returnBounds = getBoundingBox(circles);
    }

    // convert back to solution form
    var ret = {};
    for (i = 0; i < circles.length; ++i) {
        ret[circles[i].setid] = circles[i];
    }
    return ret;
}

/** Scales a solution from venn.venn or venn.greedyLayout such that it fits in
a rectangle of width/height - with padding around the borders. also
centers the diagram in the available space at the same time */
export function scaleSolution(solution, width, height, padding) {
    var circles = [], setids = [];
    for (var setid in solution) {
        if (solution.hasOwnProperty(setid)) {
            setids.push(setid);
            circles.push(solution[setid]);
        }
    }

    width -= 2*padding;
    height -= 2*padding;

    var bounds = getBoundingBox(circles),
        xRange = bounds.xRange,
        yRange = bounds.yRange;

    if ((xRange.max == xRange.min) ||
        (yRange.max == yRange.min)) {
        console.log("not scaling solution: zero size detected");
        return solution;
    }

    var xScaling = width  / (xRange.max - xRange.min),
        yScaling = height / (yRange.max - yRange.min),
        scaling = Math.min(yScaling, xScaling),

        // while we're at it, center the diagram too
        xOffset = (width -  (xRange.max - xRange.min) * scaling) / 2,
        yOffset = (height - (yRange.max - yRange.min) * scaling) / 2;

    var scaled = {};
    for (var i = 0; i < circles.length; ++i) {
        var circle = circles[i];
        scaled[setids[i]] = {
            radius: scaling * circle.radius,
            x: padding + xOffset + (circle.x - xRange.min) * scaling,
            y: padding + yOffset + (circle.y - yRange.min) * scaling,
        };
    }

    return scaled;
}
