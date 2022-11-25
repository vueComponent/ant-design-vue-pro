"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyLeadingBlank = void 0;
const to_lines_1 = __importDefault(require("@commitlint/to-lines"));
const message_1 = __importDefault(require("@commitlint/message"));
const bodyLeadingBlank = (parsed, when) => {
    // Flunk if no body is found
    if (!parsed.body) {
        return [true];
    }
    const negated = when === 'never';
    const [leading] = to_lines_1.default(parsed.raw).slice(1);
    // Check if the first line of body is empty
    const succeeds = leading === '';
    return [
        negated ? !succeeds : succeeds,
        message_1.default(['body', negated ? 'may not' : 'must', 'have leading blank line']),
    ];
};
exports.bodyLeadingBlank = bodyLeadingBlank;
//# sourceMappingURL=body-leading-blank.js.map