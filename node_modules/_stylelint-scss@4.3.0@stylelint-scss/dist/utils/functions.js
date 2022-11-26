"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STRING_FUNCTIONS = exports.SELECTOR_FUNCTIONS = exports.META_FUNCTIONS = exports.MATH_FUNCTIONS = exports.MAP_FUNCTIONS = exports.LIST_FUNCTIONS = exports.GLOBAL_FUNCTIONS = exports.COLOR_FUNCTIONS = exports.ALL_FUNCTIONS = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @see https://sass-lang.com/documentation/modules#global-functions
 */
var GLOBAL_FUNCTIONS = Object.freeze(["hsl", "hsla", "if", "rgb", "rgba"]);
/**
 * @see https://sass-lang.com/documentation/modules/color
 */

exports.GLOBAL_FUNCTIONS = GLOBAL_FUNCTIONS;
var COLOR_FUNCTIONS = Object.freeze(["adjust-color", "adjust-hue", "alpha", "blackness", "blue", "change-color", "complement", "darken", "desaturate", "fade-in", "fade-out", "grayscale", "green", "hue", "ie-hex-str", "invert", "lighten", "lightness", "mix", "opacity", "red", "saturate", "saturation", "scale-color", "transparentize", // with namespace
"color.adjust", "color.alpha", "color.blackness", "color.blue", "color.change", "color.complement", "color.grayscale", "color.green", "color.hue", "color.hwb", "color.ie-hex-str", "color.invert", "color.lightness", "color.mix", "color.red", "color.saturation", "color.scale", "color.whiteness"]);
/**
 * @see https://sass-lang.com/documentation/modules/list
 */

exports.COLOR_FUNCTIONS = COLOR_FUNCTIONS;
var LIST_FUNCTIONS = Object.freeze(["append", "index", "is-bracketed", "join", "length", "list-separator", "nth", "set-nth", "list.zip", // with namespace
"list.append", "list.index", "list.is-bracketed", "list.join", "list.length", "list.nth", "list.separator", "list.set-nth", "list.slash", "zip"]);
/**
 * @see https://sass-lang.com/documentation/modules/map
 */

exports.LIST_FUNCTIONS = LIST_FUNCTIONS;
var MAP_FUNCTIONS = Object.freeze(["map-get", "map-has-key", "map-keys", "map-merge", "map-remove", "map-values", // with namespace
"map.deep-merge", "map.deep-remove", "map.get", "map.has-key", "map.keys", "map.merge", "map.remove", "map.set", "map.values"]);
/**
 * @see https://sass-lang.com/documentation/modules/math
 */

exports.MAP_FUNCTIONS = MAP_FUNCTIONS;
var MATH_FUNCTIONS = Object.freeze(["abs", "ceil", "comparable", "floor", "max", "min", "percentage", "random", "round", "unit", "unitless", // with namespace
"math.abs", "math.acos", "math.asin", "math.atan", "math.atan2", "math.ceil", "math.clamp", "math.compatible", "math.cos", "math.div", "math.floor", "math.hypot", "math.is-unitless", "math.log", "math.max", "math.min", "math.percentage", "math.pow", "math.random", "math.round", "math.sin", "math.sqrt", "math.tan", "math.unit"]);
/**
 * @see https://sass-lang.com/documentation/modules/meta
 */

exports.MATH_FUNCTIONS = MATH_FUNCTIONS;
var META_FUNCTIONS = Object.freeze(["call", "content-exists", "feature-exists", "function-exists", "get-function", "global-variable-exists", "inspect", "keywords", "mixin-exists", "type-of", "variable-exists", // with namespace
"meta.calc-args", "meta.calc-name", "meta.call", "meta.content-exists", "meta.feature-exists", "meta.function-exists", "meta.get-function", "meta.global-variable-exists", "meta.inspect", "meta.keywords", "meta.mixin-exists", "meta.module-functions", "meta.module-variables", "meta.type-of", "meta.variable-exists"]);
/**
 * @see https://sass-lang.com/documentation/modules/selector
 */

exports.META_FUNCTIONS = META_FUNCTIONS;
var SELECTOR_FUNCTIONS = Object.freeze(["is-superselector", "selector-append", "selector-extend", "selector-nest", "selector-parse", "selector-replace", "selector-unify", "simple-selectors", // with namespace
"selector.append", "selector.extend", "selector.is-superselector", "selector.nest", "selector.parse", "selector.replace", "selector.simple-selectors", "selector.unify"]);
/**
 * @see https://sass-lang.com/documentation/modules/string
 */

exports.SELECTOR_FUNCTIONS = SELECTOR_FUNCTIONS;
var STRING_FUNCTIONS = Object.freeze(["quote", "str-index", "str-insert", "str-length", "str-slice", "to-lower-case", "to-upper-case", "unique-id", "unquote", // with namespace
"string.index", "string.insert", "string.length", "string.quote", "string.slice", "string.to-lower-case", "string.to-upper-case", "string.unique-id", "string.unquote"]);
exports.STRING_FUNCTIONS = STRING_FUNCTIONS;
var ALL_FUNCTIONS = Object.freeze([].concat(_toConsumableArray(GLOBAL_FUNCTIONS), _toConsumableArray(COLOR_FUNCTIONS), _toConsumableArray(LIST_FUNCTIONS), _toConsumableArray(MAP_FUNCTIONS), _toConsumableArray(MATH_FUNCTIONS), _toConsumableArray(META_FUNCTIONS), _toConsumableArray(SELECTOR_FUNCTIONS), _toConsumableArray(STRING_FUNCTIONS)));
exports.ALL_FUNCTIONS = ALL_FUNCTIONS;