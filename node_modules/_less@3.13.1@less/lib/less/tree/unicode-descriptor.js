"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = __importDefault(require("./node"));
var UnicodeDescriptor = function (value) {
    this.value = value;
};
UnicodeDescriptor.prototype = new node_1.default();
UnicodeDescriptor.prototype.type = 'UnicodeDescriptor';
exports.default = UnicodeDescriptor;
//# sourceMappingURL=unicode-descriptor.js.map