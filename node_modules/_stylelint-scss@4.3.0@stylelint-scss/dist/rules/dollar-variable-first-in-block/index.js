"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _utils = require("../../utils");

var _stylelint = require("stylelint");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ruleName = (0, _utils.namespace)("dollar-variable-first-in-block");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected $-variable to be first in block"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(primary, options) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: primary
    }, {
      actual: options,
      possible: {
        ignore: ["comments", "imports"],
        except: ["root", "at-rule", "function", "mixin", "if-else", "loops"]
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    var isDollarVar = function isDollarVar(node) {
      return node.prop && node.prop[0] === "$";
    };

    root.walkDecls(function (decl) {
      // Ignore declarations that aren't variables.
      // ------------------------------------------
      if (!isDollarVar(decl)) {
        return;
      } // If selected, ignore declarations in root.
      // -----------------------------------------


      if ((0, _utils.optionsHaveException)(options, "root") && decl.parent === root) {
        return;
      } // If selected, ignore declarations in different types of at-rules.
      // ----------------------------------------------------------------


      if (decl.parent.type === "atrule") {
        if ((0, _utils.optionsHaveException)(options, "at-rule") || (0, _utils.optionsHaveException)(options, "function") && decl.parent.name === "function" || (0, _utils.optionsHaveException)(options, "mixin") && decl.parent.name === "mixin" || (0, _utils.optionsHaveException)(options, "if-else") && (decl.parent.name === "if" || decl.parent.name === "else") || (0, _utils.optionsHaveException)(options, "loops") && (decl.parent.name === "each" || decl.parent.name === "for" || decl.parent.name === "while")) {
          return;
        }
      }

      var previous = decl.prev(); // If first or preceded by another variable.
      // -----------------------------------------

      if (!previous || isDollarVar(previous)) {
        return;
      } // Check if preceded only by allowed types.
      // ----------------------------------------


      var precededOnlyByAllowed = true;
      var allowComments = (0, _utils.optionsHaveIgnored)(options, "comments");
      var allowImports = (0, _utils.optionsHaveIgnored)(options, "imports");
      var importAtRules = ["import", "use", "forward"];

      var _iterator = _createForOfIteratorHelper(decl.parent.nodes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var sibling = _step.value;

          if (sibling === decl) {
            break;
          } else if (!isDollarVar(sibling) && !(allowComments && sibling.type === "comment" || allowImports && sibling.type === "atrule" && importAtRules.includes(sibling.name))) {
            precededOnlyByAllowed = false;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (precededOnlyByAllowed) {
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