
const PEM = 18;
const DEFAULT_HEIGHT = PEM * 2;
const DEFAULT_GAP = PEM;

const DEFAULT_OPTIONS = {
  getId(d) {
    return d.id || d.name;
  },
  getHGap(d) {
    return d.hgap || DEFAULT_GAP;
  },
  getVGap(d) {
    return d.vgap || DEFAULT_GAP;
  },
  getChildren(d) {
    return d.children;
  },
  getHeight(d) {
    return d.height || DEFAULT_HEIGHT;
  },
  getWidth(d) {
    const name = d.name || ' ';
    return d.width || name.split('').length * PEM; // FIXME DO NOT get width like this
  }
};

class Node {
  constructor(data, options = {}, isolated) {
    const me = this;
    me.vgap = me.hgap = 0;
    if (data instanceof Node) return data;
    me.data = data;
    /*
     * Gaps: filling space between nodes
     * (x, y) ----------------------
     * |            hgap            |
     * |    --------------------    h
     * | v |                    |   e
     * | g |                    |   i
     * | a |                    |   g
     * | p |                    |   h
     * |   ---------------------    t
     * |                            |
     *  -----------width------------
     */
    const hgap = (options.getHGap || DEFAULT_OPTIONS.getHGap)(data);
    const vgap = (options.getVGap || DEFAULT_OPTIONS.getVGap)(data);
    /*
     * BBox: start point, width, height, etc.
     * (x, y) ---width--->| (x+width, y)
     *   |                |
     *  height            |
     *   |                |
     * (x, y+height)----->| (x+width, y+height)
     */
    me.width = (options.getWidth || DEFAULT_OPTIONS.getWidth)(data);
    me.height = (options.getHeight || DEFAULT_OPTIONS.getHeight)(data);
    me.id = (options.getId || DEFAULT_OPTIONS.getId)(data);
    me.x = me.y = 0;
    /*
     * Anchors: points that edges linked to
     * (0, 0) --------> (0, 1)
     *   |                |
     *   |   (0.5, 0.5)   |
     *   |                |
     * (0, 1) --------> (1, 1)
     */
    me.inAnchor = {
      x: 0,
      y: 0.5
    };
    me.outAnchor = {
      x: 1,
      y: 0.5
    };
    me.depth = 0;
    if (!isolated && !data.isCollapsed) {
      const nodes = [me];
      let node = nodes.pop();
      while (node) {
        if (!node.data.isCollapsed) {
          const children = (options.getChildren || DEFAULT_OPTIONS.getChildren)(node.data);
          const length = children ? children.length : 0;
          node.children = [];
          if (children && length) {
            for (let i = 0; i < length; i++) {
              const child = new Node(children[i], options);
              node.children.push(child);
              nodes.push(child);
              child.parent = node;
              child.depth = node.depth + 1;
            }
          }
        }
        node = nodes.pop();
      }
    }
    if (!me.children) {
      me.children = [];
    }
    me.addGap(hgap, vgap);
  }

  isRoot() {
    return this.depth === 0;
  }

  isLeaf() {
    return this.children.length === 0;
  }

  addGap(hgap, vgap) {
    const me = this;
    me.hgap += hgap;
    me.vgap += vgap;
    me.width += 2 * hgap;
    me.height += 2 * vgap;
  }

  eachNode(callback) {
    // Depth First traverse
    const me = this;
    let nodes = [me];
    let current = nodes.pop();
    while (current) {
      callback(current);
      nodes = nodes.concat(current.children);
      current = nodes.pop();
    }
  }

  DFTraverse(callback) {
    // Depth First traverse
    this.eachNode(callback);
  }

  BFTraverse(callback) {
    // Breadth First traverse
    const me = this;
    let nodes = [me];
    let current = nodes.shift();
    while (current) {
      callback(current);
      nodes = nodes.concat(current.children);
      current = nodes.shift();
    }
  }

  getBoundingBox() {
    const bb = {
      left: Number.MAX_VALUE,
      top: Number.MAX_VALUE,
      width: 0,
      height: 0
    };
    this.eachNode(node => {
      bb.left = Math.min(bb.left, node.x);
      bb.top = Math.min(bb.top, node.y);
      bb.width = Math.max(bb.width, node.x + node.width);
      bb.height = Math.max(bb.height, node.y + node.height);
    });
    return bb;
  }

  // translate

  translate(tx = 0, ty = 0) {
    this.eachNode(node => {
      node.x += tx;
      node.y += ty;
    });
  }

  right2left() {
    const me = this;
    const bb = me.getBoundingBox();
    me.eachNode(node => {
      node.x = node.x - (node.x - bb.left) * 2 - node.width;
      // node.x = - node.x;
    });
    me.translate(bb.width, 0);
  }

  bottom2top() {
    const me = this;
    const bb = me.getBoundingBox();
    me.eachNode(node => {
      node.y = node.y - (node.y - bb.top) * 2 - node.height;
      // node.y = - node.y;
    });
    me.translate(0, bb.height);
  }

  getCenterX() {
    const me = this;
    return me.x + me.width / 2;
  }

  getCenterY() {
    const me = this;
    return me.y + me.height / 2;
  }

  getActualWidth() {
    const me = this;
    return me.width - me.hgap * 2;
  }

  getActualHeight() {
    const me = this;
    return me.height - me.vgap * 2;
  }

  getAnchorPoint(anchor) {
    const me = this;
    const width = me.getActualWidth();
    const height = me.getActualHeight();
    return {
      x: me.x + me.hgap + width * anchor.x,
      y: me.y + me.vgap + height * anchor.y
    };
  }
}

Node.prototype.each = Node.prototype.eachNode;

module.exports = Node;