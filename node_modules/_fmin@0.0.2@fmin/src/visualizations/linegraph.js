export function LineGraph() {
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
