var hierarchy = require('./hierarchy');

module.exports = function (root, options) {
  // separate into left and right trees
  var left = hierarchy(root.data, options, true); // root only

  var right = hierarchy(root.data, options, true); // root only
  // automatically

  var treeSize = root.children.length;
  var rightTreeSize = Math.round(treeSize / 2); // separate left and right tree by meta data

  var getSide = options.getSide || function (child, index) {
    if (index < rightTreeSize) {
      return 'right';
    }

    return 'left';
  };

  for (var i = 0; i < treeSize; i++) {
    var child = root.children[i];
    var side = getSide(child, i);

    if (side === 'right') {
      right.children.push(child);
    } else {
      left.children.push(child);
    }
  }

  left.eachNode(function (node) {
    if (!node.isRoot()) {
      node.side = 'left';
    }
  });
  right.eachNode(function (node) {
    if (!node.isRoot()) {
      node.side = 'right';
    }
  });
  return {
    left: left,
    right: right
  };
};