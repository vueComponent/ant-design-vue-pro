"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var ruleName = (0, _utils.namespace)("dollar-variable-default");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: function expected(variable) {
    return "Expected !default flag for \"".concat(variable, "\"");
  }
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(primaryOption, secondaryOptions) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption
    }, {
      actual: secondaryOptions,
      possible: {
        ignore: ["local"]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(function (decl) {
      // not variable
      if (decl.prop[0] !== "$") {
        return;
      } // "ignore" options


      if ((0, _utils.optionsHaveIgnored)(secondaryOptions, "local") && decl.parent.type !== "root") {
        return;
      }

      if (decl.value.toLowerCase().includes("!default")) {
        return;
      }

      _stylelint.utils.report({
        message: messages.expected(decl.prop),
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