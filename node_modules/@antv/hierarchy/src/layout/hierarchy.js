/* eslint-disable no-cond-assign */
const util = require('../util');

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
    return d.width || (name.split('').length * PEM); // FIXME DO NOT get width like this
  }
};

function Node(data, options) {
  const me = this;
  me.vgap = me.hgap = 0;
  if (data instanceof Node) return data;
  me.data = data;
  /*
   * Gaps: filling space between nodes
   * (x, y) ----------------------
   * |            vgap            |
   * |    --------------------    h
   * | h |                    |   e
   * | g |                    |   i
   * | a |                    |   g
   * | p |                    |   h
   * |   ---------------------    t
   * |                            |
   *  -----------width------------
   */
  const hgap = options.getHGap(data);
  const vgap = options.getVGap(data);
  me.width = options.getWidth(data);
  me.height = options.getHeight(data);
  me.id = options.getId(data);
  me.x = me.y = 0;
  me.depth = 0;
  if (!me.children) {
    me.children = [];
  }
  me.addGap(hgap, vgap);
  return me;
}

util.assign(Node.prototype, {
  isRoot() {
    return (this.depth === 0);
  },

  isLeaf() {
    return (this.children.length === 0);
  },

  addGap(hgap, vgap) {
    const me = this;
    me.hgap += hgap;
    me.vgap += vgap;
    me.width += 2 * hgap;
    me.height += 2 * vgap;
  },

  eachNode(callback) { // Depth First traverse
    const me = this;
    let nodes = [ me ];
    let current;
    while (current = nodes.pop()) {
      callback(current);
      nodes = nodes.concat(current.children);
    }
  },

  DFTraverse(callback) { // Depth First traverse
    this.eachNode(callback);
  },

  BFTraverse(callback) { // Breadth First traverse
    const me = this;
    let nodes = [ me ];
    let current;
    while (current = nodes.shift()) {
      callback(current);
      nodes = nodes.concat(current.children);
    }
  },

  getBoundingBox() {
    // BBox for just one tree node
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
  },

  // translate
  translate(tx = 0, ty = 0) {
    this.eachNode(node => {
      node.x += tx;
      node.y += ty;
    });
  },

  right2left() {
    const me = this;
    const bb = me.getBoundingBox();
    me.eachNode(node => {
      node.x = node.x - (node.x - bb.left) * 2 - node.width;
      // node.x = - node.x;
    });
    me.translate(bb.width, 0);
  },

  bottom2top() {
    const me = this;
    const bb = me.getBoundingBox();
    me.eachNode(node => {
      node.y = node.y - (node.y - bb.top) * 2 - node.height;
      // node.y = - node.y;
    });
    me.translate(0, bb.height);
  }
});

function hierarchy(data, options = {}, isolated) {
  options = util.assign({}, DEFAULT_OPTIONS, options);
  const root = new Node(data, options);
  const nodes = [ root ];
  let node;
  if (!isolated && !data.collapsed) {
    while (node = nodes.pop()) {
      if (!node.data.collapsed) {
        const children = options.getChildren(node.data);
        const length = children ? children.length : 0;
        node.children = new Array(length);
        if (children && length) {
          for (let i = 0; i < length; i++) {
            const child = new Node(children[i], options);
            node.children[i] = child;
            nodes.push(child);
            child.parent = node;
            child.depth = node.depth + 1;
          }
        }
      }
    }
  }
  return root;
}

module.exports = hierarchy;
