"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signedOffBy = void 0;
const message_1 = __importDefault(require("@commitlint/message"));
const to_lines_1 = __importDefault(require("@commitlint/to-lines"));
const signedOffBy = (parsed, when = 'always', value = '') => {
    const lines = to_lines_1.default(parsed.raw).filter((ln) => 
    // skip comments
    !ln.startsWith('#') &&
        // ignore empty lines
        Boolean(ln));
    const last = lines[lines.length - 1];
    const negated = when === 'never';
    const hasSignedOffBy = last.startsWith(value);
    return [
        negated ? !hasSignedOffBy : hasSignedOffBy,
        message_1.default(['message', negated ? 'must not' : 'must', 'be signed off']),
    ];
};
exports.signedOffBy = signedOffBy;
//# sourceMappingURL=signed-off-by.js.map