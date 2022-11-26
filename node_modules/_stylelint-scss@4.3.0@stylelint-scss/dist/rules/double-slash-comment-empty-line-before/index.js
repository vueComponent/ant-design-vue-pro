"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var ruleName = (0, _utils.namespace)("double-slash-comment-empty-line-before");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected empty line before comment",
  rejected: "Unexpected empty line before comment"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;
var stylelintCommandPrefix = "stylelint-";

function rule(expectation, options, context) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    }, {
      actual: options,
      possible: {
        except: ["first-nested", "inside-block"],
        ignore: ["stylelint-commands", "between-comments", "inside-block"]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    root.walkComments(function (comment) {
      // Only process // comments
      if (!comment.raws.inline && !comment.inline) {
        return;
      }

      if ((0, _utils.isInlineComment)(comment)) {
        return;
      } // Ignore the first node


      if (comment === root.first) {
        return;
      } // Optionally ignore stylelint commands


      if (comment.text.indexOf(stylelintCommandPrefix) === 0 && (0, _utils.optionsHaveIgnored)(options, "stylelint-commands")) {
        return;
      } // Optionally ignore comments inside blocks


      if (comment.parent !== root && (0, _utils.optionsHaveIgnored)(options, "inside-block")) {
        return;
      } // Optionally ignore newlines between comments


      var prev = comment.prev();

      if (prev && prev.type === "comment" && (0, _utils.optionsHaveIgnored)(options, "between-comments")) {
        return;
      }

      var before = comment.raw("before");

      var expectEmptyLineBefore = function () {
        if ((0, _utils.optionsHaveException)(options, "first-nested") && comment.parent !== root && comment === comment.parent.first) {
          return false;
        } // Reverse expectation for comments inside blocks


        if (comment.parent !== root && (0, _utils.optionsHaveException)(options, "inside-block")) {
          return expectation === "never";
        }

        return expectation === "always";
      }();

      var hasEmptyLineBefore = before.search(/\n\s*?\n/) !== -1; // Return if the expectation is met

      if (expectEmptyLineBefore === hasEmptyLineBefore) {
        return;
      }

      if (context.fix) {
        if (expectEmptyLineBefore && !hasEmptyLineBefore) {
          (0, _utils.addEmptyLineBefore)(comment, context.newline);
          return;
        }

        if (!expectEmptyLineBefore && hasEmptyLineBefore) {
          (0, _utils.removeEmptyLinesBefore)(comment, context.newline);
          return;
        }
      }

      var message = expectEmptyLineBefore ? messages.expected : messages.rejected;

      _stylelint.utils.report({
        message: message,
        node: comment,
        result: result,
        ruleName: ruleName
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;