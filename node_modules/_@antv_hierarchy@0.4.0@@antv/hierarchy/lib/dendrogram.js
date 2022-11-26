function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var TreeLayout = require('./layout/base');

var dendrogram = require('./layout/dendrogram');

var doTreeLayout = require('./layout/do-layout');

var util = require('./util');

var DendrogramLayout =
/*#__PURE__*/
function (_TreeLayout) {
  _inheritsLoose(DendrogramLayout, _TreeLayout);

  function DendrogramLayout() {
    return _TreeLayout.apply(this, arguments) || this;
  }

  var _proto = DendrogramLayout.prototype;

  _proto.execute = function execute() {
    var me = this;
    me.rootNode.width = 0;
    return doTreeLayout(me.rootNode, me.options, dendrogram);
  };

  return DendrogramLayout;
}(TreeLayout);

var DEFAULT_OPTIONS = {};

function dendrogramLayout(root, options) {
  options = util.assign({}, DEFAULT_OPTIONS, options);
  return new DendrogramLayout(root, options).execute();
}

module.exports = dendrogramLayout;