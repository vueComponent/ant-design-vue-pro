const TreeLayout = require('./layout/base');
const nonLayeredTidyTree = require('./layout/non-layered-tidy');
const doTreeLayout = require('./layout/do-layout');
const util = require('./util');

class CompactBoxTreeLayout extends TreeLayout {
  execute() {
    const me = this;
    return doTreeLayout(me.rootNode, me.options, nonLayeredTidyTree);
  }
}

const DEFAULT_OPTIONS = {
};

function compactBoxLayout(root, options) {
  options = util.assign({}, DEFAULT_OPTIONS, options);
  return new CompactBoxTreeLayout(root, options).execute();
}

module.exports = compactBoxLayout;
