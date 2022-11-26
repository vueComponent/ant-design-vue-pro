var DEFAULT_INDENT = 20;

function positionNode(node, previousNode, dx) {
  node.x += dx * node.depth;
  node.y = previousNode ? previousNode.y + previousNode.height : 0;
}

module.exports = function (root, indent) {
  if (indent === void 0) {
    indent = DEFAULT_INDENT;
  }

  var previousNode = null;
  root.eachNode(function (node) {
    positionNode(node, previousNode, indent);
    previousNode = node;
  });
};