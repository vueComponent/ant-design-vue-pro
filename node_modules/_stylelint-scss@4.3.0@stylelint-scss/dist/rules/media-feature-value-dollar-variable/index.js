"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

var ruleName = (0, _utils.namespace)("media-feature-value-dollar-variable");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: "Unexpected dollar-variable as a media feature value",
  expected: "Expected a dollar-variable (e.g. $var) to be used as a media feature value"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(expectation, options) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    }, {
      actual: options,
      possible: {
        ignore: ["keywords"]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    var valueRegex = /:\s*(\S.+?)(:?\s*)\)/; // In `(max-width: 10px )` find `: 10px )`.
    // Got to go with that (the global search doesn't remember parens' insides)
    // and parse it again afterwards to remove trailing junk

    var valueRegexGlobal = new RegExp(valueRegex.source, "g"); // `$var-name_sth`

    var variableRegex = /^\$[\w-]+$/; // `#{$var-name_sth}`

    var interpolationVarRegex = /^#{\s*\$\w+\s*}$/; // `none`, `dark`

    var keywordValueRegex = /^[a-z][a-z\d-]*$/;
    root.walkAtRules("media", function (atRule) {
      var found = atRule.params.match(valueRegexGlobal); // If there are no values

      if (!found || !found.length) {
        return;
      }

      found.forEach(function (found) {
        // ... parse `: 10px )` to `10px`
        var valueParsed = found.match(valueRegex)[1]; // Just a shorthand to stylelint.utils.report()

        function complain(message) {
          _stylelint.utils.report({
            ruleName: ruleName,
            result: result,
            node: atRule,
            word: valueParsed,
            message: message
          });
        } // Keyword values, like `none`, should always be fine if keywords are
        // ignored.


        if (keywordValueRegex.test(valueParsed) && (0, _utils.optionsHaveIgnored)(options, "keywords")) {
          return;
        } // A value should be a single variable
        // or it should be a single variable inside Sass interpolation


        if (expectation === "always" && !(variableRegex.test(valueParsed) || interpolationVarRegex.test(valueParsed))) {
          complain(messages.expected);
        } else if (expectation === "never" && valueParsed.includes("$")) {
          // "Never" means no variables at all (functions allowed)
          complain(messages.rejected);
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;