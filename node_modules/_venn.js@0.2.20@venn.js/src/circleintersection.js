var SMALL = 1e-10;

/** Returns the intersection area of a bunch of circles (where each circle
 is an object having an x,y and radius property) */
export function intersectionArea(circles, stats) {
    // get all the intersection points of the circles
    var intersectionPoints = getIntersectionPoints(circles);

    // filter out points that aren't included in all the circles
    var innerPoints = intersectionPoints.filter(function (p) {
        return containedInCircles(p, circles);
    });

    var arcArea = 0, polygonArea = 0, arcs = [], i;

    // if we have intersection points that are within all the circles,
    // then figure out the area contained by them
    if (innerPoints.length > 1) {
        // sort the points by angle from the center of the polygon, which lets
        // us just iterate over points to get the edges
        var center = getCenter(innerPoints);
        for (i = 0; i < innerPoints.length; ++i ) {
            var p = innerPoints[i];
            p.angle = Math.atan2(p.x - center.x, p.y - center.y);
        }
        innerPoints.sort(function(a,b) { return b.angle - a.angle;});

        // iterate over all points, get arc between the points
        // and update the areas
        var p2 = innerPoints[innerPoints.length - 1];
        for (i = 0; i < innerPoints.length; ++i) {
            var p1 = innerPoints[i];

            // polygon area updates easily ...
            polygonArea += (p2.x + p1.x) * (p1.y - p2.y);

            // updating the arc area is a little more involved
            var midPoint = {x : (p1.x + p2.x) / 2,
                            y : (p1.y + p2.y) / 2},
                arc = null;

            for (var j = 0; j < p1.parentIndex.length; ++j) {
                if (p2.parentIndex.indexOf(p1.parentIndex[j]) > -1) {
                    // figure out the angle halfway between the two points
                    // on the current circle
                    var circle = circles[p1.parentIndex[j]],
                        a1 = Math.atan2(p1.x - circle.x, p1.y - circle.y),
                        a2 = Math.atan2(p2.x - circle.x, p2.y - circle.y);

                    var angleDiff = (a2 - a1);
                    if (angleDiff < 0) {
                        angleDiff += 2*Math.PI;
                    }

                    // and use that angle to figure out the width of the
                    // arc
                    var a = a2 - angleDiff/2,
                        width = distance(midPoint, {
                            x : circle.x + circle.radius * Math.sin(a),
                            y : circle.y + circle.radius * Math.cos(a)
                        });

                    // clamp the width to the largest is can actually be
                    // (sometimes slightly overflows because of FP errors)
                    if (width > circle.radius * 2) {
                        width = circle.radius * 2;
                    }

                    // pick the circle whose arc has the smallest width
                    if ((arc === null) || (arc.width > width)) {
                        arc = { circle : circle,
                                width : width,
                                p1 : p1,
                                p2 : p2};
                    }
                }
            }

            if (arc !== null) {
                arcs.push(arc);
                arcArea += circleArea(arc.circle.radius, arc.width);
                p2 = p1;
            }
        }
    } else {
        // no intersection points, is either disjoint - or is completely
        // overlapped. figure out which by examining the smallest circle
        var smallest = circles[0];
        for (i = 1; i < circles.length; ++i) {
            if (circles[i].radius < smallest.radius) {
                smallest = circles[i];
            }
        }

        // make sure the smallest circle is completely contained in all
        // the other circles
        var disjoint = false;
        for (i = 0; i < circles.length; ++i) {
            if (distance(circles[i], smallest) > Math.abs(smallest.radius - circles[i].radius)) {
                disjoint = true;
                break;
            }
        }

        if (disjoint) {
            arcArea = polygonArea = 0;

        } else {
            arcArea = smallest.radius * smallest.radius * Math.PI;
            arcs.push({circle : smallest,
                       p1: { x: smallest.x,        y : smallest.y + smallest.radius},
                       p2: { x: smallest.x - SMALL, y : smallest.y + smallest.radius},
                       width : smallest.radius * 2 });
        }
    }

    polygonArea /= 2;
    if (stats) {
        stats.area = arcArea + polygonArea;
        stats.arcArea = arcArea;
        stats.polygonArea = polygonArea;
        stats.arcs = arcs;
        stats.innerPoints = innerPoints;
        stats.intersectionPoints = intersectionPoints;
    }

    return arcArea + polygonArea;
}

/** returns whether a point is contained by all of a list of circles */
export function containedInCircles(point, circles) {
    for (var i = 0; i < circles.length; ++i) {
        if (distance(point, circles[i]) > circles[i].radius + SMALL) {
            return false;
        }
    }
    return true;
}

/** Gets all intersection points between a bunch of circles */
function getIntersectionPoints(circles) {
    var ret = [];
    for (var i = 0; i < circles.length; ++i) {
        for (var j = i + 1; j < circles.length; ++j) {
            var intersect = circleCircleIntersection(circles[i],
                                                          circles[j]);
            for (var k = 0; k < intersect.length; ++k) {
                var p = intersect[k];
                p.parentIndex = [i,j];
                ret.push(p);
            }
        }
    }
    return ret;
}

/** Circular segment area calculation. See http://mathworld.wolfram.com/CircularSegment.html */
export function circleArea(r, width) {
    return r * r * Math.acos(1 - width/r) - (r - width) * Math.sqrt(width * (2 * r - width));
}

/** euclidean distance between two points */
export function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) +
                     (p1.y - p2.y) * (p1.y - p2.y));
}


/** Returns the overlap area of two circles of radius r1 and r2 - that
have their centers separated by distance d. Simpler faster
circle intersection for only two circles */
export function circleOverlap(r1, r2, d) {
    // no overlap
    if (d >= r1 + r2) {
        return 0;
    }

    // completely overlapped
    if (d <= Math.abs(r1 - r2)) {
        return Math.PI * Math.min(r1, r2) * Math.min(r1, r2);
    }

    var w1 = r1 - (d * d - r2 * r2 + r1 * r1) / (2 * d),
        w2 = r2 - (d * d - r1 * r1 + r2 * r2) / (2 * d);
    return circleArea(r1, w1) + circleArea(r2, w2);
}

/** Given two circles (containing a x/y/radius attributes),
returns the intersecting points if possible.
note: doesn't handle cases where there are infinitely many
intersection points (circles are equivalent):, or only one intersection point*/
export function circleCircleIntersection(p1, p2) {
    var d = distance(p1, p2),
        r1 = p1.radius,
        r2 = p2.radius;

    // if to far away, or self contained - can't be done
    if ((d >= (r1 + r2)) || (d <= Math.abs(r1 - r2))) {
        return [];
    }

    var a = (r1 * r1 - r2 * r2 + d * d) / (2 * d),
        h = Math.sqrt(r1 * r1 - a * a),
        x0 = p1.x + a * (p2.x - p1.x) / d,
        y0 = p1.y + a * (p2.y - p1.y) / d,
        rx = -(p2.y - p1.y) * (h / d),
        ry = -(p2.x - p1.x) * (h / d);

    return [{x: x0 + rx, y : y0 - ry },
            {x: x0 - rx, y : y0 + ry }];
}

/** Returns the center of a bunch of points */
export function getCenter(points) {
    var center = {x: 0, y: 0};
    for (var i =0; i < points.length; ++i ) {
        center.x += points[i].x;
        center.y += points[i].y;
    }
    center.x /= points.length;
    center.y /= points.length;
    return center;
}
