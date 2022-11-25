function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var TreeLayout = require('./layout/base');

var indentedTree = require('./layout/indented');

var separateTree = require('./layout/separate-root');

var util = require('./util');

var VALID_DIRECTIONS = ['LR', // left to right
'RL', // right to left
'H' // horizontal
];
var DEFAULT_DIRECTION = VALID_DIRECTIONS[0];

var IndentedLayout =
/*#__PURE__*/
function (_TreeLayout) {
  _inheritsLoose(IndentedLayout, _TreeLayout);

  function IndentedLayout() {
    return _TreeLayout.apply(this, arguments) || this;
  }

  var _proto = IndentedLayout.prototype;

  _proto.execute = function execute() {
    var me = this;
    var options = me.options;
    var root = me.rootNode;
    options.isHorizontal = true;
    var indent = options.indent;
    var direction = options.direction || DEFAULT_DIRECTION;

    if (direction && VALID_DIRECTIONS.indexOf(direction) === -1) {
      throw new TypeError("Invalid direction: " + direction);
    }

    if (direction === VALID_DIRECTIONS[0]) {
      // LR
      indentedTree(root, indent);
    } else if (direction === VALID_DIRECTIONS[1]) {
      // RL
      indentedTree(root, indent);
      root.right2left();
    } else if (direction === VALID_DIRECTIONS[2]) {
      // H
      // separate into left and right trees
      var _separateTree = separateTree(root, options),
          left = _separateTree.left,
          right = _separateTree.right;

      indentedTree(left, indent);
      left.right2left();
      indentedTree(right, indent);
      var bbox = left.getBoundingBox();
      right.translate(bbox.width, 0);
      root.x = right.x - root.width / 2;
    }

    return root;
  };

  return IndentedLayout;
}(TreeLayout);

var DEFAULT_OPTIONS = {};

function indentedLayout(root, options) {
  options = util.assign({}, DEFAULT_OPTIONS, options);
  return new IndentedLayout(root, options).execute();
}

module.exports = indentedLayout;