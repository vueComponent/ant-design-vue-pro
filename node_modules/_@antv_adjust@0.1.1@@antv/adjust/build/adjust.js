(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["adjust"] = factory();
	else
		root["adjust"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(12);

var isArray = __webpack_require__(1);

var each = function each(elements, func) {
  if (!elements) {
    return;
  }

  var rst = void 0;

  if (isArray(elements)) {
    for (var i = 0, len = elements.length; i < len; i++) {
      rst = func(elements[i], i);

      if (rst === false) {
        break;
      }
    }
  } else if (isObject(elements)) {
    for (var k in elements) {
      if (elements.hasOwnProperty(k)) {
        rst = func(elements[k], k);

        if (rst === false) {
          break;
        }
      }
    }
  }
};

module.exports = each;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var isType = __webpack_require__(5);

var isArray = Array.isArray ? Array.isArray : function (value) {
  return isType(value, 'Array');
};
module.exports = isArray;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var mix = __webpack_require__(3);

var Adjust =
/*#__PURE__*/
function () {
  var _proto = Adjust.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    this.adjustNames = ['x', 'y']; // 调整的维度，默认,x,y都做调整
  };

  function Adjust(cfg) {
    this._initDefaultCfg();

    mix(this, cfg);
  }
  /**
   * @override
   */


  _proto.processAdjust = function processAdjust()
  /* dataArray */
  {};

  return Adjust;
}();

module.exports = Adjust;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function _mix(dist, obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && key !== 'constructor' && obj[key] !== undefined) {
      dist[key] = obj[key];
    }
  }
}

var mix = function mix(dist, src1, src2, src3) {
  if (src1) _mix(dist, src1);
  if (src2) _mix(dist, src2);
  if (src3) _mix(dist, src3);
  return dist;
};

module.exports = mix;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var merge = function merge(dataArray) {
  var rst = [];

  for (var i = 0; i < dataArray.length; i++) {
    rst = rst.concat(dataArray[i]);
  }

  return rst;
};

module.exports = merge;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var toString = {}.toString;

var isType = function isType(value, type) {
  return toString.call(value) === '[object ' + type + ']';
};

module.exports = isType;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// isFinite,
var isNil = function isNil(value) {
  /**
   * isNil(null) => true
   * isNil() => true
   */
  return value === null || value === undefined;
};

module.exports = isNil;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var DEFAULT_Y = 0; // 默认的y的值

var each = __webpack_require__(0);

var ArrayUtil = {
  values: __webpack_require__(8)
};
module.exports = {
  /**
   * 对应的维度是否可以调整
   * @protected
   * @param  {String}  dimName 可以调整的维度 x,y
   * @return {Boolean} 是否可以调整
   */
  isAdjust: function isAdjust(dimName) {
    return this.adjustNames.indexOf(dimName) >= 0;
  },

  /**
   * @protected
   * 获取可调整度量对应的值
   * @param  {Frame} mergeData 数据
   * @return {Object} 值的映射
   */
  _getDimValues: function _getDimValues(mergeData) {
    var self = this;
    var valuesMap = {};
    var dims = [];

    if (self.xField && self.isAdjust('x')) {
      dims.push(self.xField);
    }

    if (self.yField && self.isAdjust('y')) {
      dims.push(self.yField);
    }

    each(dims, function (dim) {
      var values = ArrayUtil.values(mergeData, dim);
      values.sort(function (v1, v2) {
        return v1 - v2;
      });
      valuesMap[dim] = values;
    });

    if (!self.yField && self.isAdjust('y')) {
      // 只有一维的情况下,同时调整y
      var dim = 'y';
      var values = [DEFAULT_Y, 1]; // 默认分布在y轴的 0.1 与 0.2 之间

      valuesMap[dim] = values;
    }

    return valuesMap;
  },
  adjustData: function adjustData(dataArray, mergeData) {
    var self = this;

    var valuesMap = self._getDimValues(mergeData);

    each(dataArray, function (data, index) {
      // 遍历所有数据集合
      each(valuesMap, function (values, dim) {
        // 根据不同的度量分别调整位置
        self.adjustDim(dim, values, data, dataArray.length, index);
      });
    });
  },
  getAdjustRange: function getAdjustRange(dim, key, values) {
    var self = this;
    var index = values.indexOf(key);
    var length = values.length;
    var pre;
    var next;

    if (!self.yField && self.isAdjust('y')) {
      pre = 0;
      next = 1;
    } else if (length > 1) {
      pre = index === 0 ? values[0] : values[index - 1];
      next = index === length - 1 ? values[length - 1] : values[index + 1];

      if (index !== 0) {
        pre += (key - pre) / 2;
      } else {
        pre -= (next - key) / 2;
      }

      if (index !== length - 1) {
        next -= (next - key) / 2;
      } else {
        next += (key - values[length - 2]) / 2;
      }
    } else {
      pre = key === 0 ? 0 : key - 0.5;
      next = key === 0 ? 1 : key + 0.5;
    }

    return {
      pre: pre,
      next: next
    };
  },

  /**
   * 对数据进行分组
   * @param  {Array} data 数据
   * @param  {String} dim 分组的字段
   * @return {Object}  分组的键值对映射
   */
  groupData: function groupData(data, dim) {
    var groups = {};
    each(data, function (record) {
      var value = record[dim];

      if (value === undefined) {
        value = record[dim] = DEFAULT_Y;
      }

      if (!groups[value]) {
        groups[value] = [];
      }

      groups[value].push(record);
    });
    return groups;
  }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var isNil = __webpack_require__(6);

var isArray = __webpack_require__(1);

var each = __webpack_require__(0);

module.exports = function valuesOfKey(data, name) {
  var rst = [];
  var tmpMap = {};

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    var value = obj[name];

    if (!isNil(value)) {
      if (!isArray(value)) {
        value = [value];
      }

      each(value, function (val) {
        if (!tmpMap[val]) {
          rst.push(val);
          tmpMap[val] = true;
        }
      });
    }
  }

  return rst;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * 是否为函数
 * @param  {*} fn 对象
 * @return {Boolean}  是否函数
 */
var isType = __webpack_require__(5);

var isFunction = function isFunction(value) {
  return isType(value, 'Function');
};

module.exports = isFunction;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// 完整版下使用支持按照某个字段进行分组的 dodge
var mix = __webpack_require__(3);

var Adjust = __webpack_require__(2);

var Dodge = __webpack_require__(11);

var Stack = __webpack_require__(13);

var AdjustMixin = __webpack_require__(7);

var DodgeMixin = __webpack_require__(14);

var StackMixin = __webpack_require__(18);

mix(Adjust.prototype, AdjustMixin);
mix(Dodge.prototype, AdjustMixin, DodgeMixin);
mix(Stack.prototype, StackMixin);
Adjust.Jitter = __webpack_require__(19);
Adjust.Symmetric = __webpack_require__(20);
Adjust.Dodge = Dodge;
Adjust.Stack = Stack;
module.exports = Adjust;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Adjust = __webpack_require__(2);

var each = __webpack_require__(0);

var MARGIN_RATIO = 1 / 2;
var DODGE_RATIO = 1 / 2;

var Dodge =
/*#__PURE__*/
function (_Adjust) {
  _inheritsLoose(Dodge, _Adjust);

  function Dodge() {
    return _Adjust.apply(this, arguments) || this;
  }

  var _proto = Dodge.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    /**
     * 调整过程中,2个数据的间距
     * @type {Number}
     */
    this.marginRatio = MARGIN_RATIO;
    /**
     * 调整占单位宽度的比例,例如：占2个分类间距的 1/2
     * @type {Number}
     */

    this.dodgeRatio = DODGE_RATIO;
    this.adjustNames = ['x', 'y']; // 调整的维度，默认,x,y都做调整
  };

  _proto.getDodgeOffset = function getDodgeOffset(range, index, count) {
    var self = this;
    var pre = range.pre;
    var next = range.next;
    var tickLength = next - pre;
    var width = tickLength * self.dodgeRatio / count;
    var margin = self.marginRatio * width;
    var offset = 1 / 2 * (tickLength - count * width - (count - 1) * margin) + ((index + 1) * width + index * margin) - 1 / 2 * width - 1 / 2 * tickLength;
    return (pre + next) / 2 + offset;
  };

  _proto.processAdjust = function processAdjust(dataArray) {
    var self = this;
    var count = dataArray.length;
    var xField = self.xField;
    each(dataArray, function (data, index) {
      for (var i = 0, len = data.length; i < len; i++) {
        var obj = data[i];
        var value = obj[xField];
        var range = {
          pre: len === 1 ? value - 1 : value - 0.5,
          next: len === 1 ? value + 1 : value + 0.5
        };
        var dodgeValue = self.getDodgeOffset(range, index, count);
        obj[xField] = dodgeValue;
      }
    });
  };

  return Dodge;
}(Adjust);

Adjust.Dodge = Dodge;
module.exports = Dodge;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var isObject = function isObject(value) {
  /**
   * isObject({}) => true
   * isObject([1, 2, 3]) => true
   * isObject(Function) => true
   * isObject(null) => false
   */
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value !== null && type === 'object' || type === 'function';
};

module.exports = isObject;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var isArray = __webpack_require__(1);

var isNil = __webpack_require__(6);

var Adjust = __webpack_require__(2);

var Stack =
/*#__PURE__*/
function (_Adjust) {
  _inheritsLoose(Stack, _Adjust);

  function Stack() {
    return _Adjust.apply(this, arguments) || this;
  }

  var _proto = Stack.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称

    this.yField = null; // 调整对应的 y 方向对应的字段名称
  };

  _proto.processAdjust = function processAdjust(dataArray) {
    this.processStack(dataArray);
  };

  _proto.processStack = function processStack(dataArray) {
    var self = this;
    var xField = self.xField;
    var yField = self.yField;
    var count = dataArray.length;
    var stackCache = {
      positive: {},
      negative: {}
    }; // 层叠顺序翻转

    if (self.reverseOrder) {
      dataArray = dataArray.slice(0).reverse();
    }

    for (var i = 0; i < count; i++) {
      var data = dataArray[i];

      for (var j = 0, len = data.length; j < len; j++) {
        var item = data[j];
        var x = item[xField] || 0;
        var y = item[yField];
        var xkey = x.toString();
        y = isArray(y) ? y[1] : y;

        if (!isNil(y)) {
          var direction = y >= 0 ? 'positive' : 'negative';

          if (!stackCache[direction][xkey]) {
            stackCache[direction][xkey] = 0;
          }

          item[yField] = [stackCache[direction][xkey], y + stackCache[direction][xkey]];
          stackCache[direction][xkey] += y;
        }
      }
    }
  };

  return Stack;
}(Adjust);

Adjust.Stack = Stack;
module.exports = Stack;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var ArrayUtil = {
  merge: __webpack_require__(4),
  values: __webpack_require__(8)
};

var group = __webpack_require__(15);

var each = __webpack_require__(0);

module.exports = {
  /**
   * @protected
   * @override
   */
  processAdjust: function processAdjust(dataArray) {
    var self = this;
    var mergeData = ArrayUtil.merge(dataArray);
    var dodgeDim = self.dodgeBy;
    var adjDataArray = dataArray;

    if (dodgeDim) {
      // 如果指定了分组dim的字段
      adjDataArray = group(mergeData, dodgeDim);
    }

    self.cacheMap = {};
    self.adjDataArray = adjDataArray;
    self.mergeData = mergeData;
    self.adjustData(adjDataArray, mergeData);
    self.adjDataArray = null;
    self.mergeData = null;
  },
  getDistribution: function getDistribution(dim) {
    var self = this;
    var dataArray = self.adjDataArray;
    var cacheMap = self.cacheMap;
    var map = cacheMap[dim];

    if (!map) {
      map = {};
      each(dataArray, function (data, index) {
        var values = ArrayUtil.values(data, dim);

        if (!values.length) {
          values.push(0);
        }

        each(values, function (val) {
          if (!map[val]) {
            map[val] = [];
          }

          map[val].push(index);
        });
      });
      cacheMap[dim] = map;
    }

    return map;
  },
  adjustDim: function adjustDim(dim, values, data, frameCount, frameIndex) {
    var self = this;
    var map = self.getDistribution(dim);
    var groupData = self.groupData(data, dim); // 根据值分组

    each(groupData, function (group, key) {
      key = parseFloat(key);
      var range;

      if (values.length === 1) {
        range = {
          pre: values[0] - 1,
          next: values[0] + 1
        };
      } else {
        range = self.getAdjustRange(dim, key, values);
      }

      each(group, function (record) {
        var value = record[dim];
        var valueArr = map[value];
        var valIndex = valueArr.indexOf(frameIndex);
        record[dim] = self.getDodgeOffset(range, valIndex, valueArr.length);
      });
    });
  }
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var groupToMap = __webpack_require__(16);

var group = function group(data, condition) {
  if (!condition) {
    return [data];
  }

  var groups = groupToMap(data, condition);
  var array = [];

  for (var i in groups) {
    array.push(groups[i]);
  }

  return array;
};

module.exports = group;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(9);

var isArray = __webpack_require__(1);

var groupBy = __webpack_require__(17);

var groupToMap = function groupToMap(data, condition) {
  if (!condition) {
    return {
      0: data
    };
  }

  if (!isFunction(condition)) {
    var paramsCondition = isArray(condition) ? condition : condition.replace(/\s+/g, '').split('*');

    condition = function condition(row) {
      var unique = '_'; // 避免出现数字作为Key的情况，会进行按照数字的排序

      for (var i = 0, l = paramsCondition.length; i < l; i++) {
        unique += row[paramsCondition[i]] && row[paramsCondition[i]].toString();
      }

      return unique;
    };
  }

  var groups = groupBy(data, condition);
  return groups;
};

module.exports = groupToMap;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var each = __webpack_require__(0);

var isArray = __webpack_require__(1);

var hasOwnProperty = Object.prototype.hasOwnProperty;

var groupBy = function groupBy(data, condition) {
  if (!condition || !isArray(data)) {
    return data;
  }

  var result = {};
  var key = null;
  each(data, function (item) {
    key = condition(item);

    if (hasOwnProperty.call(result, key)) {
      result[key].push(item);
    } else {
      result[key] = [item];
    }
  });
  return result;
};

module.exports = groupBy;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = {
  _initDefaultCfg: function _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称

    this.yField = null; // 调整对应的 y 方向对应的字段名称

    this.height = null; // 仅有一个维度调整时，总的高度

    this.size = 10; // 单个点的大小

    this.reverseOrder = false; // 是否反序进行层叠

    this.adjustNames = ['y']; // Only support stack y
  },
  processOneDimStack: function processOneDimStack(dataArray) {
    var self = this;
    var xField = self.xField;
    var yField = self.yField || 'y';
    var height = self.height;
    var stackY = {}; // 如果层叠的顺序翻转

    if (self.reverseOrder) {
      dataArray = dataArray.slice(0).reverse();
    }

    for (var i = 0, len = dataArray.length; i < len; i++) {
      var data = dataArray[i]; // cates

      for (var j = 0, dataLen = data.length; j < dataLen; j++) {
        var item = data[j];
        var size = item.size || self.size;
        var stackHeight = size * 2 / height;
        var x = item[xField];

        if (!stackY[x]) {
          stackY[x] = stackHeight / 2;
        }

        item[yField] = stackY[x];
        stackY[x] += stackHeight;
      }
    }
  },
  processAdjust: function processAdjust(dataArray) {
    if (this.yField) {
      this.processStack(dataArray);
    } else {
      this.processOneDimStack(dataArray);
    }
  }
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var each = __webpack_require__(0);

var mix = __webpack_require__(3);

var ArrayUtil = {
  merge: __webpack_require__(4)
};

var Adjust = __webpack_require__(2);

var AdjustMixin = __webpack_require__(7);

var Jitter =
/*#__PURE__*/
function (_Adjust) {
  _inheritsLoose(Jitter, _Adjust);

  function Jitter() {
    return _Adjust.apply(this, arguments) || this;
  }

  var _proto = Jitter.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称

    this.yField = null; // 调整对应的 y 方向对应的字段名称

    this.adjustNames = ['x', 'y']; // 指x,y

    this.groupFields = null; // 参与分组的数据维度
  };

  _proto.processAdjust = function processAdjust(dataArray) {
    var self = this;
    var mergeData = ArrayUtil.merge(dataArray);
    self.adjDataArray = dataArray;
    self.mergeData = mergeData;
    self.adjustData(dataArray, mergeData);
    self.adjFrames = null;
    self.mergeData = null;
  };

  _proto.getAdjustOffset = function getAdjustOffset(pre, next) {
    var r = Math.random(); // 随机位置，均匀分布

    var avg = next - pre; // * length

    var append = avg * 0.05;
    return pre + append + avg * 0.9 * r;
  }; // adjust group data


  _proto._adjustGroup = function _adjustGroup(group, dim, key, values) {
    var self = this;
    var range = self.getAdjustRange(dim, key, values);
    each(group, function (record) {
      record[dim] = self.getAdjustOffset(range.pre, range.next); // 获取调整的位置
    });
  };

  _proto.adjustDim = function adjustDim(dim, values, data) {
    var self = this;
    var groupData = self.groupData(data, dim);
    each(groupData, function (group, key) {
      key = parseFloat(key);

      self._adjustGroup(group, dim, key, values);
    });
  };

  return Jitter;
}(Adjust);

mix(Jitter.prototype, AdjustMixin);
Adjust.Jitter = Jitter;
module.exports = Jitter;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var each = __webpack_require__(0);

var maxBy = __webpack_require__(21);

var isArray = __webpack_require__(1);

var ArrayUtil = {
  merge: __webpack_require__(4)
};

var Adjust = __webpack_require__(2);

var Symmetric =
/*#__PURE__*/
function (_Adjust) {
  _inheritsLoose(Symmetric, _Adjust);

  function Symmetric() {
    return _Adjust.apply(this, arguments) || this;
  }

  var _proto = Symmetric.prototype;

  _proto._initDefaultCfg = function _initDefaultCfg() {
    this.xField = null; // 调整对应的 x 方向对应的字段名称

    this.yField = null; // 调整对应的 y 方向对应的字段名称

    this.cacheMax = null; // 缓存的最大值

    this.adjustNames = ['y']; // Only support stack y

    this.groupFields = null; // 参与分组的数据维度
  }; // 获取最大的y值


  _proto._getMax = function _getMax(dim) {
    var self = this;
    var mergeData = self.mergeData;
    var maxRecord = maxBy(mergeData, function (obj) {
      var value = obj[dim];

      if (isArray(value)) {
        return Math.max.apply(null, value);
      }

      return value;
    });
    var maxValue = maxRecord[dim];
    var max = isArray(maxValue) ? Math.max.apply(null, maxValue) : maxValue;
    return max;
  }; // 获取每个字段最大的值


  _proto._getXValuesMax = function _getXValuesMax() {
    var self = this;
    var yField = self.yField;
    var xField = self.xField;
    var cache = {};
    var mergeData = self.mergeData;
    each(mergeData, function (obj) {
      var xValue = obj[xField];
      var yValue = obj[yField];
      var max = isArray(yValue) ? Math.max.apply(null, yValue) : yValue;
      cache[xValue] = cache[xValue] || 0;

      if (cache[xValue] < max) {
        cache[xValue] = max;
      }
    });
    return cache;
  }; // 入口函数


  _proto.processAdjust = function processAdjust(dataArray) {
    var self = this;
    var mergeData = ArrayUtil.merge(dataArray);
    self.mergeData = mergeData;

    self._processSymmetric(dataArray);

    self.mergeData = null;
  }; // 处理对称


  _proto._processSymmetric = function _processSymmetric(dataArray) {
    var self = this;
    var xField = self.xField;
    var yField = self.yField;

    var max = self._getMax(yField);

    var first = dataArray[0][0];
    var cache;

    if (first && isArray(first[yField])) {
      cache = self._getXValuesMax();
    }

    each(dataArray, function (data) {
      each(data, function (obj) {
        var value = obj[yField];
        var offset;

        if (isArray(value)) {
          var xValue = obj[xField];
          var valueMax = cache[xValue];
          offset = (max - valueMax) / 2;
          var tmp = [];
          /* eslint-disable no-loop-func */

          each(value, function (subVal) {
            // 多个字段
            tmp.push(offset + subVal);
          });
          /* eslint-enable no-loop-func */

          obj[yField] = tmp;
        } else {
          offset = (max - value) / 2;
          obj[yField] = [offset, value + offset];
        }
      });
    });
  };

  return Symmetric;
}(Adjust);

Adjust.Symmetric = Symmetric;
module.exports = Symmetric;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(1);

var isFunction = __webpack_require__(9);

var each = __webpack_require__(0);
/**
 * @param {Array} arr The array to iterate over.
 * @param {Function} [fn] The iteratee invoked per element.
 * @return {*} Returns the maximum value.
 * @example
 *
 * var objects = [{ 'n': 1 }, { 'n': 2 }];
 *
 * maxBy(objects, function(o) { return o.n; });
 * // => { 'n': 2 }
 *
 * maxBy(objects, 'n');
 * // => { 'n': 2 }
 */


var maxBy = function maxBy(arr, fn) {
  if (!isArray(arr)) {
    return undefined;
  }

  var max = arr[0];
  var maxData = void 0;

  if (isFunction(fn)) {
    maxData = fn(arr[0]);
  } else {
    maxData = arr[0][fn];
  }

  var data = void 0;
  each(arr, function (val) {
    if (isFunction(fn)) {
      data = fn(val);
    } else {
      data = val[fn];
    }

    if (data > maxData) {
      max = val;
      maxData = data;
    }
  });
  return max;
};

module.exports = maxBy;

/***/ })
/******/ ]);
});
//# sourceMappingURL=adjust.js.map