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
var value_1 = __importDefault(require("./value"));
var keyword_1 = __importDefault(require("./keyword"));
var anonymous_1 = __importDefault(require("./anonymous"));
var Constants = __importStar(require("../constants"));
var MATH = Constants.Math;
var Declaration = function (name, value, important, merge, index, currentFileInfo, inline, variable) {
    this.name = name;
    this.value = (value instanceof node_1.default) ? value : new value_1.default([value ? new anonymous_1.default(value) : null]);
    this.important = important ? " " + important.trim() : '';
    this.merge = merge;
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.inline = inline || false;
    this.variable = (variable !== undefined) ? variable
        : (name.charAt && (name.charAt(0) === '@'));
    this.allowRoot = true;
    this.setParent(this.value, this);
};
Declaration.prototype = new node_1.default();
Declaration.prototype.genCSS = function (context, output) {
    output.add(this.name + (context.compress ? ':' : ': '), this.fileInfo(), this.getIndex());
    try {
        this.value.genCSS(context, output);
    }
    catch (e) {
        e.index = this._index;
        e.filename = this._fileInfo.filename;
        throw e;
    }
    output.add(this.important + ((this.inline || (context.lastRule && context.compress)) ? '' : ';'), this._fileInfo, this._index);
};
Declaration.prototype.eval = function (context) {
    var mathBypass = false;
    var prevMath;
    var name = this.name;
    var evaldValue;
    var variable = this.variable;
    if (typeof name !== 'string') {
        // expand 'primitive' name directly to get
        // things faster (~10% for benchmark.less):
        name = (name.length === 1) && (name[0] instanceof keyword_1.default) ?
            name[0].value : evalName(context, name);
        variable = false; // never treat expanded interpolation as new variable name
    }
    // @todo remove when parens-division is default
    if (name === 'font' && context.math === MATH.ALWAYS) {
        mathBypass = true;
        prevMath = context.math;
        context.math = MATH.PARENS_DIVISION;
    }
    try {
        context.importantScope.push({});
        evaldValue = this.value.eval(context);
        if (!this.variable && evaldValue.type === 'DetachedRuleset') {
            throw { message: 'Rulesets cannot be evaluated on a property.',
                index: this.getIndex(), filename: this.fileInfo().filename };
        }
        var important = this.important;
        var importantResult = context.importantScope.pop();
        if (!important && importantResult.important) {
            important = importantResult.important;
        }
        return new Declaration(name, evaldValue, important, this.merge, this.getIndex(), this.fileInfo(), this.inline, variable);
    }
    catch (e) {
        if (typeof e.index !== 'number') {
            e.index = this.getIndex();
            e.filename = this.fileInfo().filename;
        }
        throw e;
    }
    finally {
        if (mathBypass) {
            context.math = prevMath;
        }
    }
};
Declaration.prototype.makeImportant = function () {
    return new Declaration(this.name, this.value, '!important', this.merge, this.getIndex(), this.fileInfo(), this.inline);
};
function evalName(context, name) {
    var value = '';
    var i;
    var n = name.length;
    var output = { add: function (s) { value += s; } };
    for (i = 0; i < n; i++) {
        name[i].eval(context).genCSS(context, output);
    }
    return value;
}
Declaration.prototype.type = 'Declaration';
exports.default = Declaration;
//# sourceMappingURL=declaration.js.map