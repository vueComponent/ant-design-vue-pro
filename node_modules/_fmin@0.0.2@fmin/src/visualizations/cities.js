import {Slider} from "./slider";
import {createDropShadowFilter} from "./dropshadow";

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

export function createCitiesAnimation(div) {
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
