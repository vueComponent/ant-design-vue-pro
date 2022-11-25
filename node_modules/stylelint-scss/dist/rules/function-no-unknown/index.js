"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _lodash = require("lodash");

var _stylelint = require("stylelint");

var _postcssValueParser = _interopRequireDefault(require("postcss-value-parser"));

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ruleToCheckAgainst = "function-no-unknown";
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
        ignoreFunctions: [_lodash.isString, _lodash.isRegExp]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    var optionsFunctions = secondaryOptions && secondaryOptions.ignoreFunctions || [];

    var ignoreFunctions = _utils.ALL_FUNCTIONS.concat(optionsFunctions);

    var ignoreFunctionsAsSet = new Set(ignoreFunctions);
    var newSecondaryOptions = Object.assign({}, secondaryOptions, {
      ignoreFunctions: ignoreFunctions
    });

    _stylelint.utils.checkAgainstRule({
      ruleName: ruleToCheckAgainst,
      ruleSettings: [primaryOption, newSecondaryOptions],
      root: root
    }, function (warning) {
      var node = warning.node,
          index = warning.index; // NOTE: Using `valueParser` is necessary for extracting a function name. This may be a performance waste.

      (0, _postcssValueParser["default"])(node.value).walk(function (valueNode) {
        var type = valueNode.type,
            funcName = valueNode.value;

        if (type !== "function") {
          return;
        }

        if (!ignoreFunctionsAsSet.has(funcName)) {
          _stylelint.utils.report({
            message: messages.rejected(funcName),
            ruleName: ruleName,
            result: result,
            node: node,
            index: index
          });
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;