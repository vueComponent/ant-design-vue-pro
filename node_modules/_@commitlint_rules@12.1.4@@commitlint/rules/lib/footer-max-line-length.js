"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerMaxLineLength = void 0;
const ensure_1 = require("@commitlint/ensure");
const footerMaxLineLength = (parsed, _when = undefined, value = 0) => {
    const input = parsed.footer;
    if (!input) {
        return [true];
    }
    return [
        ensure_1.maxLineLength(input, value),
        `footer's lines must not be longer than ${value} characters`,
    ];
};
exports.footerMaxLineLength = footerMaxLineLength;
//# sourceMappingURL=footer-max-line-length.js.map