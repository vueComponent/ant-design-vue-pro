
const Node = require('./node');

class Layout {
  constructor(root, options = {}) {
    const me = this;
    me.options = options;
    me.rootNode = new Node(root, options);
  }

  execute() {
    throw new Error('please override this method');
  }
}

module.exports = Layout;