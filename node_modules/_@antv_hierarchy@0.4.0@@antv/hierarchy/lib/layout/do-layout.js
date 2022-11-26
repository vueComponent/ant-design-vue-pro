var separateTree = require('./separate-root');

var VALID_DIRECTIONS = ['LR', // left to right
'RL', // right to left
'TB', // top to bottom
'BT', // bottom to top
'H', // horizontal
'V' // vertical
];
var HORIZONTAL_DIRECTIONS = ['LR', 'RL', 'H'];

var isHorizontal = function isHorizontal(direction) {
  return HORIZONTAL_DIRECTIONS.indexOf(direction) > -1;
};

var DEFAULT_DIRECTION = VALID_DIRECTIONS[0];

module.exports = function (root, options, layoutAlgrithm) {
  var direction = options.direction || DEFAULT_DIRECTION;
  options.isHorizontal = isHorizontal(direction);

  if (direction && VALID_DIRECTIONS.indexOf(direction) === -1) {
    throw new TypeError("Invalid direction: " + direction);
  }

  if (direction === VALID_DIRECTIONS[0]) {
    // LR
    layoutAlgrithm(root, options);
  } else if (direction === VALID_DIRECTIONS[1]) {
    // RL
    layoutAlgrithm(root, options);
    root.right2left();
  } else if (direction === VALID_DIRECTIONS[2]) {
    // TB
    layoutAlgrithm(root, options);
  } else if (direction === VALID_DIRECTIONS[3]) {
    // BT
    layoutAlgrithm(root, options);
    root.bottom2top();
  } else if (direction === VALID_DIRECTIONS[4] || direction === VALID_DIRECTIONS[5]) {
    // H or V
    // separate into left and right trees
    var _separateTree = separateTree(root, options),
        left = _separateTree.left,
        right = _separateTree.right; // do layout for left and right trees


    layoutAlgrithm(left, options);
    layoutAlgrithm(right, options);
    options.isHorizontal ? left.right2left() : left.bottom2top(); // combine left and right trees

    right.translate(left.x - right.x, left.y - right.y); // translate root

    root.x = left.x;
    root.y = right.y;
    var bb = root.getBoundingBox();

    if (options.isHorizontal) {
      if (bb.top < 0) {
        root.translate(0, -bb.top);
      }
    } else {
      if (bb.left < 0) {
        root.translate(-bb.left, 0);
      }
    }
  }

  root.translate(-(root.x + root.width / 2 + root.hgap), -(root.y + root.height / 2 + root.vgap));
  return root;
};