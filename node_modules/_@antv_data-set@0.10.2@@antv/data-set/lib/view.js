function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var EventEmitter = require('wolfy87-eventemitter');

var assign = require('@antv/util/lib/mix');

var clone = require('@antv/util/lib/clone');

var cloneDeep = require('@antv/util/lib/clone');

var find = require('@antv/util/lib/array/find');

var forIn = require('@antv/util/lib/each');

var isArray = require('@antv/util/lib/type/is-array');

var isPlainObject = require('@antv/util/lib/type/is-plain-object');

var isMatch = require('@antv/util/lib/object/is-match');

var isObject = require('@antv/util/lib/type/is-object');

var isString = require('@antv/util/lib/type/is-string');

var keys = require('@antv/util/lib/object/keys');

var pick = require('@antv/util/lib/pick');

function cloneOptions(options) {
  var result = {};
  forIn(options, function (value, key) {
    if (isObject(value) && value.isView) {
      result[key] = value;
    } else if (isArray(value)) {
      result[key] = value.concat([]);
    } else if (isPlainObject(value)) {
      result[key] = clone(value);
    } else {
      result[key] = value;
    }
  });
  return result;
}

var View =
/*#__PURE__*/
function (_EventEmitter) {
  _inheritsLoose(View, _EventEmitter);

  // constructor
  function View(dataSet, options) {
    var _this;

    _this = _EventEmitter.call(this) || this;

    var me = _assertThisInitialized(_assertThisInitialized(_this));

    options = options || {};
    dataSet = dataSet || {};

    if (!dataSet.isDataSet) {
      options = dataSet;
      dataSet = null;
    }

    assign(me, {
      dataSet: dataSet,
      loose: !dataSet,
      dataType: 'table',
      isView: true,
      isDataView: true,
      // alias
      origin: [],
      rows: [],
      transforms: [],
      watchingStates: null
    }, options);

    if (!me.loose) {
      var watchingStates = me.watchingStates;
      dataSet.on('statechange', function (name) {
        if (isArray(watchingStates)) {
          if (watchingStates.indexOf(name) > -1) {
            me._reExecute();
          }
        } else {
          me._reExecute();
        }
      });
    }

    return _this;
  }

  var _proto = View.prototype;

  _proto._parseStateExpression = function _parseStateExpression(expr) {
    var dataSet = this.dataSet;
    var matched = /^\$state\.(\w+)/.exec(expr);

    if (matched) {
      return dataSet.state[matched[1]];
    }

    return expr;
  };

  _proto._preparseOptions = function _preparseOptions(options) {
    var me = this;
    var optionsCloned = cloneOptions(options);

    if (me.loose) {
      return optionsCloned;
    }

    forIn(optionsCloned, function (value, key) {
      if (isString(value) && /^\$state\./.test(value)) {
        optionsCloned[key] = me._parseStateExpression(value);
      }
    });
    return optionsCloned;
  }; // connectors


  _proto._prepareSource = function _prepareSource(source, options) {
    var me = this;
    var DataSet = View.DataSet; // warning me.origin is protected

    me._source = {
      source: source,
      options: options
    };

    if (!options) {
      if (source instanceof View || isString(source)) {
        me.origin = DataSet.getConnector('default')(source, me.dataSet);
      } else if (isArray(source)) {
        // TODO branch: if source is like ['dataview1', 'dataview2']
        me.origin = source;
      } else if (isObject(source) && source.type) {
        options = me._preparseOptions(source); // connector without source

        me.origin = DataSet.getConnector(options.type)(options, me);
      } else {
        throw new TypeError('Invalid source');
      }
    } else {
      options = me._preparseOptions(options);
      me.origin = DataSet.getConnector(options.type)(source, options, me);
    }

    me.rows = cloneDeep(me.origin);
    return me;
  };

  _proto.source = function source(_source, options) {
    var me = this;

    me._prepareSource(_source, options);

    me._reExecuteTransforms();

    me.trigger('change');
    return me;
  }; // transforms


  _proto.transform = function transform(options) {
    if (options === void 0) {
      options = {};
    }

    var me = this;
    me.transforms.push(options);

    me._executeTransform(options);

    return me;
  };

  _proto._executeTransform = function _executeTransform(options) {
    var me = this;
    options = me._preparseOptions(options);
    var transform = View.DataSet.getTransform(options.type);
    transform(me, options);
  };

  _proto._reExecuteTransforms = function _reExecuteTransforms() {
    var me = this;
    me.transforms.forEach(function (options) {
      me._executeTransform(options);
    });
  }; // rows


  _proto.addRow = function addRow(row) {
    this.rows.push(row);
  };

  _proto.removeRow = function removeRow(index) {
    this.rows.splice(index, 1);
  };

  _proto.updateRow = function updateRow(index, newRow) {
    assign(this.rows[index], newRow);
  };

  _proto.findRows = function findRows(query) {
    return this.rows.filter(function (row) {
      return isMatch(row, query);
    });
  };

  _proto.findRow = function findRow(query) {
    return find(this.rows, query);
  }; // columns


  _proto.getColumnNames = function getColumnNames() {
    var firstRow = this.rows[0];

    if (firstRow) {
      return keys(firstRow);
    }

    return [];
  };

  _proto.getColumnName = function getColumnName(index) {
    return this.getColumnNames()[index];
  };

  _proto.getColumnIndex = function getColumnIndex(columnName) {
    var columnNames = this.getColumnNames();
    return columnNames.indexOf(columnName);
  };

  _proto.getColumn = function getColumn(columnName) {
    return this.rows.map(function (row) {
      return row[columnName];
    });
  };

  _proto.getColumnData = function getColumnData(columnName) {
    return this.getColumn(columnName);
  }; // data process


  _proto.getSubset = function getSubset(startRowIndex, endRowIndex, columnNames) {
    var subset = [];

    for (var i = startRowIndex; i <= endRowIndex; i++) {
      subset.push(pick(this.rows[i], columnNames));
    }

    return subset;
  };

  _proto.toString = function toString(prettyPrint) {
    var me = this;

    if (prettyPrint) {
      return JSON.stringify(me.rows, null, 2);
    }

    return JSON.stringify(me.rows);
  };

  _proto._reExecute = function _reExecute() {
    var me = this;
    var _me$_source = me._source,
        source = _me$_source.source,
        options = _me$_source.options;

    me._prepareSource(source, options);

    me._reExecuteTransforms();

    me.trigger('change');
  };

  return View;
}(EventEmitter);

module.exports = View;