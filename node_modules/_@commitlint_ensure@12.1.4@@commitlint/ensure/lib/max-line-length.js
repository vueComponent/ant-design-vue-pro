"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const max_length_1 = __importDefault(require("./max-length"));
exports.default = (value, max) => typeof value === 'string' &&
    value.split(/\r?\n/).every((line) => max_length_1.default(line, max));
//# sourceMappingURL=max-line-length.js.map