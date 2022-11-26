"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _stylelint = require("stylelint");

var _utils = require("../../utils");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ruleName = (0, _utils.namespace)("at-rule-conditional-no-parentheses");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  rejected: "Unexpected () used to surround statements for @-rules"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
}; // postcss picks up else-if as else.

exports.meta = meta;
var conditional_rules = ["if", "while", "else"];

function report(atrule, result) {
  _stylelint.utils.report({
    message: messages.rejected,
    node: atrule,
    result: result,
    ruleName: ruleName
  });
}

function fix(atrule) {
  var regex = /(if)? ?\((.*)\)/; // 2 regex groups: 'if ' and cond.

  var groups = atrule.params.match(regex).slice(1);
  atrule.params = _toConsumableArray(new Set(groups)).join(" ");
}

function rule(primary, _unused, context) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(function (atrule) {
      // Check if this is a conditional rule.
      if (!conditional_rules.includes(atrule.name)) {
        return;
      } // Else uses a different regex
      // params are of format "`if (cond)` or `if cond`
      // instead of `(cond)` or `cond`"


      if (atrule.name === "else") {
        if (atrule.params.match(/ ?if ?\(.*\) ?$/)) {
          if (context.fix) {
            fix(atrule);
          } else {
            report(atrule, result);
          }
        }
      } else {
        if (atrule.params.trim().match(/^\(.*\)$/)) {
          if (context.fix) {
            fix(atrule);
          } else {
            report(atrule, result);
          }
        }
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;