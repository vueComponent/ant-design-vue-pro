"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var Keyword = function (value) {
    this.value = value;
};
Keyword.prototype = new node_1.default();
Keyword.prototype.genCSS = function (context, output) {
    if (this.value === '%') {
        throw { type: 'Syntax', message: 'Invalid % without number' };
    }
    output.add(this.value);
};
Keyword.prototype.type = 'Keyword';
Keyword.True = new Keyword('true');
Keyword.False = new Keyword('false');
exports.default = Keyword;
//# sourceMappingURL=keyword.js.map