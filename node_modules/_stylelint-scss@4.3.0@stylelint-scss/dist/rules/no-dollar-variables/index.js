"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var ruleName = (0, _utils.namespace)("no-dollar-variables");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: function rejected(variable) {
    return "Unexpected dollar variable ".concat(variable);
  }
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(value) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: value
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(function (decl) {
      if (decl.prop[0] !== "$") {
        return;
      }

      _stylelint.utils.report({
        message: messages.rejected(decl.prop),
        node: decl,
        result: result,
        ruleName: ruleName
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;