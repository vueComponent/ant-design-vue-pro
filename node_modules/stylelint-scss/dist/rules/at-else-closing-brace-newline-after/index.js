"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _utils = require("../../utils");

var _stylelint = require("stylelint");

var _lodash = require("lodash");

var _atIfClosingBraceNewlineAfter = require("../at-if-closing-brace-newline-after");

var ruleName = (0, _utils.namespace)("at-else-closing-brace-newline-after");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: 'Expected newline after "}" of @else statement',
  rejected: 'Unexpected newline after "}" of @else statement'
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(expectation, options, context) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always-last-in-chain"]
    }, {
      actual: options,
      possible: {
        disableFix: _lodash.isBoolean
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    (0, _atIfClosingBraceNewlineAfter.sassConditionalBraceNLAfterChecker)({
      root: root,
      result: result,
      ruleName: ruleName,
      atRuleName: "else",
      expectation: expectation,
      messages: messages,
      context: context,
      options: options
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;