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

var ruleName = (0, _utils.namespace)("function-color-relative");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: "Expected the scale-color function to be used"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;
var function_names = ["saturate", "desaturate", "darken", "lighten", "opacify", "fade-in", "transparentize", "fade-out"];

function isColorFunction(node) {
  return node.type === "function" && function_names.includes(node.value);
}

function rule(primary) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(function (decl) {
      (0, _postcssValueParser["default"])(decl.value).walk(function (node) {
        // Verify that we're only looking at functions.
        if (node.type !== "function" || node.value === "") {
          return;
        }

        var isFilter = decl.prop === "filter";
        var isSassColorFunction = !isFilter && isColorFunction(node);
        var isDSFilterColorFunction = isFilter && node.value === "drop-shadow" && node.nodes.some(isColorFunction);

        if (isSassColorFunction || isDSFilterColorFunction) {
          var nodes = isDSFilterColorFunction ? node.nodes.filter(isColorFunction) : [node];
          nodes.forEach(function (node) {
            _stylelint.utils.report({
              message: messages.rejected,
              node: decl,
              index: (0, _utils.declarationValueIndex)(decl) + node.sourceIndex,
              result: result,
              ruleName: ruleName
            });
          });
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;