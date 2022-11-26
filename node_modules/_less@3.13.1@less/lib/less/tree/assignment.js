"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var Assignment = function (key, val) {
    this.key = key;
    this.value = val;
};
Assignment.prototype = new node_1.default();
Assignment.prototype.accept = function (visitor) {
    this.value = visitor.visit(this.value);
};
Assignment.prototype.eval = function (context) {
    if (this.value.eval) {
        return new Assignment(this.key, this.value.eval(context));
    }
    return this;
};
Assignment.prototype.genCSS = function (context, output) {
    output.add(this.key + "=");
    if (this.value.genCSS) {
        this.value.genCSS(context, output);
    }
    else {
        output.add(this.value);
    }
};
Assignment.prototype.type = 'Assignment';
exports.default = Assignment;
//# sourceMappingURL=assignment.js.map