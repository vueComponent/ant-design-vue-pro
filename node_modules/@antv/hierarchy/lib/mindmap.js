function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var TreeLayout = require('./layout/base');

var mindmap = require('./layout/mindmap');

var doTreeLayout = require('./layout/do-layout');

var util = require('./util');

var MindmapLayout =
/*#__PURE__*/
function (_TreeLayout) {
  _inheritsLoose(MindmapLayout, _TreeLayout);

  function MindmapLayout() {
    return _TreeLayout.apply(this, arguments) || this;
  }

  var _proto = MindmapLayout.prototype;

  _proto.execute = function execute() {
    var me = this;
    return doTreeLayout(me.rootNode, me.options, mindmap);
  };

  return MindmapLayout;
}(TreeLayout);

var DEFAULT_OPTIONS = {};

function mindmapLayout(root, options) {
  options = util.assign({}, DEFAULT_OPTIONS, options);
  return new MindmapLayout(root, options).execute();
}

module.exports = mindmapLayout;