"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var paren_1 = __importDefault(require("./paren"));
var comment_1 = __importDefault(require("./comment"));
var dimension_1 = __importDefault(require("./dimension"));
var Constants = __importStar(require("../constants"));
var MATH = Constants.Math;
var Expression = function (value, noSpacing) {
    this.value = value;
    this.noSpacing = noSpacing;
    if (!value) {
        throw new Error('Expression requires an array parameter');
    }
};
Expression.prototype = new node_1.default();
Expression.prototype.accept = function (visitor) {
    this.value = visitor.visitArray(this.value);
};
Expression.prototype.eval = function (context) {
    var returnValue;
    var mathOn = context.isMathOn();
    var inParenthesis = this.parens &&
        (context.math !== MATH.STRICT_LEGACY || !this.parensInOp);
    var doubleParen = false;
    if (inParenthesis) {
        context.inParenthesis();
    }
    if (this.value.length > 1) {
        returnValue = new Expression(this.value.map(function (e) {
            if (!e.eval) {
                return e;
            }
            return e.eval(context);
        }), this.noSpacing);
    }
    else if (this.value.length === 1) {
        if (this.value[0].parens && !this.value[0].parensInOp && !context.inCalc) {
            doubleParen = true;
        }
        returnValue = this.value[0].eval(context);
    }
    else {
        returnValue = this;
    }
    if (inParenthesis) {
        context.outOfParenthesis();
    }
    if (this.parens && this.parensInOp && !mathOn && !doubleParen
        && (!(returnValue instanceof dimension_1.default))) {
        returnValue = new paren_1.default(returnValue);
    }
    return returnValue;
};
Expression.prototype.genCSS = function (context, output) {
    for (var i = 0; i < this.value.length; i++) {
        this.value[i].genCSS(context, output);
        if (!this.noSpacing && i + 1 < this.value.length) {
            output.add(' ');
        }
    }
};
Expression.prototype.throwAwayComments = function () {
    this.value = this.value.filter(function (v) { return !(v instanceof comment_1.default); });
};
Expression.prototype.type = 'Expression';
exports.default = Expression;
//# sourceMappingURL=expression.js.map