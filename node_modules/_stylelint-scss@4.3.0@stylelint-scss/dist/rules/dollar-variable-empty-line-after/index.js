"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rule;
exports.ruleName = exports.meta = exports.messages = void 0;

var _utils = require("../../utils");

var _stylelint = require("stylelint");

var _lodash = require("lodash");

var ruleName = (0, _utils.namespace)("dollar-variable-empty-line-after");
exports.ruleName = ruleName;

var messages = _stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected an empty line after $-variable",
  rejected: "Unexpected empty line after $-variable"
});

exports.messages = messages;
var meta = {
  url: (0, _utils.ruleUrl)(ruleName)
};
exports.meta = meta;

function rule(expectation, options, context) {
  return function (root, result) {
    var validOptions = _stylelint.utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    }, {
      actual: options,
      possible: {
        except: ["last-nested", "before-comment", "before-dollar-variable"],
        ignore: ["before-comment", "inside-single-line-block"],
        disableFix: _lodash.isBoolean
      },
      optional: true
    });

    if (!validOptions) {
      return;
    }

    var fixNext = function fixNext(decl, match, replace) {
      decl.raws.before = decl.raws.before.replace(new RegExp("^".concat(match)), replace);
    };

    var fixParent = function fixParent(decl, match, replace) {
      decl.parent.raws.after = decl.parent.raws.after.replace(new RegExp("^".concat(match)), replace);
    };

    var hasNewline = function hasNewline(str) {
      return str.indexOf(context.newline) > -1;
    };

    var isDollarVar = function isDollarVar(node) {
      return node.prop && node.prop[0] === "$";
    };

    root.walkDecls(function (decl) {
      var expectEmptyLineAfter = expectation === "always";
      var exceptLastNested = (0, _utils.optionsHaveException)(options, "last-nested");
      var exceptBeforeComment = (0, _utils.optionsHaveException)(options, "before-comment");
      var exceptBeforeVariable = (0, _utils.optionsHaveException)(options, "before-dollar-variable");
      var ignoreInsideSingleLineBlock = (0, _utils.optionsHaveIgnored)(options, "inside-single-line-block");
      var ignoreBeforeComment = (0, _utils.optionsHaveIgnored)(options, "before-comment");
      var isSingleLineDeclaration = (0, _utils.isSingleLineString)((0, _utils.blockString)(decl.parent)); // Ignore declarations that aren't variables.
      // ------------------------------------------

      if (!isDollarVar(decl)) {
        return;
      } // Ignore declaration if it's the last line in a file.
      // ---------------------------------------------------


      if (decl === root.last) {
        return;
      } // Ignore single line blocks (if chosen as an option).
      // ---------------------------------------------------


      if (ignoreInsideSingleLineBlock && decl.parent.type !== "root" && isSingleLineDeclaration) {
        return;
      }

      var next = decl.next(); // The declaration is the last in a block.
      // ---------------------------------------

      if (!next) {
        var hasEmptyLineAfter = (0, _utils.hasEmptyLine)(decl.parent.raws.after);

        if (expectEmptyLineAfter && hasEmptyLineAfter && !exceptLastNested || !expectEmptyLineAfter && !hasEmptyLineAfter && !exceptLastNested || expectEmptyLineAfter && !hasEmptyLineAfter && exceptLastNested || !expectEmptyLineAfter && hasEmptyLineAfter && exceptLastNested) {
          return;
        }
      } // The declaration is NOT the last in a block.
      // -------------------------------------------
      else {
        var _hasEmptyLineAfter = (0, _utils.hasEmptyLine)(next.raws.before);

        var nextIsComment = next.type === "comment";
        var nextIsVariable = isDollarVar(next);

        if (nextIsComment) {
          if (ignoreBeforeComment || expectEmptyLineAfter && _hasEmptyLineAfter && !exceptBeforeComment || !expectEmptyLineAfter && !_hasEmptyLineAfter && !exceptBeforeComment || expectEmptyLineAfter && !_hasEmptyLineAfter && exceptBeforeComment || !expectEmptyLineAfter && _hasEmptyLineAfter && exceptBeforeComment) {
            return;
          }
        } else if (nextIsVariable) {
          if (expectEmptyLineAfter && _hasEmptyLineAfter && !exceptBeforeVariable || !expectEmptyLineAfter && !_hasEmptyLineAfter && !exceptBeforeVariable || expectEmptyLineAfter && !_hasEmptyLineAfter && exceptBeforeVariable || !expectEmptyLineAfter && _hasEmptyLineAfter && exceptBeforeVariable || expectEmptyLineAfter && _hasEmptyLineAfter && exceptBeforeVariable) {
            return;
          }
        } else if (expectEmptyLineAfter === _hasEmptyLineAfter) {
          return;
        }
      }

      var isFixDisabled = options && options.disableFix === true;

      if (context.fix && !isFixDisabled) {
        if (next) {
          var nextBefore = next.raws.before;

          var _hasEmptyLineAfter2 = (0, _utils.hasEmptyLine)(nextBefore);

          var _nextIsComment = next.type === "comment";

          var _nextIsVariable = isDollarVar(next);

          if (expectEmptyLineAfter && !_hasEmptyLineAfter2) {
            fixNext(next, context.newline, context.newline + context.newline);

            if (exceptLastNested && !hasNewline(nextBefore)) {
              fixNext(next, "\\s+", context.newline + context.newline);
            }

            return;
          } else if (expectEmptyLineAfter && exceptBeforeComment && _nextIsComment && _hasEmptyLineAfter2 || expectEmptyLineAfter && exceptBeforeVariable && _nextIsVariable && _hasEmptyLineAfter2 || !expectEmptyLineAfter && _hasEmptyLineAfter2) {
            fixNext(decl, "\\n\\r\\n", "\r\n");
            fixNext(next, context.newline + context.newline, context.newline);
            return;
          } else if (!expectEmptyLineAfter && exceptBeforeComment && _nextIsComment && !_hasEmptyLineAfter2 || !expectEmptyLineAfter && exceptBeforeVariable && _nextIsVariable && !_hasEmptyLineAfter2) {
            fixNext(next, context.newline, context.newline + context.newline);
            return;
          }
        } else {
          var _hasEmptyLineAfter3 = (0, _utils.hasEmptyLine)(decl.parent.raws.after);

          expectEmptyLineAfter = exceptLastNested ? !expectEmptyLineAfter : expectEmptyLineAfter;

          if (expectEmptyLineAfter && !_hasEmptyLineAfter3) {
            fixParent(decl, context.newline, context.newline + context.newline);
            return;
          } else if (!expectEmptyLineAfter && _hasEmptyLineAfter3) {
            fixParent(decl, "\\n\\r\\n", "\r\n");
            fixParent(decl, context.newline + context.newline, context.newline);
            return;
          }
        }
      }

      _stylelint.utils.report({
        message: expectEmptyLineAfter ? messages.expected : messages.rejected,
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