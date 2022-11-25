"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var Paren = function (node) {
    this.value = node;
};
Paren.prototype = new node_1.default();
Paren.prototype.genCSS = function (context, output) {
    output.add('(');
    this.value.genCSS(context, output);
    output.add(')');
};
Paren.prototype.eval = function (context) {
    return new Paren(this.value.eval(context));
};
Paren.prototype.type = 'Paren';
exports.default = Paren;
//# sourceMappingURL=paren.js.map