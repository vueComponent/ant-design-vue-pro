var hierarchy = require('./hierarchy');

var Layout =
/*#__PURE__*/
function () {
  function Layout(root, options) {
    if (options === void 0) {
      options = {};
    }

    var me = this;
    me.options = options;
    me.rootNode = hierarchy(root, options);
  }

  var _proto = Layout.prototype;

  _proto.execute = function execute() {
    throw new Error('please override this method');
  };

  return Layout;
}();

module.exports = Layout;