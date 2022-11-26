"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerLeadingBlank = void 0;
const to_lines_1 = __importDefault(require("@commitlint/to-lines"));
const message_1 = __importDefault(require("@commitlint/message"));
const footerLeadingBlank = (parsed, when = 'always') => {
    // Flunk if no footer is found
    if (!parsed.footer) {
        return [true];
    }
    const negated = when === 'never';
    const rawLines = to_lines_1.default(parsed.raw);
    const bodyLines = parsed.body ? to_lines_1.default(parsed.body) : [];
    const bodyOffset = bodyLines.length > 0 ? rawLines.indexOf(bodyLines[0]) : 1;
    const [leading] = rawLines.slice(bodyLines.length + bodyOffset);
    // Check if the first line of footer is empty
    const succeeds = leading === '';
    return [
        negated ? !succeeds : succeeds,
        message_1.default([
            'footer',
            negated ? 'may not' : 'must',
            'have leading blank line',
        ]),
    ];
};
exports.footerLeadingBlank = footerLeadingBlank;
//# sourceMappingURL=footer-leading-blank.js.map