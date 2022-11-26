"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectMaxLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const subjectMaxLength = (parsed, _when = undefined, value = 0) => {
    const input = parsed.subject;
    if (!input) {
        return [true];
    }
    return [
        ensure_1.maxLength(input, value),
        `subject must not be longer than ${value} characters`,
    ];
};
exports.subjectMaxLength = subjectMaxLength;
//# sourceMappingURL=subject-max-length.js.map