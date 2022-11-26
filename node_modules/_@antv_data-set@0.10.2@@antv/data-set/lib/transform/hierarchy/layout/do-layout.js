
const separateTree = require('./separate-root');
const VALID_DIRECTIONS = ['LR', // left to right
'RL', // right to left
'TB', // top to bottom
'BT', // bottom to top
'H', // horizontal
'V' // vertical
];
const HORIZONTAL_DIRECTIONS = ['LR', 'RL', 'H'];
const isHorizontal = direction => HORIZONTAL_DIRECTIONS.indexOf(direction) > -1;
const DEFAULT_DIRECTION = VALID_DIRECTIONS[0];

module.exports = (root, options, layoutAlgrithm) => {
  const direction = options.direction || DEFAULT_DIRECTION;
  options.isHorizontal = isHorizontal(direction);
  if (direction && VALID_DIRECTIONS.indexOf(direction) === -1) {
    throw new TypeError(`Invalid direction: ${direction}`);
  }

  if (direction === VALID_DIRECTIONS[0]) {
    // LR
    layoutAlgrithm(root, options);
    // setAnchors(root, 'L', 'R', options);
  } else if (direction === VALID_DIRECTIONS[1]) {
    // RL
    layoutAlgrithm(root, options);
    root.right2left();
    // anchors
    // setAnchors(root, 'R', 'L', options);
  } else if (direction === VALID_DIRECTIONS[2]) {
    // TB
    layoutAlgrithm(root, options);
    // setAnchors(root, 'T', 'B', options);
  } else if (direction === VALID_DIRECTIONS[3]) {
    // BT
    layoutAlgrithm(root, options);
    root.bottom2top();
    // setAnchors(root, 'B', 'T', options);
  } else if (direction === VALID_DIRECTIONS[4] || direction === VALID_DIRECTIONS[5]) {
    // H or V
    // separate into left and right trees
    const { left, right } = separateTree(root, options);
    // do layout for left and right trees
    layoutAlgrithm(left, options);
    layoutAlgrithm(right, options);
    // if (options.isHorizontal) {
    //   setAnchors(left, 'R', 'L', options);
    //   setAnchors(right, 'L', 'R', options);
    // } else {
    //   setAnchors(left, 'B', 'T', options);
    //   setAnchors(right, 'T', 'B', options);
    // }
    options.isHorizontal ? left.right2left() : left.bottom2top();
    // combine left and right trees
    right.translate(left.x - right.x, left.y - right.y);
    // translate root
    root.x = left.x;
    root.y = right.y;
    // setAnchors(root, 'C', 'C', options, true);
    const bb = root.getBoundingBox();
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
  root.eachNode(node => {
    const data = node.data;
    data.x = node.x + node.width / 2 + node.hgap;
    data.y = node.y + node.height / 2 + node.vgap;
    data.align = node.align;
    // data.inAnchor = node.inAnchor ? [ node.inAnchor.x, node.inAnchor.y ] : null;
    // data.outAnchor = node.outAnchor ? [ node.outAnchor.x, node.outAnchor.y ] : null;
  });
  return root;
};