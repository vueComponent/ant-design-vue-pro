"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var paren_1 = __importDefault(require("./paren"));
var combinator_1 = __importDefault(require("./combinator"));
var Element = function (combinator, value, isVariable, index, currentFileInfo, visibilityInfo) {
    this.combinator = combinator instanceof combinator_1.default ?
        combinator : new combinator_1.default(combinator);
    if (typeof value === 'string') {
        this.value = value.trim();
    }
    else if (value) {
        this.value = value;
    }
    else {
        this.value = '';
    }
    this.isVariable = isVariable;
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.copyVisibilityInfo(visibilityInfo);
    this.setParent(this.combinator, this);
};
Element.prototype = new node_1.default();
Element.prototype.accept = function (visitor) {
    var value = this.value;
    this.combinator = visitor.visit(this.combinator);
    if (typeof value === 'object') {
        this.value = visitor.visit(value);
    }
};
Element.prototype.eval = function (context) {
    return new Element(this.combinator, this.value.eval ? this.value.eval(context) : this.value, this.isVariable, this.getIndex(), this.fileInfo(), this.visibilityInfo());
};
Element.prototype.clone = function () {
    return new Element(this.combinator, this.value, this.isVariable, this.getIndex(), this.fileInfo(), this.visibilityInfo());
};
Element.prototype.genCSS = function (context, output) {
    output.add(this.toCSS(context), this.fileInfo(), this.getIndex());
};
Element.prototype.toCSS = function (context) {
    if (context === void 0) { context = {}; }
    var value = this.value;
    var firstSelector = context.firstSelector;
    if (value instanceof paren_1.default) {
        // selector in parens should not be affected by outer selector
        // flags (breaks only interpolated selectors - see #1973)
        context.firstSelector = true;
    }
    value = value.toCSS ? value.toCSS(context) : value;
    context.firstSelector = firstSelector;
    if (value === '' && this.combinator.value.charAt(0) === '&') {
        return '';
    }
    else {
        return this.combinator.toCSS(context) + value;
    }
};
Element.prototype.type = 'Element';
exports.default = Element;
//# sourceMappingURL=element.js.map