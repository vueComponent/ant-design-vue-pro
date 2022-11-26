"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyMaxLineLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const bodyMaxLineLength = (parsed, _when = undefined, value = 0) => {
    const input = parsed.body;
    if (!input) {
        return [true];
    }
    return [
        ensure_1.maxLineLength(input, value),
        `body's lines must not be longer than ${value} characters`,
    ];
};
exports.bodyMaxLineLength = bodyMaxLineLength;
//# sourceMappingURL=body-max-line-length.js.map