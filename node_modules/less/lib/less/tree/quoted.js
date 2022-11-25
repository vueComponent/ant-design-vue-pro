"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var variable_1 = __importDefault(require("./variable"));
var property_1 = __importDefault(require("./property"));
var Quoted = function (str, content, escaped, index, currentFileInfo) {
    this.escaped = (escaped == null) ? true : escaped;
    this.value = content || '';
    this.quote = str.charAt(0);
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.variableRegex = /@\{([\w-]+)\}/g;
    this.propRegex = /\$\{([\w-]+)\}/g;
    this.allowRoot = escaped;
};
Quoted.prototype = new node_1.default();
Quoted.prototype.genCSS = function (context, output) {
    if (!this.escaped) {
        output.add(this.quote, this.fileInfo(), this.getIndex());
    }
    output.add(this.value);
    if (!this.escaped) {
        output.add(this.quote);
    }
};
Quoted.prototype.containsVariables = function () {
    return this.value.match(this.variableRegex);
};
Quoted.prototype.eval = function (context) {
    var that = this;
    var value = this.value;
    var variableReplacement = function (_, name) {
        var v = new variable_1.default("@" + name, that.getIndex(), that.fileInfo()).eval(context, true);
        return (v instanceof Quoted) ? v.value : v.toCSS();
    };
    var propertyReplacement = function (_, name) {
        var v = new property_1.default("$" + name, that.getIndex(), that.fileInfo()).eval(context, true);
        return (v instanceof Quoted) ? v.value : v.toCSS();
    };
    function iterativeReplace(value, regexp, replacementFnc) {
        var evaluatedValue = value;
        do {
            value = evaluatedValue.toString();
            evaluatedValue = value.replace(regexp, replacementFnc);
        } while (value !== evaluatedValue);
        return evaluatedValue;
    }
    value = iterativeReplace(value, this.variableRegex, variableReplacement);
    value = iterativeReplace(value, this.propRegex, propertyReplacement);
    return new Quoted(this.quote + value + this.quote, value, this.escaped, this.getIndex(), this.fileInfo());
};
Quoted.prototype.compare = function (other) {
    // when comparing quoted strings allow the quote to differ
    if (other.type === 'Quoted' && !this.escaped && !other.escaped) {
        return node_1.default.numericCompare(this.value, other.value);
    }
    else {
        return other.toCSS && this.toCSS() === other.toCSS() ? 0 : undefined;
    }
};
Quoted.prototype.type = 'Quoted';
exports.default = Quoted;
//# sourceMappingURL=quoted.js.map