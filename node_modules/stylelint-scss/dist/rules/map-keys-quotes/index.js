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

var ruleName = (0, _utils.namespace)("map-keys-quotes");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected keys in map to be quoted."
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;
var mathOperators = ["+", "/", "-", "*", "%"];

function rule(primary) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: primary,
      possible: ["always"]
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(function (decl) {
      if (decl.prop[0] !== "$") {
        return;
      }

      (0, _postcssValueParser["default"])(decl.value).walk(function (node) {
        if (node.type === "function" && node.value === "" && isMap(node.nodes)) {
          // Identify all of the map-keys and see if they're strings (not words).
          var mapKeys = returnMapKeys(node.nodes);
          mapKeys.forEach(function (map_key) {
            if (mathOperators.includes(map_key.value)) {
              return;
            }

            if (map_key.type === "word" && isNaN(map_key.value)) {
              _stylelint.utils.report({
                message: messages.expected,
                node: decl,
                result: result,
                ruleName: ruleName
              });
            }
          });
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta; // Takes in a list of map nodes and identifies if they are a map.
// A map is identified by the pattern: [string/word colon(div) anything comma(div) ...]

function isMap(nodes) {
  if (nodes.length < 4) {
    return false;
  }

  if (nodes[0].type !== "word" && nodes[0].type !== "string") {
    return false;
  }

  if (nodes[1].value !== ":") {
    return false;
  }

  if (nodes[3].value !== ",") {
    return false;
  }

  return true;
}

function returnMapKeys(array) {
  var new_array = [];

  for (var i = 0; i < array.length; i += 4) {
    new_array.push(array[i]);
  }

  return new_array;
}