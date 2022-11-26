"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _postcssValueParser = _interopRequireDefault(require("postcss-value-parser"));

var _stylelint = require("stylelint");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ruleName = (0, _utils.namespace)("function-quote-no-quoted-strings-inside");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: "Quote function used with an already-quoted string"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(primary, _, context) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    } // Setup variable naming.


    var vars = {};
    root.walkDecls(function (decl) {
      if (decl.prop[0] !== "$") {
        return;
      }

      (0, _postcssValueParser["default"])(decl.value).walk(function (node) {
        vars[decl.prop] = node.type;
      });
    });
    root.walkDecls(function (decl) {
      (0, _postcssValueParser["default"])(decl.value).walk(function (node) {
        // Verify that we're only looking at functions.
        if (node.type !== "function" || (0, _utils.isNativeCssFunction)(node.value) || node.value === "") {
          return;
        } // Verify we're only looking at quote() calls.


        if (node.value !== "quote") {
          return;
        } // Report error if first character is a quote.
        // postcss-value-parser represents quoted strings as type 'string' (as opposed to word)


        if (node.nodes[0].quote || vars[node.nodes[0].value] === "string") {
          if (context.fix) {
            var contents = /quote\((.*)\)/.exec(decl.value);
            decl.value = contents[1];
          } else {
            _stylelint.utils.report({
              message: messages.rejected,
              node: decl,
              index: (0, _utils.declarationValueIndex)(decl) + node.sourceIndex,
              result: result,
              ruleName: ruleName
            });
          }
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;