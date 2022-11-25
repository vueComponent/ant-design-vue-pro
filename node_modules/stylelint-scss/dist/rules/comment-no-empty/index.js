"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var coreRuleName = "comment-no-empty";
var ruleName = (0, _utils.namespace)(coreRuleName);
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: _stylelint.rules[coreRuleName].messages.rejected.replace(" (".concat(coreRuleName, ")"), "")
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

    root.walkComments(function (comment) {
      if (isEmptyComment(comment)) {
        _stylelint.utils.report({
          message: messages.rejected,
          node: comment,
          result: result,
          ruleName: ruleName
        });
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

function isEmptyComment(comment) {
  return comment.text === "";
}