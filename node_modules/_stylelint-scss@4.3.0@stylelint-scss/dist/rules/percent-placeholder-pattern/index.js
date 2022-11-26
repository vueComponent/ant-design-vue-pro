"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _lodash = require("lodash");

var _postcssResolveNestedSelector = _interopRequireDefault(require("postcss-resolve-nested-selector"));

var _stylelint = require("stylelint");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ruleName = (0, _utils.namespace)("percent-placeholder-pattern");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: function expected(placeholder) {
    return "Expected %-placeholder \"%".concat(placeholder, "\" to match specified pattern");
  }
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(pattern) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: pattern,
      possible: [_lodash.isRegExp, _lodash.isString]
    });

    if (!validOptions) {
      return;
    }

    var placeholderPattern = (0, _lodash.isString)(pattern) ? new RegExp(pattern) : pattern; // Checking placeholder definitions (looking among regular rules)

    root.walkRules(function (rule) {
      var selector = rule.selector; // Just a shorthand for calling `parseSelector`

      function parse(selector) {
        (0, _utils.parseSelector)(selector, result, rule, function (s) {
          return checkSelector(s, rule);
        });
      } // If it's a custom prop or a less mixin


      if (!(0, _utils.isStandardRule)(rule)) {
        return;
      } // If the selector has interpolation


      if (!(0, _utils.isStandardSelector)(selector)) {
        return;
      } // Nested selectors are processed in steps, as nesting levels are resolved.
      // Here we skip processing intermediate parts of selectors (to process only fully resolved selectors)
      // if (rule.nodes.some(node => node.type === "rule" || node.type === "atrule")) { return }
      // Only resolve selectors that have an interpolating "&"


      if ((0, _utils.hasInterpolatingAmpersand)(selector)) {
        (0, _postcssResolveNestedSelector["default"])(selector, rule).forEach(parse);
      } else {
        parse(selector);
      }
    });

    function checkSelector(fullSelector, rule) {
      // postcss-selector-parser gives %placeholders' nodes a "tag" type
      fullSelector.walkTags(function (compoundSelector) {
        var value = compoundSelector.value,
            sourceIndex = compoundSelector.sourceIndex;

        if (value[0] !== "%") {
          return;
        }

        var placeholder = value.slice(1);

        if (placeholderPattern.test(placeholder)) {
          return;
        }

        _stylelint.utils.report({
          result: result,
          ruleName: ruleName,
          message: messages.expected(placeholder),
          node: rule,
          index: sourceIndex
        });
      });
    }
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;