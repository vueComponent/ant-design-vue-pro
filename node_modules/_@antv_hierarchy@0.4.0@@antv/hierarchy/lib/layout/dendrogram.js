// wrap tree node
// TODO considering size
var util = require('../util');

function WrappedTree(height, children) {
  if (height === void 0) {
    height = 0;
  }

  if (children === void 0) {
    children = [];
  }

  var me = this;
  me.x = me.y = 0;
  me.leftChild = me.rightChild = null;
  me.height = 0;
  me.children = children;
}

var DEFAULT_OPTIONS = {
  isHorizontal: true,
  nodeSep: 20,
  nodeSize: 20,
  rankSep: 200,
  subTreeSep: 10
};

function convertBack(converted
/* WrappedTree */
, root
/* TreeNode */
, isHorizontal) {
  if (isHorizontal) {
    root.x = converted.x;
    root.y = converted.y;
  } else {
    root.x = converted.y;
    root.y = converted.x;
  }

  converted.children.forEach(function (child, i) {
    convertBack(child, root.children[i], isHorizontal);
  });
}

module.exports = function (root, options) {
  if (options === void 0) {
    options = {};
  }

  options = util.assign({}, DEFAULT_OPTIONS, options);
  var maxDepth = 0;

  function wrappedTreeFromNode(n) {
    if (!n) return null;
    n.width = 0;

    if (n.depth && n.depth > maxDepth) {
      maxDepth = n.depth; // get the max depth
    }

    var children = n.children;
    var childrenCount = children.length;
    var t = new WrappedTree(n.height, []);
    children.forEach(function (child, i) {
      var childWT = wrappedTreeFromNode(child);
      t.children.push(childWT);

      if (i === 0) {
        // t.leftChild = childWT.leftChild ? childWT.leftChild : childWT
        t.leftChild = childWT;
      }

      if (i === childrenCount - 1) {
        // t.rightChild = childWT.rightChild ? childWT.rightChild : childWT
        t.rightChild = childWT;
      }
    });
    t.originNode = n;
    t.isLeaf = n.isLeaf();
    return t;
  }

  function getDrawingDepth(t) {
    if (t.isLeaf || t.children.length === 0) {
      t.drawingDepth = maxDepth;
    } else {
      var depths = t.children.map(function (child) {
        return getDrawingDepth(child);
      });
      var minChildDepth = Math.min.apply(null, depths);
      t.drawingDepth = minChildDepth - 1;
    }

    return t.drawingDepth;
  }

  var prevLeaf;

  function position(t) {
    t.x = t.drawingDepth * options.rankSep;

    if (t.isLeaf) {
      t.y = 0;

      if (prevLeaf) {
        t.y = prevLeaf.y + prevLeaf.height + options.nodeSep;

        if (t.originNode.parent !== prevLeaf.originNode.parent) {
          t.y += options.subTreeSep;
        }
      }

      prevLeaf = t;
    } else {
      t.children.forEach(function (child) {
        position(child);
      });
      t.y = (t.leftChild.y + t.rightChild.y) / 2;
    }
  } // wrap node


  var wt = wrappedTreeFromNode(root); // get depth for drawing

  getDrawingDepth(wt); // get position

  position(wt); // get x, y

  convertBack(wt, root, options.isHorizontal);
  return root;
};