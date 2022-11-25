"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerFullStop = void 0;
const message_1 = __importDefault(require("@commitlint/message"));
const headerFullStop = (parsed, when = 'always', value = '.') => {
    const { header } = parsed;
    const negated = when === 'never';
    const hasStop = header[header.length - 1] === value;
    return [
        negated ? !hasStop : hasStop,
        message_1.default(['header', negated ? 'may not' : 'must', 'end with full stop']),
    ];
};
exports.headerFullStop = headerFullStop;
//# sourceMappingURL=header-full-stop.js.map