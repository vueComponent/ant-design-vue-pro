// wrap tree node
function WrappedTree(w, h, y, c = []) {
  const me = this;
    // size
  me.w = w || 0;
  me.h = h || 0;

    // position
  me.y = y || 0;
  me.x = 0;

    // children
  me.c = c || [];
  me.cs = c.length;

    // modified
  me.prelim = 0;
  me.mod = 0;
  me.shift = 0;
  me.change = 0;

    // left/right tree
  me.tl = null;
  me.tr = null;

    // extreme left/right tree
  me.el = null;
  me.er = null;

    // modified left/right tree
  me.msel = 0;
  me.mser = 0;
}

WrappedTree.fromNode = (root, isHorizontal) => {
  if (!root) return null;
  const children = [];
  root.children.forEach(child => {
    children.push(WrappedTree.fromNode(child, isHorizontal));
  });
  if (isHorizontal) return new WrappedTree(root.height, root.width, root.x, children);
  return new WrappedTree(root.width, root.height, root.y, children);
};

// node utils
function moveRight(node, move, isHorizontal) {
  if (isHorizontal) {
    node.y += move;
  } else {
    node.x += move;
  }
  node.children.forEach(child => {
    moveRight(child, move, isHorizontal);
  });
}

function getMin(node, isHorizontal) {
  let res = isHorizontal ? node.y : node.x;
  node.children.forEach(child => {
    res = Math.min(getMin(child, isHorizontal), res);
  });
  return res;
}

function normalize(node, isHorizontal) {
  const min = getMin(node, isHorizontal);
  moveRight(node, -min, isHorizontal);
}

function convertBack(converted/* WrappedTree */, root/* TreeNode */, isHorizontal) {
  if (isHorizontal) {
    root.y = converted.x;
  } else {
    root.x = converted.x;
  }
  converted.c.forEach((child, i) => {
    convertBack(child, root.children[i], isHorizontal);
  });
}

function layer(node, isHorizontal, d = 0) {
  if (isHorizontal) {
    node.x = d;
    d += node.width;
  } else {
    node.y = d;
    d += node.height;
  }
  node.children.forEach(child => {
    layer(child, isHorizontal, d);
  });
}

module.exports = (root, options = {}) => {
  const isHorizontal = options.isHorizontal;
  function firstWalk(t) {
    if (t.cs === 0) {
      setExtremes(t);
      return;
    }
    firstWalk(t.c[0]);
    let ih = updateIYL(bottom(t.c[0].el), 0, null);
    for (let i = 1; i < t.cs; ++i) {
      firstWalk(t.c[i]);
      const min = bottom(t.c[i].er);
      separate(t, i, ih);
      ih = updateIYL(min, i, ih);
    }
    positionRoot(t);
    setExtremes(t);
  }

  function setExtremes(t) {
    if (t.cs === 0) {
      t.el = t;
      t.er = t;
      t.msel = t.mser = 0;
    } else {
      t.el = t.c[0].el;
      t.msel = t.c[0].msel;
      t.er = t.c[t.cs - 1].er;
      t.mser = t.c[t.cs - 1].mser;
    }
  }

  function separate(t, i, ih) {
    let sr = t.c[i - 1];
    let mssr = sr.mod;
    let cl = t.c[i];
    let mscl = cl.mod;
    while (sr !== null && cl !== null) {
      if (bottom(sr) > ih.low) ih = ih.nxt;
      const dist = (mssr + sr.prelim + sr.w) - (mscl + cl.prelim);
      if (dist > 0) {
        mscl += dist;
        moveSubtree(t, i, ih.index, dist);
      }
      const sy = bottom(sr);
      const cy = bottom(cl);
      if (sy <= cy) {
        sr = nextRightContour(sr);
        if (sr !== null) mssr += sr.mod;
      }
      if (sy >= cy) {
        cl = nextLeftContour(cl);
        if (cl !== null) mscl += cl.mod;
      }
    }
    if (!sr && !!cl) {
      setLeftThread(t, i, cl, mscl);
    } else if (!!sr && !cl) {
      setRightThread(t, i, sr, mssr);
    }
  }

  function moveSubtree(t, i, si, dist) {
    t.c[i].mod += dist;
    t.c[i].msel += dist;
    t.c[i].mser += dist;
    distributeExtra(t, i, si, dist);
  }

  function nextLeftContour(t) {
    return t.cs === 0 ? t.tl : t.c[0];
  }

  function nextRightContour(t) {
    return t.cs === 0 ? t.tr : t.c[t.cs - 1];
  }

  function bottom(t) {
    return t.y + t.h;
  }

  function setLeftThread(t, i, cl, modsumcl) {
    const li = t.c[0].el;
    li.tl = cl;
    const diff = (modsumcl - cl.mod) - t.c[0].msel;
    li.mod += diff;
    li.prelim -= diff;
    t.c[0].el = t.c[i].el;
    t.c[0].msel = t.c[i].msel;
  }

  function setRightThread(t, i, sr, modsumsr) {
    const ri = t.c[i].er;
    ri.tr = sr;
    const diff = (modsumsr - sr.mod) - t.c[i].mser;
    ri.mod += diff;
    ri.prelim -= diff;
    t.c[i].er = t.c[i - 1].er;
    t.c[i].mser = t.c[i - 1].mser;
  }

  function positionRoot(t) {
    t.prelim = (
      t.c[0].prelim + t.c[0].mod + t.c[t.cs - 1].mod +
      t.c[t.cs - 1].prelim + t.c[t.cs - 1].w
    ) / 2 - t.w / 2;
  }

  function secondWalk(t, modsum) {
    modsum += t.mod;
    t.x = t.prelim + modsum;
    addChildSpacing(t);
    for (let i = 0; i < t.cs; i++) {
      secondWalk(t.c[i], modsum);
    }
  }

  function distributeExtra(t, i, si, dist) {
    if (si !== i - 1) {
      const nr = i - si;
      t.c[si + 1].shift += dist / nr;
      t.c[i].shift -= dist / nr;
      t.c[i].change -= dist - dist / nr;
    }
  }

  function addChildSpacing(t) {
    let d = 0;
    let modsumdelta = 0;
    for (let i = 0; i < t.cs; i++) {
      d += t.c[i].shift;
      modsumdelta += d + t.c[i].change;
      t.c[i].mod += modsumdelta;
    }
  }

  function updateIYL(low, index, ih) {
    while (ih !== null && low >= ih.low) {
      ih = ih.nxt;
    }
    return {
      low,
      index,
      nxt: ih
    };
  }

  // do layout
  layer(root, isHorizontal);
  const wt = WrappedTree.fromNode(root, isHorizontal);
  firstWalk(wt);
  secondWalk(wt, 0);
  convertBack(wt, root, isHorizontal);
  normalize(root, isHorizontal);

  return root;
};
