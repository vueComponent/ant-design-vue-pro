function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var TreeLayout = require('./layout/base');

var nonLayeredTidyTree = require('./layout/non-layered-tidy');

var doTreeLayout = require('./layout/do-layout');

var util = require('./util');

var CompactBoxTreeLayout =
/*#__PURE__*/
function (_TreeLayout) {
  _inheritsLoose(CompactBoxTreeLayout, _TreeLayout);

  function CompactBoxTreeLayout() {
    return _TreeLayout.apply(this, arguments) || this;
  }

  var _proto = CompactBoxTreeLayout.prototype;

  _proto.execute = function execute() {
    var me = this;
    return doTreeLayout(me.rootNode, me.options, nonLayeredTidyTree);
  };

  return CompactBoxTreeLayout;
}(TreeLayout);

var DEFAULT_OPTIONS = {};

function compactBoxLayout(root, options) {
  options = util.assign({}, DEFAULT_OPTIONS, options);
  return new CompactBoxTreeLayout(root, options).execute();
}

module.exports = compactBoxLayout;