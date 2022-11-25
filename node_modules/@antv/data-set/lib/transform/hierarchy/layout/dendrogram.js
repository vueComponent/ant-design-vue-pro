// wrap tree node
// TODO considering size
class WrappedTree {
  constructor(height, children = []) {
    const me = this;
    me.x = me.y = 0;
    me.leftChild = me.rightChild = null;
    me.height = height || 0;
    me.children = children;
  }
}

const DEFAULT_OPTIONS = {
  isHorizontal: true,
  nodeSep: 20,
  nodeSize: 20,
  rankSep: 200,
  subTreeSep: 10
};

function convertBack(converted /* WrappedTree */, root /* TreeNode */, isHorizontal) {
  if (isHorizontal) {
    root.x = converted.x;
    root.y = converted.y;
  } else {
    root.x = converted.y;
    root.y = converted.x;
  }
  converted.children.forEach((child, i) => {
    convertBack(child, root.children[i], isHorizontal);
  });
}

module.exports = (root, options = {}) => {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  let maxDepth = 0;
  function wrappedTreeFromNode(n) {
    if (!n) return null;
    n.width = 0;
    if (n.depth && n.depth > maxDepth) {
      maxDepth = n.depth; // get the max depth
    }
    const children = n.children;
    const childrenCount = children.length;
    const t = new WrappedTree(n.height, []);
    children.forEach((child, i) => {
      const childWT = wrappedTreeFromNode(child);
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
      const depths = t.children.map(child => {
        return getDrawingDepth(child);
      });
      const minChildDepth = Math.min.apply(null, depths);
      t.drawingDepth = minChildDepth - 1;
    }
    return t.drawingDepth;
  }

  let prevLeaf;

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
      t.children.forEach(child => {
        position(child);
      });
      t.y = (t.leftChild.y + t.rightChild.y) / 2;
    }
  }

  // wrap node
  const wt = wrappedTreeFromNode(root);
  // get depth for drawing
  getDrawingDepth(wt);
  // get position
  position(wt);
  // get x, y
  convertBack(wt, root, options.isHorizontal);
  return root;
};