// from http://stackoverflow.com/questions/12277776/how-to-add-drop-shadow-to-d3-js-pie-or-donut-chart
export function createDropShadowFilter(svg) {
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
