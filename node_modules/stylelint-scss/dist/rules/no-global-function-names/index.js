"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _postcssValueParser = _interopRequireDefault(require("postcss-value-parser"));

var _stylelint = require("stylelint");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var interpolationPrefix = /^#{\s*/m;
var rules = {
  red: "color",
  blue: "color",
  green: "color",
  mix: "color",
  hue: "color",
  saturation: "color",
  lightness: "color",
  complement: "color",
  "adjust-color": "color",
  "scale-color": "color",
  "change-color": "color",
  "ie-hex-str": "color",
  "map-get": "map",
  "map-merge": "map",
  "map-remove": "map",
  "map-keys": "map",
  "map-values": "map",
  "map-has-key": "map",
  unquote: "string",
  quote: "string",
  "str-length": "string",
  "str-insert": "string",
  "str-index": "string",
  "str-slice": "string",
  "to-upper-case": "string",
  "to-lower-case": "string",
  "unique-id": "string",
  percentage: "math",
  round: "math",
  ceil: "math",
  floor: "math",
  abs: "math",
  random: "math",
  unit: "math",
  unitless: "math",
  comparable: "math",
  length: "list",
  nth: "list",
  "set-nth": "list",
  join: "list",
  append: "list",
  zip: "list",
  index: "list",
  "list-separator": "list",
  "feature-exists": "meta",
  "variable-exists": "meta",
  "global-variable-exists": "meta",
  "function-exists": "meta",
  "mixin-exists": "meta",
  inspect: "meta",
  "get-function": "meta",
  "type-of": "meta",
  call: "meta",
  "content-exists": "meta",
  keywords: "meta",
  "selector-nest": "selector",
  "selector-append": "selector",
  "selector-replace": "selector",
  "selector-unify": "selector",
  "is-superselector": "selector",
  "simple-selectors": "selector",
  "selector-parse": "selector",
  "selector-extend": "selector",
  lighten: "color",
  "adjust-hue": "color",
  darken: "color",
  desaturate: "color",
  opacify: "color",
  transparentize: "color"
};
var new_rule_names = {
  "adjust-color": "adjust",
  "scale-color": "scale",
  "change-color": "change",
  "map-get": "get",
  "map-merge": "merge",
  "map-remove": "remove",
  "map-keys": "keys",
  "map-values": "values",
  "map-has-key": "has-key",
  "str-length": "length",
  "str-insert": "insert",
  "str-index": "index",
  "str-slice": "slice",
  unitless: "is-unitless",
  comparable: "compatible",
  "list-separator": "separator",
  "selector-nest": "nest",
  "selector-append": "append",
  "selector-replace": "replace",
  "selector-unify": "unify",
  "selector-parse": "parse",
  "selector-extend": "extend",
  lighten: "adjust",
  "adjust-hue": "adjust",
  darken: "adjust",
  desaturate: "adjust",
  opacify: "adjust",
  saturate: "adjust",
  transparentize: "adjust"
};
var rule_mapping = {
  lighten: ["lighten($color, $amount)", "adjust($color, $lightness: $amount)"],
  "adjust-hue": ["adjust-hue($color, $amount)", "adjust($color, $hue: $amount)"],
  darken: ["darken($color, $amount)", "adjust($color, $lightness: -$amount)"],
  desaturate: ["desaturate($color, $amount)", "adjust($color, $saturation: -$amount)"],
  opacify: ["opacify($color, $amount)", "adjust($color, $alpha: -$amount)"],
  saturate: ["saturate($color, $amount)", "adjust($color, $saturation: $amount)"],
  transparentize: ["transparentize($color, $amount)", "adjust($color, $alpha: -$amount)"]
};
var ruleName = (0, _utils.namespace)("no-global-function-names");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejectedFullMessage: function rejectedFullMessage(string) {
    return string;
  },
  rejected: function rejected(name) {
    return errorMessage(name);
  }
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function errorMessage(name) {
  var sass_package = rules[name];
  var rename = new_rule_names[name];
  var map_rule = rule_mapping[name];

  if (rename) {
    if (map_rule) {
      var _map_rule = _slicedToArray(map_rule, 2),
          old_rule = _map_rule[0],
          new_rule = _map_rule[1];

      return "Expected ".concat(sass_package, ".").concat(new_rule, " instead of ").concat(old_rule);
    }

    return "Expected ".concat(sass_package, ".").concat(rename, " instead of ").concat(name);
  } else {
    return "Expected ".concat(sass_package, ".").concat(name, " instead of ").concat(name);
  }
}

function rule(value) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: value
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(function (decl) {
      (0, _postcssValueParser["default"])(decl.value).walk(function (node) {
        var cleanValue = node.value.replace(interpolationPrefix, ""); // Verify that we're only looking at functions.

        if (node.type !== "function" || cleanValue === "") {
          return;
        }

        if (Object.keys(rules).includes(cleanValue)) {
          _stylelint.utils.report({
            message: messages.rejected(cleanValue),
            node: decl,
            index: (0, _utils.declarationValueIndex)(decl) + node.sourceIndex,
            result: result,
            ruleName: ruleName
          });
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;