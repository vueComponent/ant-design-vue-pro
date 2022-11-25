'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MiniMap = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.log = log;
exports.isIconDefinition = isIconDefinition;
exports.normalizeAttrs = normalizeAttrs;
exports.generate = generate;
exports.getSecondaryColor = getSecondaryColor;
exports.withSuffix = withSuffix;

var _colors = require('@ant-design/colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function log(message) {
  if (!(process && process.env && process.env.NODE_ENV === 'production')) {
    console.error('[@ant-design/icons-vue]: ' + message + '.');
  }
}

function isIconDefinition(target) {
  return typeof target === 'object' && typeof target.name === 'string' && typeof target.theme === 'string' && (typeof target.icon === 'object' || typeof target.icon === 'function');
}

function normalizeAttrs() {
  var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.keys(attrs).reduce(function (acc, key) {
    var val = attrs[key];
    switch (key) {
      case 'class':
        acc.className = val;
        delete acc['class'];
        break;
      default:
        acc[key] = val;
    }
    return acc;
  }, {});
}

var MiniMap = exports.MiniMap = function () {
  function MiniMap() {
    (0, _classCallCheck3['default'])(this, MiniMap);
    this.collection = {};
  }

  (0, _createClass3['default'])(MiniMap, [{
    key: 'clear',
    value: function clear() {
      this.collection = {};
    }
  }, {
    key: 'delete',
    value: function _delete(key) {
      return delete this.collection[key];
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this.collection[key];
    }
  }, {
    key: 'has',
    value: function has(key) {
      return Boolean(this.collection[key]);
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      this.collection[key] = value;
      return this;
    }
  }, {
    key: 'size',
    get: function get() {
      return Object.keys(this.collection).length;
    }
  }]);
  return MiniMap;
}();

function generate(h, node, key, rootProps) {
  if (!rootProps) {
    return h(node.tag, { key: key, attrs: (0, _extends3['default'])({}, normalizeAttrs(node.attrs)) }, (node.children || []).map(function (child, index) {
      return generate(h, child, key + '-' + node.tag + '-' + index);
    }));
  }
  return h(node.tag, (0, _extends3['default'])({
    key: key
  }, rootProps, {
    attrs: (0, _extends3['default'])({}, normalizeAttrs(node.attrs), rootProps.attrs)
  }), (node.children || []).map(function (child, index) {
    return generate(h, child, key + '-' + node.tag + '-' + index);
  }));
}

function getSecondaryColor(primaryColor) {
  // choose the second color
  return (0, _colors.generate)(primaryColor)[0];
}

function withSuffix(name, theme) {
  switch (theme) {
    case 'fill':
      return name + '-fill';
    case 'outline':
      return name + '-o';
    case 'twotone':
      return name + '-twotone';
    default:
      throw new TypeError('Unknown theme type: ' + theme + ', name: ' + name);
  }
}