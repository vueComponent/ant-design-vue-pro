function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var assign = require('@antv/util/lib/mix');

var isNil = require('@antv/util/lib/type/is-nil');

var isObject = require('@antv/util/lib/type/is-object');

var uniqueId = require('@antv/util/lib/unique-id');

var EventEmitter = require('wolfy87-eventemitter');

var View = require('./view');

var CONSTANTS = require('./constants');

var DataSet =
/*#__PURE__*/
function (_EventEmitter) {
  _inheritsLoose(DataSet, _EventEmitter);

  function DataSet(initialProps) {
    var _this;

    if (initialProps === void 0) {
      initialProps = {
        state: {}
      };
    }

    _this = _EventEmitter.call(this) || this;

    var me = _assertThisInitialized(_assertThisInitialized(_this));

    assign(me, {
      _onChangeTimer: null,
      DataSet: DataSet,
      isDataSet: true,
      views: {}
    }, initialProps);
    return _this;
  }

  var _proto = DataSet.prototype;

  _proto._getUniqueViewName = function _getUniqueViewName() {
    var me = this;
    var name = uniqueId('view_');

    while (me.views[name]) {
      name = uniqueId('view_');
    }

    return name;
  };

  _proto.createView = function createView(name, options) {
    if (options === void 0) {
      options = {};
    }

    var me = this;

    if (isNil(name)) {
      name = me._getUniqueViewName();
    }

    if (isObject(name)) {
      options = name;
      name = me._getUniqueViewName();
    }

    if (me.views[name]) {
      throw new Error("data view exists: " + name);
    }

    var view = new View(me, options);
    me.views[name] = view;
    return view;
  };

  _proto.getView = function getView(name) {
    return this.views[name];
  };

  _proto.setView = function setView(name, view) {
    this.views[name] = view;
  };

  _proto.setState = function setState(name, value) {
    var me = this;
    me.state[name] = value;

    if (me._onChangeTimer) {
      clearTimeout(me._onChangeTimer);
      me._onChangeTimer = null;
    }

    me._onChangeTimer = setTimeout(function () {
      me.emit('statechange', name, value);
    }, 16); // execute after one frame
  };

  return DataSet;
}(EventEmitter);

assign(DataSet, {
  CONSTANTS: CONSTANTS,
  DataSet: DataSet,
  DataView: View,
  // alias
  View: View,
  connectors: {},
  transforms: {},
  registerConnector: function registerConnector(name, connector) {
    DataSet.connectors[name] = connector;
  },
  getConnector: function getConnector(name) {
    return DataSet.connectors[name] || DataSet.connectors.default;
  },
  registerTransform: function registerTransform(name, transform) {
    DataSet.transforms[name] = transform;
  },
  getTransform: function getTransform(name) {
    return DataSet.transforms[name] || DataSet.transforms.default;
  }
}, CONSTANTS);
View.DataSet = DataSet;
assign(DataSet.prototype, {
  view: DataSet.prototype.createView // alias

});
DataSet.version = '____DATASET_VERSION____';
module.exports = DataSet;