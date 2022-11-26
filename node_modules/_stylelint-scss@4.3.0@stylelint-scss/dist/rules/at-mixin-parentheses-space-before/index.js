"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var ruleName = (0, _utils.namespace)("at-mixin-parentheses-space-before");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejectedBefore: function rejectedBefore() {
    return "Unexpected whitespace before parentheses in mixin declaration";
  },
  expectedBefore: function expectedBefore() {
    return "Expected a single space before parentheses in mixin declaration";
  }
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(value, _, context) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: value,
      possible: ["always", "never"]
    });

    if (!validOptions) {
      return;
    }

    var match = /^([\w-]+)\s*\(/;
    var replacement = value === "always" ? "$1 (" : "$1(";
    var checker = (0, _utils.whitespaceChecker)("space", value, messages).before;
    root.walkAtRules("mixin", function (decl) {
      if (context.fix) {
        decl.params = decl.params.replace(match, replacement);
        return;
      }

      checker({
        source: decl.params,
        index: decl.params.indexOf("("),
        err: function err(message) {
          return _stylelint.utils.report({
            message: message,
            node: decl,
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