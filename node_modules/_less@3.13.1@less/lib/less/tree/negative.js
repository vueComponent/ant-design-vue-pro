"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var operation_1 = __importDefault(require("./operation"));
var dimension_1 = __importDefault(require("./dimension"));
var Negative = function (node) {
    this.value = node;
};
Negative.prototype = new node_1.default();
Negative.prototype.genCSS = function (context, output) {
    output.add('-');
    this.value.genCSS(context, output);
};
Negative.prototype.eval = function (context) {
    if (context.isMathOn()) {
        return (new operation_1.default('*', [new dimension_1.default(-1), this.value])).eval(context);
    }
    return new Negative(this.value.eval(context));
};
Negative.prototype.type = 'Negative';
exports.default = Negative;
//# sourceMappingURL=negative.js.map