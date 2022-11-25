/* eslint-disable no-cond-assign */
var util = require('../util');

var PEM = 18;
var DEFAULT_HEIGHT = PEM * 2;
var DEFAULT_GAP = PEM;
var DEFAULT_OPTIONS = {
  getId: function getId(d) {
    return d.id || d.name;
  },
  getHGap: function getHGap(d) {
    return d.hgap || DEFAULT_GAP;
  },
  getVGap: function getVGap(d) {
    return d.vgap || DEFAULT_GAP;
  },
  getChildren: function getChildren(d) {
    return d.children;
  },
  getHeight: function getHeight(d) {
    return d.height || DEFAULT_HEIGHT;
  },
  getWidth: function getWidth(d) {
    var name = d.name || ' ';
    return d.width || name.split('').length * PEM; // FIXME DO NOT get width like this
  }
};

function Node(data, options) {
  var me = this;
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

  var hgap = options.getHGap(data);
  var vgap = options.getVGap(data);
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
  isRoot: function isRoot() {
    return this.depth === 0;
  },
  isLeaf: function isLeaf() {
    return this.children.length === 0;
  },
  addGap: function addGap(hgap, vgap) {
    var me = this;
    me.hgap += hgap;
    me.vgap += vgap;
    me.width += 2 * hgap;
    me.height += 2 * vgap;
  },
  eachNode: function eachNode(callback) {
    // Depth First traverse
    var me = this;
    var nodes = [me];
    var current;

    while (current = nodes.pop()) {
      callback(current);
      nodes = nodes.concat(current.children);
    }
  },
  DFTraverse: function DFTraverse(callback) {
    // Depth First traverse
    this.eachNode(callback);
  },
  BFTraverse: function BFTraverse(callback) {
    // Breadth First traverse
    var me = this;
    var nodes = [me];
    var current;

    while (current = nodes.shift()) {
      callback(current);
      nodes = nodes.concat(current.children);
    }
  },
  getBoundingBox: function getBoundingBox() {
    // BBox for just one tree node
    var bb = {
      left: Number.MAX_VALUE,
      top: Number.MAX_VALUE,
      width: 0,
      height: 0
    };
    this.eachNode(function (node) {
      bb.left = Math.min(bb.left, node.x);
      bb.top = Math.min(bb.top, node.y);
      bb.width = Math.max(bb.width, node.x + node.width);
      bb.height = Math.max(bb.height, node.y + node.height);
    });
    return bb;
  },
  // translate
  translate: function translate(tx, ty) {
    if (tx === void 0) {
      tx = 0;
    }

    if (ty === void 0) {
      ty = 0;
    }

    this.eachNode(function (node) {
      node.x += tx;
      node.y += ty;
    });
  },
  right2left: function right2left() {
    var me = this;
    var bb = me.getBoundingBox();
    me.eachNode(function (node) {
      node.x = node.x - (node.x - bb.left) * 2 - node.width; // node.x = - node.x;
    });
    me.translate(bb.width, 0);
  },
  bottom2top: function bottom2top() {
    var me = this;
    var bb = me.getBoundingBox();
    me.eachNode(function (node) {
      node.y = node.y - (node.y - bb.top) * 2 - node.height; // node.y = - node.y;
    });
    me.translate(0, bb.height);
  }
});

function hierarchy(data, options, isolated) {
  if (options === void 0) {
    options = {};
  }

  options = util.assign({}, DEFAULT_OPTIONS, options);
  var root = new Node(data, options);
  var nodes = [root];
  var node;

  if (!isolated && !data.collapsed) {
    while (node = nodes.pop()) {
      if (!node.data.collapsed) {
        var children = options.getChildren(node.data);
        var length = children ? children.length : 0;
        node.children = new Array(length);

        if (children && length) {
          for (var i = 0; i < length; i++) {
            var child = new Node(children[i], options);
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