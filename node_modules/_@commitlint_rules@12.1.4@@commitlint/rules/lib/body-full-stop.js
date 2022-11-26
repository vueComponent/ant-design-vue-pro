"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyFullStop = void 0;
const message_1 = __importDefault(require("@commitlint/message"));
const bodyFullStop = (parsed, when = 'always', value = '.') => {
    const input = parsed.body;
    if (!input) {
        return [true];
    }
    const negated = when === 'never';
    const hasStop = input[input.length - 1] === value;
    return [
        negated ? !hasStop : hasStop,
        message_1.default(['body', negated ? 'may not' : 'must', 'end with full stop']),
    ];
};
exports.bodyFullStop = bodyFullStop;
//# sourceMappingURL=body-full-stop.js.map