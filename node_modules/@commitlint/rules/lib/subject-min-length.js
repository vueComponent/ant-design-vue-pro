"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectMinLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const subjectMinLength = (parsed, _when = undefined, value = 0) => {
    const input = parsed.subject;
    if (!input) {
        return [true];
    }
    return [
        ensure_1.minLength(input, value),
        `subject must not be shorter than ${value} characters`,
    ];
};
exports.subjectMinLength = subjectMinLength;
//# sourceMappingURL=subject-min-length.js.map