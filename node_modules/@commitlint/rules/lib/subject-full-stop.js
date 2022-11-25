"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectFullStop = void 0;
const message_1 = __importDefault(require("@commitlint/message"));
const subjectFullStop = (parsed, when = 'always', value = '.') => {
    const input = parsed.subject;
    if (!input) {
        return [true];
    }
    const negated = when === 'never';
    const hasStop = input[input.length - 1] === value;
    return [
        negated ? !hasStop : hasStop,
        message_1.default(['subject', negated ? 'may not' : 'must', 'end with full stop']),
    ];
};
exports.subjectFullStop = subjectFullStop;
//# sourceMappingURL=subject-full-stop.js.map