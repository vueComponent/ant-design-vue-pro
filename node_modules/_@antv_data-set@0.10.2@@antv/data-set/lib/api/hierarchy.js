/* eslint-disable no-cond-assign, no-loop-func */
var assign = require('@antv/util/lib/mix');

var View = require('../view');

assign(View.prototype, {
  getAllNodes: function getAllNodes() {
    var self = this;
    var nodes = [];
    var root = self.root;

    if (root.each) {
      // d3-hierarchy
      root.each(function (node) {
        nodes.push(node);
      });
    } else if (root.eachNode) {
      // @antv/hierarchy
      root.eachNode(function (node) {
        nodes.push(node);
      });
    }

    return nodes;
  },
  getAllLinks: function getAllLinks() {
    var links = [];
    var nodes = [this.root];
    var node;

    while (node = nodes.pop()) {
      var children = node.children;

      if (children) {
        children.forEach(function (child) {
          links.push({
            source: node,
            target: child
          });
          nodes.push(child);
        });
      }
    }

    return links;
  }
});
assign(View.prototype, {
  getAllEdges: View.prototype.getAllLinks
});