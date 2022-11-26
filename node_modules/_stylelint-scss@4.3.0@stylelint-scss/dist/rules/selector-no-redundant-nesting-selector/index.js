"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _optionsMatches = _interopRequireDefault(require("stylelint/lib/utils/optionsMatches"));

var _lodash = require("lodash");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ruleName = (0, _utils.namespace)("selector-no-redundant-nesting-selector");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: "Unnecessary nesting selector (&)"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(actual, options) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: actual
    }, {
      actual: options,
      possible: {
        ignoreKeywords: [_lodash.isString, _lodash.isRegExp]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    root.walkRules(/&/, function (rule) {
      (0, _utils.parseSelector)(rule.selector, result, rule, function (fullSelector) {
        // "Ampersand followed by a combinator followed by non-combinator non-ampersand and not the selector end"
        fullSelector.walkNesting(function (node) {
          var prev = node.prev();

          if (prev || (0, _utils.hasNestedSibling)(node)) {
            return;
          }

          var next = node.next();

          if (!next && node.parent.parent.nodes.length > 1) {
            return;
          }

          if (next && next.type !== "combinator") {
            return;
          }

          var nextNext = next ? next.next() : null;

          if ((0, _utils.isType)(nextNext, "tag") && (0, _optionsMatches["default"])(options, "ignoreKeywords", nextNext.value.trim()) || (0, _utils.isType)(nextNext, "combinator")) {
            return;
          }

          _stylelint.utils.report({
            ruleName: ruleName,
            result: result,
            node: rule,
            message: messages.rejected,
            index: node.sourceIndex
          });
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;