"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _lodash = require("lodash");

var _isCustomPropertySet = _interopRequireDefault(require("./isCustomPropertySet"));

var _isStandardSelector = _interopRequireDefault(require("./isStandardSelector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Check whether a Node is a standard rule
 *
 * @param {import('postcss').Rule} rule
 * @returns {boolean}
 */
function _default(rule) {
  // Get full selector
  var selector = (0, _lodash.get)(rule, "raws.selector.raw", rule.selector);

  if (!(0, _isStandardSelector["default"])(rule.selector)) {
    return false;
  } // Custom property set (e.g. --custom-property-set: {})


  if ((0, _isCustomPropertySet["default"])(rule)) {
    return false;
  } // Called Less mixin (e.g. a { .mixin() })
  // @ts-ignore TODO TYPES support LESS and SASS types somehow


  if (rule.mixin) {
    return false;
  } // Less detached rulesets


  if (selector.startsWith("@") && selector.endsWith(":")) {
    return false;
  } // Ignore Less &:extend rule
  // @ts-ignore TODO TYPES support LESS and SASS types somehow


  if (rule.extend) {
    return false;
  } // Ignore mixin or &:extend rule
  // https://github.com/shellscape/postcss-less/blob/master/lib/less-parser.js#L52
  // @ts-ignore TODO TYPES support LESS and SASS types somehow


  if (rule.params && rule.params[0]) {
    return false;
  } // Non-outputting Less mixin definition (e.g. .mixin() {})


  if (selector.endsWith(")") && !selector.includes(":")) {
    return false;
  } // Less guards


  if (/when\s+(not\s+)*\(/.test(selector)) {
    return false;
  } // Ignore Scss nested properties


  if (selector.endsWith(":")) {
    return false;
  }

  return true;
}