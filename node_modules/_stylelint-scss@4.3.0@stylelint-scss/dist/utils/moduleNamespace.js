"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moduleNamespace = moduleNamespace;

/**
 * Returns the namespace of an imported module or `null` if the namespace is removed.
 *
 * Example: no import found, possibly using global function
 * `@use "sass:color";`
 * `moduleNamespace(root, 'sass:map')` returns 'map'
 *
 * Example: default namespace
 * `@use "sass:map";`
 * `moduleNamespace(root, 'sass:map')` returns `map`
 *
 * Example: custom namespace
 * `@use "sass:map" as ns;`
 * `moduleNamespace(root, 'sass:map')` returns 'ns'
 *
 * Example: no namespace
 * `@use "sass:map" as *;`
 * `moduleNamespace(root, 'sass:map')` returns `null`
 *
 * Have a look at the tests for more examples.
 */
function moduleNamespace(root, module) {
  var moduleNamespace = getDefaultNamespace(module);
  root.walkAtRules("use", function (rule) {
    var customNamespace = getCustomNamespace(module, rule);

    switch (customNamespace) {
      case null:
        return;

      case "*":
        moduleNamespace = null;
        return;

      default:
        moduleNamespace = customNamespace;
    }
  });
  return moduleNamespace;
}

function getDefaultNamespace(module) {
  return module.match(/([^/:]+)$/)[1].replace(/\.[^.]+$/, "");
}

function getCustomNamespace(module, rule) {
  var ruleParamsParts = rule.params.split(new RegExp("[\"']".concat(module, "['\"][ \n]*as")));

  if (ruleParamsParts.length < 2) {
    return null;
  }

  var secondRuleParamsPart = ruleParamsParts[1].trim();
  return !secondRuleParamsPart.startsWith("*") ? secondRuleParamsPart.split(" ")[0] : "*";
}