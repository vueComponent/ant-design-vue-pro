"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _utils = require("../../utils");

var _stylelint = require("stylelint");

var ruleName = (0, _utils.namespace)("at-else-empty-line-before");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: "Unexpected empty line before @else"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(expectation, _, context) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["never"]
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(function (atrule) {
      if (atrule.name !== "else") {
        return;
      } // Don't need to ignore "the first rule in a stylesheet", etc, cases
      // because @else should always go after @if


      if (!(0, _utils.hasEmptyLine)(atrule.raws.before)) {
        return;
      }

      if (context.fix) {
        atrule.raws.before = " ";
        return;
      }

      _stylelint.utils.report({
        message: messages.rejected,
        node: atrule,
        result: result,
        ruleName: ruleName
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;