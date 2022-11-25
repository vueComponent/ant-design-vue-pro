"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _lodash = require("lodash");

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var sassAtRules = ["at-root", "content", "debug", "each", "else", "else if", "error", "extend", "for", "forward", "function", "if", "import", "include", "media", "mixin", "return", "use", "warn", "while"];
var ruleToCheckAgainst = "at-rule-no-unknown";
var ruleName = (0, _utils.namespace)(ruleToCheckAgainst);
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: function rejected() {
    var _rules$ruleToCheckAga;

    return (_rules$ruleToCheckAga = _stylelint.rules[ruleToCheckAgainst].messages).rejected.apply(_rules$ruleToCheckAga, arguments).replace(" (".concat(ruleToCheckAgainst, ")"), "");
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
        ignoreAtRules: [_lodash.isRegExp, _lodash.isString]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    var optionsAtRules = secondaryOptions && secondaryOptions.ignoreAtRules;
    var ignoreAtRules = sassAtRules.concat(optionsAtRules || []);
    var defaultedOptions = Object.assign({}, secondaryOptions, {
      ignoreAtRules: ignoreAtRules
    });

    _stylelint.utils.checkAgainstRule({
      ruleName: ruleToCheckAgainst,
      ruleSettings: [primaryOption, defaultedOptions],
      root: root
    }, function (warning) {
      var name = warning.node.name;

      if (!ignoreAtRules.includes(name)) {
        _stylelint.utils.report({
          message: messages.rejected("@".concat(name)),
          ruleName: ruleName,
          result: result,
          node: warning.node,
          line: warning.line,
          column: warning.column
        });
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;