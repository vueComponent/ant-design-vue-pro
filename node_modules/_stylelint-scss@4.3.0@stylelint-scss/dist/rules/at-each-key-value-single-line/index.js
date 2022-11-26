"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var ruleName = (0, _utils.namespace)("at-each-key-value-single-line");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: "Use @each $key, $value in $map syntax instead of $value: map-get($map, $key)"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(primary) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    var mapNamespace = (0, _utils.moduleNamespace)(root, "sass:map");
    root.walkAtRules("each", function (rule) {
      var parts = separateEachParams(rule.params); // If loop is fetching both key + value, return

      if (parts[0].length === 2) {
        return;
      } // If didn't call map-keys, return.


      if (!didCallMapKeys(parts[1], mapNamespace)) {
        return;
      } // Loop over decls inside of each statement and loop for variable assignments.


      rule.walkDecls(function (innerDecl) {
        // Check that this decl is a map-get call
        if (innerDecl.prop[0] !== "$") {
          return;
        }

        if (!didCallMapGet(innerDecl.value, mapNamespace)) {
          return;
        } // Check map_name + key_name match.


        var map_get_parts = mapGetParameters(innerDecl.value, mapNamespace); // Check map names match.

        if (map_get_parts[0] !== mapName(parts[1], mapNamespace)) {
          return;
        } // Match key names match.


        if (map_get_parts[1] !== parts[0][0]) {
          return;
        }

        _stylelint.utils.report({
          message: messages.expected,
          node: rule,
          result: result,
          ruleName: ruleName
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta; // Takes in a param string from node.params
// Returns: [[key variable, value variable], map_decl] (all Strings)

function separateEachParams(paramString) {
  var parts = paramString.split("in");
  return [parts[0].split(",").map(function (s) {
    return s.trim();
  }), parts[1].trim()];
}

function didCallMapKeys(mapDecl, mapNamespace) {
  var pattern = getNamespacedPattern("keys\\(.*\\)", mapNamespace);
  return new RegExp(pattern).test(mapDecl);
}

function didCallMapGet(mapDecl, mapNamespace) {
  var pattern = getNamespacedPattern("get\\((.*),(.*)\\)", mapNamespace);
  return new RegExp(pattern).test(mapDecl);
} // Fetch the name of the map from a map-keys() or map.keys() call.


function mapName(mapDecl, mapNamespace) {
  if (didCallMapKeys(mapDecl, mapNamespace)) {
    var pattern = getNamespacedPattern("keys\\((.*)\\)", mapNamespace);
    return mapDecl.match(new RegExp(pattern))[1];
  }

  return mapDecl;
} // Returns the parameters of a map-get or map.get call
// Returns [map variable, key_variable]


function mapGetParameters(mapGetDecl, mapNamespace) {
  var pattern = getNamespacedPattern("get\\((.*), ?(.*)\\)", mapNamespace);
  var parts = mapGetDecl.match(new RegExp(pattern));
  return [parts[1], parts[2]];
}

function getNamespacedPattern(pattern, namespace) {
  return namespace !== null ? "(?:".concat(namespace, "\\.|map-)").concat(pattern) : pattern;
}