"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var Attribute = function (key, op, value) {
    this.key = key;
    this.op = op;
    this.value = value;
};
Attribute.prototype = new node_1.default();
Attribute.prototype.eval = function (context) {
    return new Attribute(this.key.eval ? this.key.eval(context) : this.key, this.op, (this.value && this.value.eval) ? this.value.eval(context) : this.value);
};
Attribute.prototype.genCSS = function (context, output) {
    output.add(this.toCSS(context));
};
Attribute.prototype.toCSS = function (context) {
    var value = this.key.toCSS ? this.key.toCSS(context) : this.key;
    if (this.op) {
        value += this.op;
        value += (this.value.toCSS ? this.value.toCSS(context) : this.value);
    }
    return "[" + value + "]";
};
Attribute.prototype.type = 'Attribute';
exports.default = Attribute;
//# sourceMappingURL=attribute.js.map