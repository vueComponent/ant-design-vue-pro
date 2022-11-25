"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _lodash = require("lodash");

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var ruleName = (0, _utils.namespace)("dollar-variable-pattern");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected $ variable name to match specified pattern"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(pattern, options) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: pattern,
      possible: [_lodash.isRegExp, _lodash.isString]
    }, {
      actual: options,
      possible: {
        ignore: ["local", "global"]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    var regexpPattern = (0, _lodash.isString)(pattern) ? new RegExp(pattern) : pattern;
    root.walkDecls(function (decl) {
      var prop = decl.prop;

      if (prop[0] !== "$") {
        return;
      } // If local or global variables need to be ignored


      if ((0, _utils.optionsHaveIgnored)(options, "global") && decl.parent.type === "root" || (0, _utils.optionsHaveIgnored)(options, "local") && decl.parent.type !== "root") {
        return;
      }

      if (regexpPattern.test(prop.slice(1))) {
        return;
      }

      _stylelint.utils.report({
        message: messages.expected,
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