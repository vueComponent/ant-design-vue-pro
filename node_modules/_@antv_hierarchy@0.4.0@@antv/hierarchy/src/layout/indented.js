const DEFAULT_INDENT = 20;
function positionNode(node, previousNode, dx) {
  node.x += dx * node.depth;
  node.y = previousNode ? previousNode.y + previousNode.height : 0;
}
module.exports = (root, indent = DEFAULT_INDENT) => {
  let previousNode = null;
  root.eachNode(node => {
    positionNode(node, previousNode, indent);
    previousNode = node;
  });
};
