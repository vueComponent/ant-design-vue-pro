const TreeLayout = require('./layout/base');
const dendrogram = require('./layout/dendrogram');
const doTreeLayout = require('./layout/do-layout');
const util = require('./util');

class DendrogramLayout extends TreeLayout {
  execute() {
    const me = this;
    me.rootNode.width = 0;
    return doTreeLayout(me.rootNode, me.options, dendrogram);
  }
}

const DEFAULT_OPTIONS = {
};

function dendrogramLayout(root, options) {
  options = util.assign({}, DEFAULT_OPTIONS, options);
  return new DendrogramLayout(root, options).execute();
}

module.exports = dendrogramLayout;
