"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ruleName = (0, _utils.namespace)("at-mixin-named-arguments");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected a named parameter to be used in at-include call",
  rejected: "Unexpected a named parameter in at-include call"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;
var hasArgumentsRegExp = /\((.*)\)$/;
var isScssVarRegExp = /^\$\S*/;

function rule(expectation, options) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    }, {
      actual: options,
      possible: {
        ignore: ["single-argument"]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    var shouldIgnoreSingleArgument = (0, _utils.optionsHaveIgnored)(options, "single-argument");
    root.walkAtRules("include", function (atRule) {
      var argsString = atRule.params.replace(/\n/g, " ").match(hasArgumentsRegExp); // Ignore @include that does not contain arguments.

      if (!argsString || argsString.index === -1 || argsString[0].length === 2) {
        return;
      }

      var args = argsString[1] // Create array of arguments.
      .split(",") // Create a key-value array for every argument.
      .map(function (argsString) {
        return argsString.split(":").map(function (argsKeyValuePair) {
          return argsKeyValuePair.trim();
        });
      }).reduce(function (resultArray, keyValuePair) {
        var pair = {
          value: keyValuePair[1] || keyValuePair[0]
        };

        if (keyValuePair[1]) {
          pair.key = keyValuePair[0];
        }

        return [].concat(_toConsumableArray(resultArray), [pair]);
      }, []);
      var isSingleArgument = args.length === 1;

      if (isSingleArgument && shouldIgnoreSingleArgument) {
        return;
      }

      args.forEach(function (arg) {
        switch (expectation) {
          case "never":
            {
              if (!arg.key) {
                return;
              }

              _stylelint.utils.report({
                message: messages.rejected,
                node: atRule,
                result: result,
                ruleName: ruleName
              });

              break;
            }

          case "always":
            {
              if (arg.key && isScssVarRegExp.test(arg.key)) {
                return;
              }

              _stylelint.utils.report({
                message: messages.expected,
                node: atRule,
                result: result,
                ruleName: ruleName
              });

              break;
            }
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;