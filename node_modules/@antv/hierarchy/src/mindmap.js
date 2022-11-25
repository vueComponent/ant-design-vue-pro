const TreeLayout = require('./layout/base');
const mindmap = require('./layout/mindmap');
const doTreeLayout = require('./layout/do-layout');
const util = require('./util');

class MindmapLayout extends TreeLayout {
  execute() {
    const me = this;
    return doTreeLayout(me.rootNode, me.options, mindmap);
  }
}

const DEFAULT_OPTIONS = {
};

function mindmapLayout(root, options) {
  options = util.assign({}, DEFAULT_OPTIONS, options);
  return new MindmapLayout(root, options).execute();
}

module.exports = mindmapLayout;
