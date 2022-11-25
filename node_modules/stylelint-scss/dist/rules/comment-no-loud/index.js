"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var ruleName = (0, _utils.namespace)("comment-no-loud");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected // for comments instead of /*"
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
      if (isLoudComment(comment)) {
        _stylelint.utils.report({
          message: messages.expected,
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

function isLoudComment(comment) {
  var regex = new RegExp(/^[ \t\n]*\/\*/);
  var splitComment = comment.source.input.css.split("\n");
  var commentFirstLine = splitComment[comment.source.start.line - 1];
  return regex.test(commentFirstLine);
}