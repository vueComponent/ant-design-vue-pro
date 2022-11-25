"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _lodash = require("lodash");

var _utils = require("../../utils");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ruleName = (0, _utils.namespace)("no-duplicate-dollar-variables");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: function rejected(variable) {
    return "Unexpected duplicate dollar variable ".concat(variable);
  }
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(value, secondaryOptions) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: value
    }, {
      actual: secondaryOptions,
      possible: {
        ignoreInside: ["at-rule", "nested-at-rule"],
        ignoreInsideAtRules: [_lodash.isString],
        ignoreDefaults: [_lodash.isBoolean]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    var vars = {};
    /**
     * Traverse the [vars] tree through the path defined by [ancestors], creating nodes as needed.
     * @param {*} ancestors
     * @returns the tree of the node defined by the last of [ancestors].
     */

    function getScope(ancestors) {
      var scope = vars;

      var _iterator = _createForOfIteratorHelper(ancestors),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var node = _step.value;

          if (!(node in scope)) {
            scope[node] = {};
          }

          scope = scope[node];
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return scope;
    }
    /**
     * Iterates through the ancestors while checking each scope until the [variable] is found.
     * If not found, an object with empty values is returned.
     * @param {*} ancestors
     * @param {string} variable the variable name.
     * @returns The previously declared variable data or an object with empty values.
     */


    function getVariableData(ancestors, variable) {
      var scope = vars;

      var _iterator2 = _createForOfIteratorHelper(ancestors),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var node = _step2.value;
          scope = scope[node];

          if (scope[variable]) {
            return scope[variable];
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return {
        defaultCount: 0,
        isDeclared: false
      };
    }
    /**
     * Checks whether the given [variableData] is declared.
     * @param {{ defaultCount: number; isDeclared: boolean; }} variableData the variable data
     * containing default count and if the variable is declared.
     * @param {boolean} isDefault if the variable contains the `!default` keyword.
     * @param {boolean | number} ignoreDefaults the ignore defaults options.
     * @returns true if declared.
     */


    function isDeclared(variableData, isDefault, ignoreDefaults) {
      if (isDefault) {
        if (Number.isFinite(ignoreDefaults)) {
          return variableData.defaultCount >= ignoreDefaults;
        } else if (ignoreDefaults) {
          return false;
        }
      }

      return variableData.isDeclared;
    }
    /**
     * Processes the variable data based on the given arguments.
     * @param {{ defaultCount: number; isDeclared: boolean; }} variableData the variable data
     * containing default count and if the variable is declared.
     * @param {boolean} isDefault if the variable contains the `!default` keyword.
     * @param {boolean | number} ignoreDefaults the ignore defaults options.
     * @returns the updated `variableData`.
     */


    function processVariableData(variableData, isDefault, ignoreDefaults) {
      return {
        defaultCount: isDefault ? ++variableData.defaultCount : variableData.defaultCount,
        isDeclared: isDefault && ignoreDefaults !== false ? variableData.isDeclared : true
      };
    }

    var ignoreDefaults = secondaryOptions && secondaryOptions.ignoreDefaults !== undefined ? secondaryOptions.ignoreDefaults : 1;
    root.walkDecls(function (decl) {
      var isVar = decl.prop[0] === "$";
      var isInsideIgnoredAtRule = decl.parent.type === "atrule" && secondaryOptions && secondaryOptions.ignoreInside && secondaryOptions.ignoreInside === "at-rule";
      var isInsideIgnoredNestedAtRule = decl.parent.type === "atrule" && decl.parent.parent.type !== "root" && secondaryOptions && secondaryOptions.ignoreInside && secondaryOptions.ignoreInside === "nested-at-rule";
      var isInsideIgnoredSpecifiedAtRule = decl.parent.type === "atrule" && secondaryOptions && secondaryOptions.ignoreInsideAtRules && secondaryOptions.ignoreInsideAtRules.includes(decl.parent.name);

      if (!isVar || isInsideIgnoredAtRule || isInsideIgnoredNestedAtRule || isInsideIgnoredSpecifiedAtRule) {
        return;
      }

      var ancestors = [];
      var parent = decl.parent;

      while (parent !== null && parent !== undefined) {
        var parentKey = parent.toString();
        ancestors.unshift(parentKey);
        parent = parent.parent;
      }

      var scope = getScope(ancestors);
      var isDefault = /!default/.test(decl.value);
      var variableData = getVariableData(ancestors, decl.prop);

      if (isDeclared(variableData, isDefault, ignoreDefaults)) {
        _stylelint.utils.report({
          message: messages.rejected(decl.prop),
          node: decl,
          result: result,
          ruleName: ruleName
        });
      }

      scope[decl.prop] = processVariableData(variableData, isDefault, ignoreDefaults);
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;