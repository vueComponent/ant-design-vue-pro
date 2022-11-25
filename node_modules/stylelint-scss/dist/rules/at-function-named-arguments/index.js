"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _lodash = require("lodash");

var _postcssValueParser = _interopRequireDefault(require("postcss-value-parser"));

var _stylelint = require("stylelint");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ruleName = (0, _utils.namespace)("at-function-named-arguments");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected a named parameter to be used in function call",
  rejected: "Unexpected a named parameter in function call"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;
var isScssVarRegExp = /^\$\S*/;

function rule(expectation, options) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    }, {
      actual: options,
      possible: {
        ignore: ["single-argument"],
        ignoreFunctions: [_lodash.isString]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    var shouldIgnoreSingleArgument = (0, _utils.optionsHaveIgnored)(options, "single-argument");
    root.walkDecls(function (decl) {
      (0, _postcssValueParser["default"])(decl.value).walk(function (node) {
        if (node.type !== "function" || (0, _utils.isNativeCssFunction)(node.value) || node.value === "") {
          return;
        }

        var hasFuncIgnored = options && options.ignoreFunctions && options.ignoreFunctions.some(function (f) {
          var isRegex = /^\/.*\//.test(f);

          if (!isRegex) {
            return f === node.value;
          }

          var parts = f.split("/");
          return new RegExp(parts[1], parts[2] || "").test(node.value);
        });

        if (hasFuncIgnored) {
          return;
        }

        var args = (0, _utils.parseFunctionArguments)(_postcssValueParser["default"].stringify(node));
        var isSingleArgument = args.length === 1;

        if (isSingleArgument && shouldIgnoreSingleArgument) {
          return;
        }

        args.forEach(function (arg) {
          switch (expectation) {
            case "never":
              {
                if (!arg.key) {
                  return;
                }

                _stylelint.utils.report({
                  message: messages.rejected,
                  node: decl,
                  result: result,
                  ruleName: ruleName
                });

                break;
              }

            case "always":
              {
                if (arg.key && isScssVarRegExp.test(arg.key)) {
                  return;
                }

                _stylelint.utils.report({
                  message: messages.expected,
                  node: decl,
                  result: result,
                  ruleName: ruleName
                });

                break;
              }
          }
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;