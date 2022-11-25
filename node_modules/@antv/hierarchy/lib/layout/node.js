function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Node = function () {
  function Node(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var isolated = arguments[2];

    _classCallCheck(this, Node);

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
    var hgap = (options.getHGap || DEFAULT_OPTIONS.getHGap)(data);
    var vgap = (options.getVGap || DEFAULT_OPTIONS.getVGap)(data);
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
    me.depth = 0;
    if (!isolated && !data.collapsed) {
      var nodes = [me];
      var node = nodes.pop();
      while (node) {
        if (!node.data.collapsed) {
          var children = (options.getChildren || DEFAULT_OPTIONS.getChildren)(node.data);
          var length = children ? children.length : 0;
          node.children = [];
          if (children && length) {
            for (var i = 0; i < length; i++) {
              var child = new Node(children[i], options);
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

  Node.prototype.isRoot = function isRoot() {
    return this.depth === 0;
  };

  Node.prototype.isLeaf = function isLeaf() {
    return this.children.length === 0;
  };

  Node.prototype.addGap = function addGap(hgap, vgap) {
    var me = this;
    me.hgap += hgap;
    me.vgap += vgap;
    me.width += 2 * hgap;
    me.height += 2 * vgap;
  };

  Node.prototype.eachNode = function eachNode(callback) {
    // Depth First traverse
    var me = this;
    var nodes = [me];
    var current = nodes.pop();
    while (current) {
      callback(current);
      nodes = nodes.concat(current.children);
      current = nodes.pop();
    }
  };

  Node.prototype.DFTraverse = function DFTraverse(callback) {
    // Depth First traverse
    this.eachNode(callback);
  };

  Node.prototype.BFTraverse = function BFTraverse(callback) {
    // Breadth First traverse
    var me = this;
    var nodes = [me];
    var current = nodes.shift();
    while (current) {
      callback(current);
      nodes = nodes.concat(current.children);
      current = nodes.shift();
    }
  };

  Node.prototype.getBoundingBox = function getBoundingBox() {
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
  };

  // translate

  Node.prototype.translate = function translate() {
    var tx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var ty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    this.eachNode(function (node) {
      node.x += tx;
      node.y += ty;
    });
  };

  Node.prototype.right2left = function right2left() {
    var me = this;
    var bb = me.getBoundingBox();
    me.eachNode(function (node) {
      node.x = node.x - (node.x - bb.left) * 2 - node.width;
      // node.x = - node.x;
    });
    me.translate(bb.width, 0);
  };

  Node.prototype.bottom2top = function bottom2top() {
    var me = this;
    var bb = me.getBoundingBox();
    me.eachNode(function (node) {
      node.y = node.y - (node.y - bb.top) * 2 - node.height;
      // node.y = - node.y;
    });
    me.translate(0, bb.height);
  };

  Node.prototype.getCenterX = function getCenterX() {
    var me = this;
    return me.x + me.width / 2;
  };

  Node.prototype.getCenterY = function getCenterY() {
    var me = this;
    return me.y + me.height / 2;
  };

  Node.prototype.getActualWidth = function getActualWidth() {
    var me = this;
    return me.width - me.hgap * 2;
  };

  Node.prototype.getActualHeight = function getActualHeight() {
    var me = this;
    return me.height - me.vgap * 2;
  };

  return Node;
}();

Node.prototype.each = Node.prototype.eachNode;

module.exports = Node;